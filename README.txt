HOME LITE - TizenBrew proof-of-concept (English, lightweight)

Purpose:
- Test a direct Plex/Prime Video launcher on a Samsung UN43NU6900 / Tizen 4.0.
- Uses the same numeric Samsung app IDs successfully tested from Windows:
  Plex: 3201512006963; Prime: 3201512006785.
- Preserves the existing FrameHome module and Samsung Home.

INCLUDED FILES: package.json, index.html, service.js

Installation through TizenBrew:
1. Create a NEW public GitHub repository under your account, e.g. samsung-home-lite.
2. Upload the three files to the ROOT of that repository; commit them.
3. On TV: TizenBrew > Module Manager > Add GitHub Module.
4. Enter YOUR_GITHUB_USERNAME/samsung-home-lite (without gh/ if the field adds it).
5. Return to TizenBrew and launch Home Lite (Plex + Prime).
6. Test Plex first, then Prime. Do not enable autolaunch until both work.

IMPORTANT:
- Prototype: not yet tested on your TV. Node's localhost connection to Samsung's TV API must be verified.
- Developer Mode Host PC IP should remain 127.0.0.1 for TizenBrew.
- The helper binds to 127.0.0.1:47822; only opens Plex or Prime and cannot run arbitrary commands.
- TizenTube launch may be unsupported in this independent prototype; use TizenBrew to open it.
- No firmware modifications, SDB uninstall commands, or factory reset.
- If the helper returns unavailable, please report the precise message; we can inspect local backend behavior.
- These files are original example code, not a modified copy of FrameHome.
