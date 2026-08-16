const { app, BrowserWindow, dialog, ipcMain, shell, session, Tray, Menu } = require('electron');
const fs = require('node:fs');
const path = require('node:path');

const STORAGE_KEY = 'quick-notes-workspace-v1';
const APP_FOLDER_NAME = 'QUICK NOTES';
const INSTALLER_ASSET = 'Quick-Notes-Setup.exe';
const AUTO_BACKUP_LIMIT = 15;

let mainWindow = null;
let lessonWindow = null;
let tray = null;
let isQuitting = false;
let downloadedInstallerPath = '';
let latestRelease = null;
let updateCheckInFlight = null;

function appRoot() {
  return path.join(app.getPath('documents'), APP_FOLDER_NAME);
}

function dataDir() {
  return path.join(appRoot(), 'data');
}

function backupsDir() {
  return path.join(appRoot(), 'backups');
}

function autoBackupsDir() {
  return path.join(backupsDir(), 'auto');
}

function ensureDataFolders() {
  fs.mkdirSync(dataDir(), { recursive: true });
  fs.mkdirSync(backupsDir(), { recursive: true });
  fs.mkdirSync(autoBackupsDir(), { recursive: true });
}

function safeFilePart(value) {
  return String(value).replace(/[^a-z0-9._-]+/gi, '-').replace(/^-+|-+$/g, '') || 'data';
}

function storagePathForKey(key) {
  return path.join(dataDir(), key === STORAGE_KEY ? 'workspace.json' : `${safeFilePart(key)}.json`);
}

function flagsPath() {
  return path.join(dataDir(), 'flags.json');
}

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Could not read JSON: ${filePath}`, error);
    return fallback;
  }
}

function writeJson(filePath, value) {
  ensureDataFolders();
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  try {
    fs.renameSync(tempPath, filePath);
  } catch {
    try { fs.rmSync(filePath, { force: true }); } catch {}
    fs.renameSync(tempPath, filePath);
  }
}

function dateStamp(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function createDailyAutoBackup() {
  ensureDataFolders();
  const workspacePath = storagePathForKey(STORAGE_KEY);
  if (!fs.existsSync(workspacePath)) return;

  const target = path.join(autoBackupsDir(), `QuickNotes-auto-${dateStamp()}.json`);
  if (!fs.existsSync(target)) fs.copyFileSync(workspacePath, target);

  const backups = fs.readdirSync(autoBackupsDir())
    .filter(name => /^QuickNotes-auto-\d{4}-\d{2}-\d{2}\.json$/i.test(name))
    .map(name => ({ name, fullPath: path.join(autoBackupsDir(), name), mtime: fs.statSync(path.join(autoBackupsDir(), name)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);

  backups.slice(AUTO_BACKUP_LIMIT).forEach(item => {
    try { fs.rmSync(item.fullPath, { force: true }); } catch {}
  });
}

function normalizeVersion(value) {
  return String(value || '').trim().replace(/^v/i, '').split('-')[0];
}

function compareVersions(a, b) {
  const left = normalizeVersion(a).split('.').map(part => Number(part) || 0);
  const right = normalizeVersion(b).split('.').map(part => Number(part) || 0);
  const length = Math.max(left.length, right.length, 3);
  for (let index = 0; index < length; index += 1) {
    const l = left[index] || 0;
    const r = right[index] || 0;
    if (l > r) return 1;
    if (l < r) return -1;
  }
  return 0;
}

function repositoryInfo() {
  const pkg = require(path.join(app.getAppPath(), 'package.json'));
  const repository = typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url;
  if (!repository) return null;
  const match = String(repository).match(/github\.com[/:]([^/]+)\/([^/#]+?)(?:\.git)?$/i);
  return match ? { owner: match[1], repo: match[2] } : null;
}

function sendUpdateStatus(payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('quick-notes-update:status', {
      currentVersion: app.getVersion(),
      ...payload
    });
  }
}

async function fetchLatestRelease() {
  const repository = repositoryInfo();
  if (!repository) {
    const result = { ok: false, reason: 'repository-not-configured', currentVersion: app.getVersion() };
    sendUpdateStatus({ state: 'unavailable', ...result });
    return result;
  }

  if (updateCheckInFlight) return updateCheckInFlight;

  updateCheckInFlight = (async () => {
    try {
      sendUpdateStatus({ state: 'checking' });
      const response = await fetch(`https://api.github.com/repos/${repository.owner}/${repository.repo}/releases/latest`, {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'quick-notes-desktop'
        }
      });
      if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
      const release = await response.json();
      const installer = Array.isArray(release.assets)
        ? release.assets.find(asset => asset.name === INSTALLER_ASSET || /\.exe$/i.test(asset.name))
        : null;
      const latestVersion = normalizeVersion(release.tag_name || release.name);
      const available = Boolean(installer && latestVersion && compareVersions(latestVersion, app.getVersion()) > 0);
      latestRelease = installer ? { version: latestVersion, url: installer.browser_download_url, assetName: installer.name } : null;
      const result = {
        ok: true,
        available,
        currentVersion: app.getVersion(),
        latestVersion,
        installerFound: Boolean(installer)
      };
      sendUpdateStatus({ state: available ? 'available' : 'current', ...result });
      return result;
    } catch (error) {
      console.error('Update check failed.', error);
      const result = { ok: false, reason: 'network-error', message: error.message, currentVersion: app.getVersion() };
      sendUpdateStatus({ state: 'error', ...result });
      return result;
    } finally {
      updateCheckInFlight = null;
    }
  })();

  return updateCheckInFlight;
}

