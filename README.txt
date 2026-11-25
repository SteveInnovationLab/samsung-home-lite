HOME LITE v0.3 -- SteveInnovationLab -- EXPERIMENTAL TV BUILD

WHAT CHANGED
- Neutral, minimalist home screen, without marketing taglines.
- Plex and Prime shortcuts use the same Samsung HTTP API method that worked on your TV.
- New Tubi, Netflix, Pluto TV, Samsung TV Plus, Samsung Apps and Media Player tiles.
- Manage Apps allows hide/show, reorder and adding a custom Samsung app (by app ID),
  all directly on the TV without changing GitHub files.
- App preferences are stored in the TV web module's localStorage; test persistence on
  your firmware. If TizenBrew changes the module origin or clears its storage,
  preferences may reset to the built-in defaults.

IMPORTANT LIMITATIONS
1. New Samsung Apps installations do NOT automatically show up as new shortcuts.
   Use the 'Manage Apps' tile and choose '+ Add App', then enter its installed
   Samsung application ID. Pre-configured app shortcuts can be hidden or shown.
2. Samsung Apps Store and Samsung TV Plus have built-in component IDs which
   might not work with the Samsung port 8001 app API. The tiles attempt the
   launch but explain the standard remote navigation if it fails.
3. Tubi, Netflix and Pluto TV buttons require those apps to be installed; IDs
   may differ by model. Netflix tries two known IDs.
4. VLC does not have an official app for this Tizen 4 TV. The 'Media Player'
   tile attempts to launch the separate Network Explorer TizenBrew module;
   you need to publish/install that separately. Codec and streaming support
   are limited by the Samsung TV's media decoder.
5. TizenTube and Network Explorer module switching uses TizenBrew's local
   WebSocket API and still needs testing with this model/firmware.
6. This is NOT a replacement for Samsung's actual Home key/menu or TV OS.

INSTALL (AFTER YOU HAVE CONFIRMED THE v0.2 BUILD WORKS)
1. Extract this ZIP on your Windows PC.
2. On GitHub open https://github.com/SteveInnovationLab/samsung-home-lite
3. Upload and REPLACE index.html, package.json, service.js together.
   Use the GitHub web interface: Add file -> Upload files -> Commit changes.
4. Restart TizenBrew fully, then start Home Lite. Look for '0.3' near Home Lite.
   GitHub/jsDelivr caching can mean you see the old version for a while.
5. Test Plex and Prime Video FIRST. If those still work, test Tubi and
   the other shortcuts. Apps not installed are expected to fail gracefully.

REMOTE
Home: Left/Right/Up/Down move between tiles, OK launches.
Manage Apps: Up/Down selects row, OK hide/show or select action,
  Left/Right reorders selected item, Back saves/exits.
  Red remote button deletes a CUSTOM shortcut only.
Add App: enter name and app ID with the TV keyboard, then Save shortcut.

SECURITY
The TizenBrew service binds to 127.0.0.1 only, accepts only app IDs, and
never reads computer files or shares credentials. Don't put any private
passwords, tokens or files in a public GitHub repository.
