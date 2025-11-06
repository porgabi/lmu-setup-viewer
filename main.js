
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const windowStateKeeper = require('electron-window-state');
const COUNTRY_CODES = require('./common/countryCodes');

function createWindow() {
  // Load previous state or use default values.
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1400,
    defaultHeight: 1000,
    maximize: true,
  });
  
  const mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 1400,
    minHeight: 1000,
    title: 'LMU Setup Viewer',
    // autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindowState.manage(mainWindow);
  
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
}
  
const Store = require('electron-store');
let store;
  
// Create window once Electron is ready
app.whenReady().then(() => {
  store = new Store.default();

  ipcMain.handle('get-lmu-path', () => {
    return store.get('lmuPath') || null;
  });

  ipcMain.handle('set-lmu-path', async (event) => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const selectedPath = result.filePaths[0];
      store.set('lmuPath', selectedPath);
      return selectedPath;
    }

    return null;
  });

  createWindow();
});

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    console.log(filePath);
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return data;
  } catch (err) {
    console.error('Error reading file:', err);
    return null;
  }
});

ipcMain.handle('get-folder-file-map', async (event, rootPath) => {
  try {
    const result = {};
    const entries = await fs.promises.readdir(rootPath, { withFileTypes: true });

    for (const entry of entries) {
      // Filter out unnecessary folders.
      if (entry.isDirectory() && entry.name in COUNTRY_CODES) {
        const folderPath = path.join(rootPath, entry.name);
        const files = await fs.promises.readdir(folderPath, { withFileTypes: true });

        // Filter only for SVM files.
        const fileNames = files
          .filter((f) => f.isFile() && f.name.endsWith('.svm'))
          .map((f) => f.name);

        const countryCode = COUNTRY_CODES[entry.name];
        console.log(countryCode);

        result[entry.name] = fileNames;
      }
    }

    return result;
  } catch (err) {
    console.error('Error reading directories:', err);
    return {};
  }
});

// macOS behavior
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Quit app when all windows are closed (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
