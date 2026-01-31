const { contextBridge, ipcRenderer } = require('electron');

// Safely expose limited Electron APIs to the renderer (React).
contextBridge.exposeInMainWorld('electronAPI', {
  onReply: (callback) => ipcRenderer.on('reply-from-main', (_, data) => callback(data)),
  getFolderFileMap: (folderPath) => ipcRenderer.invoke('get-folder-file-map', folderPath),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  getLmuPath: () => ipcRenderer.invoke('get-lmu-path'),
  setLmuPath: () => ipcRenderer.invoke('set-lmu-path'),
  getTrackInfo: () => ipcRenderer.invoke('get-track-info'),
  getSetupIndex: () => ipcRenderer.invoke('get-setup-index'),
  readSetupFile: (payload) => ipcRenderer.invoke('read-setup-file', payload),
});
