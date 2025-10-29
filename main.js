const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Detect whether we’re in development or production
  const isDev = !app.isPackaged;

  // Load the correct URL depending on mode
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'build', 'index.html')}`;

  mainWindow.loadURL(startUrl);

  // Optional: open DevTools automatically in dev mode
//   if (isDev) {
//     mainWindow.webContents.openDevTools();
//   }

  // Handle messages from renderer (IPC example)
  ipcMain.on('message-from-renderer', (event, message) => {
    console.log('Received from React:', message);
    const reply = `Main process got your message: "${message}"`;
    event.sender.send('reply-from-main', reply);
  });
}

// Create window once Electron is ready
app.whenReady().then(createWindow);

// macOS behavior
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Quit app when all windows are closed (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
