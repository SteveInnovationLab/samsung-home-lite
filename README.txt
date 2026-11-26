HOME LITE TV 0.4.2 — NATIVE LAUNCH TEST BUILD

Based on 0.4.1; preserves the redesigned dashboard and saved preferences.
Native launch uses tizen.application.launch and, on explicit error, launchAppControl.
Installed app display names are matched when getAppsInfo is permitted; known
native application IDs are fallback candidates. HTTP catalog IDs are separate.
If native launch fails, existing local helper remains a fallback.
No new access to PC files, tokens, or network ports.

BACK: closes internal menus first. From the main screen, returns to the
verified packaged TizenBrew menu referrer if available; otherwise calls the
Tizen host application's exit API. In the latter case reopen TizenBrew from
Samsung Home, without rebooting the TV. Actual on-device behavior is untested.
Disable TizenBrew autolaunch during testing if configured.

INSTALL: Upload index.html, package.json, service.js and README.txt to existing
SteveInnovationLab/samsung-home-lite repository. Commit. Restart TizenBrew
(not the TV if possible), check version 0.4.2. Test Prime Video, Plex and Back.
If a launch fails, record the exact native/HTTP error in the footer.
No Windows or Plex gateway changes necessary. Plex dashboard remains optional.
Native callbacks acknowledge a launch request, not visible playback.

References: Samsung Application API; TizenBrew manifest (commit c0e24d8);
community Samsung app-ID table (blog-razrabotchika/homebridge-samsung-tizen-applications);
Prime Video native ID also verified from user's Samsung application inventory.