function uniqueDownloadPath(version) {
  const baseName = version ? `Quick-Notes-Setup-${safeFilePart(version)}.exe` : INSTALLER_ASSET;
  let candidate = path.join(app.getPath('downloads'), baseName);
  let index = 2;
  while (fs.existsSync(candidate)) {
    candidate = path.join(app.getPath('downloads'), baseName.replace(/\.exe$/i, `-${index}.exe`));
    index += 1;
  }
  return candidate;
}

async function downloadLatestInstaller() {
  if (!latestRelease) {
    const check = await fetchLatestRelease();
    if (!check.available || !latestRelease) return { ok: false, reason: check.reason || 'no-update' };
  }

  const targetPath = uniqueDownloadPath(latestRelease.version);
  downloadedInstallerPath = '';

  return new Promise(resolve => {
    const ses = mainWindow.webContents.session;
    const onWillDownload = (_event, item) => {
      ses.removeListener('will-download', onWillDownload);
      item.setSavePath(targetPath);
      sendUpdateStatus({ state: 'downloading', percent: 0, latestVersion: latestRelease.version });

      item.on('updated', (_downloadEvent, state) => {
        if (state === 'progressing' && !item.isPaused()) {
          const total = item.getTotalBytes();
          const received = item.getReceivedBytes();
          const percent = total > 0 ? Math.round((received / total) * 100) : 0;
          sendUpdateStatus({ state: 'downloading', percent, latestVersion: latestRelease.version });
        }
      });

      item.once('done', (_doneEvent, state) => {
        if (state === 'completed') {
          downloadedInstallerPath = targetPath;
          sendUpdateStatus({ state: 'downloaded', filePath: targetPath, latestVersion: latestRelease.version });
          resolve({ ok: true, filePath: targetPath, version: latestRelease.version });
        } else {
          sendUpdateStatus({ state: 'error', reason: 'download-failed', downloadState: state });
          resolve({ ok: false, reason: 'download-failed', downloadState: state });
        }
      });
    };

    ses.on('will-download', onWillDownload);
    mainWindow.webContents.downloadURL(latestRelease.url);
  });
}

function appIconPath() {
  return path.join(app.getAppPath(), 'assets', 'icons', 'app-icon.ico');
}

function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createMainWindow();
    return;
  }
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
}

function openLessonWindow() {
  if (lessonWindow && !lessonWindow.isDestroyed()) {
    if (lessonWindow.isMinimized()) lessonWindow.restore();
    lessonWindow.show();
    lessonWindow.focus();
    return lessonWindow;
  }

  lessonWindow = new BrowserWindow({
    width: 460,
    height: 590,
    minWidth: 400,
    minHeight: 500,
    resizable: true,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    backgroundColor: '#f5f6f8',
    icon: appIconPath(),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  lessonWindow.loadFile(path.join(__dirname, 'lesson.html'));
  lessonWindow.once('ready-to-show', () => {
    if (!lessonWindow || lessonWindow.isDestroyed()) return;
    lessonWindow.show();
    lessonWindow.focus();
  });
  lessonWindow.on('closed', () => { lessonWindow = null; });
  return lessonWindow;
}

function createTray() {
  if (tray) return tray;
  tray = new Tray(appIconPath());
  tray.setToolTip('QUICK NOTES');
  const menu = Menu.buildFromTemplate([
    { label: 'Lesson mode', click: () => openLessonWindow() },
    { label: 'Open QUICK NOTES', click: () => showMainWindow() },
    { type: 'separator' },
    { label: 'Exit', click: () => { isQuitting = true; app.quit(); } }
  ]);
  tray.setContextMenu(menu);
  tray.on('click', () => tray.popUpContextMenu());
  return tray;
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1050,
    minHeight: 680,
    backgroundColor: '#07162d',
    icon: appIconPath(),
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'index.html'));
  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.on('close', event => {
    if (isQuitting) return;
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https:\/\//i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url !== mainWindow.webContents.getURL()) event.preventDefault();
  });

  mainWindow.webContents.once('did-finish-load', () => {
    if (app.isPackaged) setTimeout(() => fetchLatestRelease(), 2500);
  });
}

