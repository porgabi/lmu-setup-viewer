const { contextBridge, ipcRenderer } = require('electron');

// Safely expose limited Electron APIs to the renderer (React).
contextBridge.exposeInMainWorld('electronAPI', {
  onReply: (callback) => ipcRenderer.on('reply-from-main', (_, data) => callback(data)),
  getFolderFileMap: (folderPath) => ipcRenderer.invoke('get-folder-file-map', folderPath),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  getLmuPath: () => ipcRenderer.invoke('get-lmu-path'),
  setLmuPath: () => ipcRenderer.invoke('set-lmu-path'),
  getTrackInfo: () => ipcRenderer.invoke('get-track-info'),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  setSettings: (payload) => ipcRenderer.invoke('set-settings', payload),
  updateSettings: (payload) => ipcRenderer.invoke('update-settings', payload),
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  getZoomFactor: () => ipcRenderer.invoke('get-zoom-factor'),
  getSetupIndex: () => ipcRenderer.invoke('get-setup-index'),
  readSetupFile: (payload) => ipcRenderer.invoke('read-setup-file', payload),
  onZoomFactorChanged: (callback) => {
    const handler = (_event, zoomFactor) => callback(zoomFactor);
    ipcRenderer.on('zoom-factor-changed', handler);
    return () => ipcRenderer.removeListener('zoom-factor-changed', handler);
  },
});
