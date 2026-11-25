'use strict';
// Home Lite 0.3 — TV-only helper. No shell access, credentials, or file access.
// Samsung app IDs are routed to the TV's own HTTP API. The service does not
// accept arbitrary URLs or IP addresses from the browser.
var http = require('http');
var os = require('os');
var PORT = 47822;
var KNOWN = {
  plex: ['3201512006963'],
  prime: ['3201512006785'],
  tubi: ['3201504001965'],
  netflix: ['11101200001', '3201907018807'],
  pluto: ['3201808016802'],
  tvplus: ['com.samsung.tv.tvPlusDeeplinker'],
  store: ['com.samsung.tv.store', 'org.volt.apps']
};
var APP_ID_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{1,119}$/;
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
function hostCandidates() {
  var out = ['127.0.0.1'];
  var nets = os.networkInterfaces();
  Object.keys(nets).forEach(function (key) {
    (nets[key] || []).forEach(function (net) {
      var ip = net.address || '';
      if ((net.family === 'IPv4' || net.family === 4) && !net.internal &&
          (/^192\.168\./.test(ip) || /^10\./.test(ip) || /^172\.(1[6-9]|2\d|3[01])\./.test(ip))) {
        if (out.indexOf(ip) < 0) out.push(ip);
      }
    });
  });
  return out;
}
function launch(ids, callback) {
  var hosts = hostCandidates();
  var jobs = [];
  for (var i = 0; i < ids.length; i++) for (var j = 0; j < hosts.length; j++) jobs.push({id: ids[i], host: hosts[j]});
  var n = 0;
  var errors = [];
  function next() {
    if (n >= jobs.length) return callback(new Error(errors[errors.length - 1] || 'No working app launch method'));
    var job = jobs[n++];
    var finished = false;
    function proceed(error) {
      if (finished) return;
      finished = true;
      if (error) errors.push(error);
      next();
    }
    var req = http.request({host: job.host, port: 8001, method: 'POST', path: '/api/v2/applications/' + encodeURIComponent(job.id), timeout: 2200}, function (res) {
      var body = '';
      res.setEncoding('utf8');
      res.on('data', function (chunk) {if(body.length < 300) body += chunk;});
      res.on('end', function () {
        if (finished) return;
        if (res.statusCode === 200 && body.trim() === 'true') {
          finished = true;
          callback(null, {id: job.id});
        } else proceed(job.id + ': HTTP ' + res.statusCode);
      });
      res.on('error', function (e) {proceed(e.message);});
    });
    req.on('error', function (e) {proceed(e.message);});
    req.on('timeout', function () {req.destroy(new Error('TV launch timeout'));});
    req.end();
  }
  next();
}
function readBody(req, cb) {
  var body = '';
  req.on('data', function (chunk) {
    body += chunk;
    if (body.length > 3000) req.destroy(new Error('Request too long'));
  });
  req.on('end', function () {try {cb(null, JSON.parse(body || '{}'));} catch (e) {cb(e);}});
  req.on('error', function (e) {cb(e);});
}
var server = http.createServer(function (req, res) {
  var path = (req.url || '').split('?')[0];
  if (req.method === 'OPTIONS') return reply(res, 200, {ok: true});
  if (req.method === 'GET' && path === '/health') return reply(res, 200, {ok: true, version: '0.3'});
  if (req.method !== 'POST') return reply(res, 404, {ok: false, error: 'Not found'});
  var match = /^\/launch\/([a-z]+)$/.exec(path);
  if (!match) return reply(res, 404, {ok: false, error: 'Not found'});
  var app = match[1];
  function doLaunch(ids) {
    launch(ids, function (err, result) {
      if (err) return reply(res, 502, {ok: false, error: err.message});
      reply(res, 200, {ok: true, id: result.id});
    });
  }
  if (KNOWN[app]) return doLaunch(KNOWN[app]);
  if (app !== 'custom') return reply(res, 404, {ok: false, error: 'Unknown shortcut'});
  readBody(req, function (err, data) {
    if (err) return reply(res, 400, {ok: false, error: 'Invalid request'});
    var ids = data && data.ids;
    if (!Array.isArray(ids) || !ids.length || ids.length > 3 || ids.some(function (id) {
      return typeof id !== 'string' || !APP_ID_RE.test(id);
    })) return reply(res, 400, {ok: false, error: 'Invalid Samsung application ID'});
    doLaunch(ids);
  });
});
server.on('error', function(e) {console.log('[Home Lite] Helper error: ' + e.message);});
server.listen(PORT, '127.0.0.1', function() {console.log('[Home Lite] v0.3 listening on localhost:' + PORT);});
