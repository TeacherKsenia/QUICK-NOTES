# QUICK NOTES — desktop build

## What the desktop version does

- Windows desktop app built with Electron.
- Main workspace data is stored as a real JSON file in:
  `Documents\QUICK NOTES\data\workspace.json`
- Flags are stored in `Documents\QUICK NOTES\data\flags.json`.
- Automatic daily backups are stored in:
  `Documents\QUICK NOTES\backups\auto\`
- The newest 15 automatic daily backups are kept.
- Fresh installs start empty and use Midnight Focus by default.
- Settings → Data & Backup can export a portable JSON backup and restore it on another computer.


## Fresh install vs existing data

The installer never ships a personal `workspace.json`. New users start empty. Existing users keep the data already stored in `Documents\QUICK NOTES` when they update the app. This is intentional so an update never wipes notes.

## Test the desktop app locally

Double-click `START_DESKTOP_DEV.bat`.

On the first run it installs Electron dependencies with npm, then opens the desktop app.

## Build a Windows installer manually

Double-click `BUILD_DESKTOP.bat`.

Result:

`dist\Quick-Notes-Setup.exe`

## GitHub Release / Update button

The web version shows `Install`.

The web version shows `Install`. The desktop version checks the latest public GitHub Release automatically on startup. The update control stays hidden when the installed version is current or the check is unavailable. If a newer release exists, the button appears as `Update`; after download it becomes `Open update`.

### Recommended release process

1. Change `version` in `package.json`, for example from `1.0.0` to `1.0.1`.
2. Commit the change.
3. Create and push a matching tag:
   `git tag v1.0.1`
   `git push origin v1.0.1`
4. `.github/workflows/release-windows.yml` builds `Quick-Notes-Setup.exe` and creates a GitHub Release automatically.
5. Existing desktop installations will see the newer release on their next update check.

The release workflow automatically stamps the current GitHub repository URL into the packaged application, so the desktop update checker knows which repository to query.

## Install button on GitHub Pages

When the web app is hosted at `https://OWNER.github.io/REPO/`, it detects OWNER and REPO automatically and downloads the `.exe` asset from the latest GitHub Release.

If you use a custom domain or test the web version from a local file, set `githubOwner` and `githubRepo` in `src/core/release-config.js`.

## Important

A normal website cannot reliably detect whether an arbitrary Windows desktop program is already installed. Therefore:

- browser / GitHub Pages = `Install`
- installed Electron app + newer release = `Update`
- installed Electron app + current release = update button hidden

This avoids unreliable browser hacks and keeps update detection inside the installed application.


## Install / Update button states

- Web/GitHub Pages: **Install**
- Development launch via `START_DESKTOP_DEV.bat`: update button hidden
- Installed desktop app, latest version: update button hidden
- Installed desktop app, newer GitHub Release available: **Update**
- Download finished: **Open update**

The development build intentionally does not run the GitHub update check.

## System tray and desktop Lesson Mode

The installed desktop app stays available in the Windows system tray. Clicking the QUICK NOTES tray icon opens a menu with:

- **Lesson mode** — opens the compact always-on-top capture window without restoring the full app.
- **Open QUICK NOTES** — restores the main window.
- **Exit** — quits the application completely.

Closing the main window hides it to the tray. Lesson Mode uses the same local `Documents\\QUICK NOTES\\data\\workspace.json` file as the main app, so notes captured during a lesson appear in the main workspace automatically.

For the installed desktop app, the Install/Update control is hidden while there is no update (and also when update checking is unavailable). It is shown only when an update can actually be downloaded or opened.
