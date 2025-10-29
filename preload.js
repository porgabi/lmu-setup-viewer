const { contextBridge, ipcRenderer } = require('electron');

// Safely expose limited Electron APIs to the renderer (React)
contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message) => ipcRenderer.send('message-from-renderer', message),
  onReply: (callback) => ipcRenderer.on('reply-from-main', (_, data) => callback(data)),
});
