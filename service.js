'use strict';
// Companion service inside TizenBrew, bound to loopback only.
// Allows only two fixed application IDs; it does not expose a general shell or proxy.
var http = require('http');
var os = require('os');
var PORT = 47822;
var APP_IDS = { plex: '3201512006963', prime: '3201512006785' };
function reply(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(data));
}
function hosts() {
  var list = ['127.0.0.1'];
  var nets = os.networkInterfaces();
  Object.keys(nets).forEach(function (key) {
    (nets[key] || []).forEach(function (net) {
      if ((net.family === 'IPv4' || net.family === 4) && !net.internal && /^192\.168\.|^10\.|^172\.(1[6-9]|2\d|3[01])\./.test(net.address)) {
        if (list.indexOf(net.address) < 0) list.push(net.address);
      }
    });
  });
  return list;
}
function launch(appKey, cb) {
  var id = APP_IDS[appKey];
  if (!id) return cb(new Error('Unknown app'));
  var hostList = hosts(), i = 0;
  function attempt(lastError) {
    if (i >= hostList.length) return cb(lastError || new Error('TV app API unreachable'));
    var host = hostList[i++];
    var request = http.request({ host: host, port: 8001, method: 'POST', path: '/api/v2/applications/' + id, timeout: 2500 }, function (response) {
      var content = '';
      response.setEncoding('utf8');
      response.on('data', function (chunk) { if (content.length < 400) content += chunk; });
      response.on('end', function () {
        if (response.statusCode === 200 && content.trim() === 'true') cb(null, { host: host, httpStatus: 200 });
        else attempt(new Error('TV API HTTP ' + response.statusCode + ' (' + content.slice(0, 60) + ')'));
      });
    });
    request.on('error', attempt);
    request.on('timeout', function () { request.destroy(new Error('TV API timeout')); });
    request.end();
  }
  attempt();
}
var server = http.createServer(function (req, res) {
  var path = (req.url || '').split('?')[0];
  if (req.method === 'OPTIONS') return reply(res, 200, { ok: true });
  if (path === '/health' && req.method === 'GET') return reply(res, 200, { ok: true, service: 'Home Lite helper' });
  var m = /^\/launch\/(plex|prime)$/.exec(path);
  if (!m || req.method !== 'POST') return reply(res, 404, { ok: false, error: 'Unsupported route' });
  launch(m[1], function (err, info) {
    if (err) { console.log('[Home Lite] Launch failed: ' + err.message); return reply(res, 502, { ok: false, error: err.message }); }
    console.log('[Home Lite] Launched ' + m[1] + ' using ' + info.host);
    reply(res, 200, { ok: true, app: m[1] });
  });
});
server.on('error', function (e) { console.log('[Home Lite] Server error: ' + e.message); });
server.listen(PORT, '127.0.0.1', function () { console.log('[Home Lite] helper on 127.0.0.1:' + PORT); });
