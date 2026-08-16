const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('quickNotesDesktopStorage', {
  read(key) {
    return ipcRenderer.sendSync('quick-notes-storage:read', key);
  },
  write(key, value) {
    const ok = ipcRenderer.sendSync('quick-notes-storage:write', { key, value });
    if (ok !== false) ipcRenderer.send('quick-notes-storage:changed', { key });
    return ok;
  },
  getFlag(key) {
    return ipcRenderer.sendSync('quick-notes-storage:get-flag', key);
  },
  setFlag(key, value) {
    return ipcRenderer.sendSync('quick-notes-storage:set-flag', { key, value });
  }
});

contextBridge.exposeInMainWorld('quickNotesDesktop', {
  isDesktop: true,
  getVersion() {
    return ipcRenderer.sendSync('quick-notes-app:version');
  },
  isPackaged() {
    return ipcRenderer.sendSync('quick-notes-app:is-packaged');
  },
  getDataPath() {
    return ipcRenderer.invoke('quick-notes-app:data-path');
  },
  openDataFolder() {
    return ipcRenderer.invoke('quick-notes-app:open-data-folder');
  },
  openLessonMode() {
    return ipcRenderer.invoke('quick-notes-lesson:open');
  },
  exportBackup(data) {
    return ipcRenderer.invoke('quick-notes-backup:export', data);
  },
  importBackup() {
    return ipcRenderer.invoke('quick-notes-backup:import');
  },
  checkForUpdate() {
    return ipcRenderer.invoke('quick-notes-update:check');
  },
  downloadUpdate() {
    return ipcRenderer.invoke('quick-notes-update:download');
  },
  openDownloadedUpdate() {
    return ipcRenderer.invoke('quick-notes-update:open-downloaded');
  },
  onUpdateStatus(callback) {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on('quick-notes-update:status', handler);
    return () => ipcRenderer.removeListener('quick-notes-update:status', handler);
  },
  onStorageChanged(callback) {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on('quick-notes-storage:changed', handler);
    return () => ipcRenderer.removeListener('quick-notes-storage:changed', handler);
  }
});