function registerIpc() {
  ipcMain.on('quick-notes-storage:read', (event, key) => {
    ensureDataFolders();
    event.returnValue = readJson(storagePathForKey(key), null);
  });

  ipcMain.on('quick-notes-storage:write', (event, { key, value }) => {
    try {
      writeJson(storagePathForKey(key), value);
      event.returnValue = true;
    } catch (error) {
      console.error('Could not write workspace data.', error);
      event.returnValue = false;
    }
  });

  ipcMain.on('quick-notes-storage:get-flag', (event, key) => {
    const flags = readJson(flagsPath(), {});
    event.returnValue = Object.prototype.hasOwnProperty.call(flags, key) ? flags[key] : null;
  });

  ipcMain.on('quick-notes-storage:set-flag', (event, { key, value }) => {
    try {
      const flags = readJson(flagsPath(), {});
      flags[key] = value;
      writeJson(flagsPath(), flags);
      event.returnValue = true;
    } catch (error) {
      console.error('Could not save flag.', error);
      event.returnValue = false;
    }
  });

  ipcMain.on('quick-notes-app:version', event => {
    event.returnValue = app.getVersion();
  });

  ipcMain.on('quick-notes-app:is-packaged', event => {
    event.returnValue = app.isPackaged;
  });

  ipcMain.handle('quick-notes-app:data-path', async () => {
    ensureDataFolders();
    return appRoot();
  });

  ipcMain.handle('quick-notes-app:open-data-folder', async () => {
    ensureDataFolders();
    const error = await shell.openPath(appRoot());
    return { ok: !error, error };
  });

  ipcMain.handle('quick-notes-backup:export', async (_event, data) => {
    ensureDataFolders();
    const defaultName = `QuickNotes-backup-${dateStamp()}.json`;
    const result = await dialog.showSaveDialog(mainWindow, {
      title: 'Export QUICK NOTES backup',
      defaultPath: path.join(backupsDir(), defaultName),
      filters: [{ name: 'QUICK NOTES backup', extensions: ['json'] }]
    });
    if (result.canceled || !result.filePath) return { ok: false, canceled: true };
    try {
      writeJson(result.filePath, { ...data, exportedAt: new Date().toISOString(), quickNotesBackup: 1 });
      return { ok: true, filePath: result.filePath };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  });

  ipcMain.handle('quick-notes-backup:import', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Restore QUICK NOTES backup',
      properties: ['openFile'],
      filters: [{ name: 'QUICK NOTES backup', extensions: ['json'] }]
    });
    if (result.canceled || !result.filePaths[0]) return { ok: false, canceled: true };
    try {
      const data = JSON.parse(fs.readFileSync(result.filePaths[0], 'utf8'));
      return { ok: true, data, filePath: result.filePaths[0] };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  });

  ipcMain.on('quick-notes-storage:changed', (event, payload = {}) => {
    BrowserWindow.getAllWindows().forEach(win => {
      if (!win.isDestroyed() && win.webContents.id !== event.sender.id) {
        win.webContents.send('quick-notes-storage:changed', payload);
      }
    });
  });

  ipcMain.handle('quick-notes-lesson:open', async () => {
    openLessonWindow();
    return { ok: true };
  });

  ipcMain.handle('quick-notes-update:check', () => fetchLatestRelease());
  ipcMain.handle('quick-notes-update:download', () => downloadLatestInstaller());
  ipcMain.handle('quick-notes-update:open-downloaded', async () => {
    if (!downloadedInstallerPath || !fs.existsSync(downloadedInstallerPath)) return { ok: false, reason: 'missing-file' };
    const error = await shell.openPath(downloadedInstallerPath);
    return { ok: !error, error, filePath: downloadedInstallerPath };
  });
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => showMainWindow());

  app.whenReady().then(() => {
    ensureDataFolders();
    createDailyAutoBackup();
    registerIpc();
    createMainWindow();
    createTray();

    app.on('activate', () => {
      showMainWindow();
    });
  });
}

app.on('before-quit', () => { isQuitting = true; });

app.on('window-all-closed', () => {
  // Keep QUICK NOTES alive in the system tray. Use Tray > Exit to quit.
});
