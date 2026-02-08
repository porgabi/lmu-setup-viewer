const { app, BrowserWindow, ipcMain, dialog, Menu, Tray } = require('electron');
const path = require('path');
const fs = require('fs');
const windowStateKeeper = require('electron-window-state');
const TRACK_INFO = require('./common/trackInfo');

// Use classic scrollbars so track styling can be applied consistently.
app.commandLine.appendSwitch('disable-features', 'OverlayScrollbar');

const SETTINGS_RELATIVE_PATH = path.join('UserData', 'player', 'Settings');
let tray = null;
let mainWindow = null;
let isQuitting = false;

function getTrayIconPath() {
  const fileName = 'favicon.ico';
  const devPath = path.join(__dirname, 'public', fileName);
  const buildPath = path.join(__dirname, 'build', fileName);
  return app.isPackaged ? buildPath : devPath;
}

function ensureTray() {
  if (tray) return tray;

  tray = new Tray(getTrayIconPath());
  tray.setToolTip('LMU Setup Viewer');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    if (!mainWindow) return;
    if (mainWindow.isVisible()) {
      mainWindow.focus();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  return tray;
}

function createWindow() {
  // Load previous state or use default values.
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1400,
    defaultHeight: 1000,
    maximize: true,
  });

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 1400,
    minHeight: 1000,
    title: 'LMU Setup Viewer',
    show: false,
    // autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindowState.manage(mainWindow);

  // Detect whether we're in development or production
  const isDev = !app.isPackaged;

  // Load the correct URL depending on mode
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'build', 'index.html')}`;

  mainWindow.loadURL(startUrl);
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', (event) => {
    if (isQuitting) return;

    const settings = store?.get('settings') || {};
    if (settings.minimizeToTrayOnClose) {
      event.preventDefault();
      mainWindow.hide();
      ensureTray();
    }
  });

  // Optional: open DevTools automatically in dev mode
  // if (isDev) {
  //   mainWindow.webContents.openDevTools();
  // }
}

const Store = require('electron-store');
let store;
const DEFAULT_SETTINGS = {
  diffHighlightEnabled: true,
  dropdownSortOrder: ['hy', 'lmgt3', 'lmp2_elms', 'lmp2_wec', 'gte', 'lmp3'],
  dropdownListSize: 'short',
  checkUpdatesOnLaunch: false,
  minimizeToTrayOnClose: false,
};

function getSettingsPath() {
  if (!store) return null;
  const rootPath = store.get('lmuPath');
  if (!rootPath) return null;
  return path.join(rootPath, SETTINGS_RELATIVE_PATH);
}

async function buildSetupIndex(settingsPath) {
  const result = {};
  const entries = await fs.promises.readdir(settingsPath, { withFileTypes: true });

  for (const entry of entries) {
    // Filter out unnecessary folders.
    if (entry.isDirectory() && entry.name in TRACK_INFO) {
      const folderPath = path.join(settingsPath, entry.name);
      const files = await fs.promises.readdir(folderPath, { withFileTypes: true });

      // Filter only for SVM files.
      const setupFiles = files.filter((file) => file.isFile() && file.name.endsWith('.svm'));
      const setupNames = await Promise.all(
        setupFiles.map(async (file) => {
          const name = path.parse(file.name).name;
          const fullPath = path.join(folderPath, file.name);
          let carTechnicalName = '';
          try {
            const data = await fs.promises.readFile(fullPath, 'utf-8');
            const match = data.match(/VehicleClassSetting\s*=\s*"([^"]+)"/);
            if (match && match[1]) {
              carTechnicalName = match[1].trim();
            }
          } catch (error) {
            console.warn(`Failed to read setup file ${fullPath}`, error);
          }
          return { name, carTechnicalName };
        })
      );

      if (setupNames.length > 0) {
        result[entry.name] = setupNames;
      }
    }
  }

  return result;
}

// Create window once Electron is ready
app.whenReady().then(() => {
  store = new Store.default();

  ipcMain.handle('get-lmu-path', () => {
    return store.get('lmuPath') || null;
  });

  ipcMain.handle('set-lmu-path', async () => {
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

  ipcMain.handle('get-track-info', () => {
    return TRACK_INFO;
  });

  ipcMain.handle('get-settings', () => {
    const stored = store.get('settings') || {};
    return { ...DEFAULT_SETTINGS, ...stored };
  });

  ipcMain.handle('set-settings', (event, payload = {}) => {
    const next = { ...DEFAULT_SETTINGS, ...payload };
    store.set('settings', next);
    return next;
  });

  ipcMain.handle('update-settings', (event, payload = {}) => {
    const current = store.get('settings') || {};
    const next = { ...DEFAULT_SETTINGS, ...current, ...payload };
    store.set('settings', next);
    return next;
  });

  ipcMain.handle('get-setup-index', async () => {
    try {
      const settingsPath = getSettingsPath();
      if (!settingsPath) return {};
      return await buildSetupIndex(settingsPath);
    } catch (err) {
      console.error('Error reading directories:', err);
      return {};
    }
  });

  ipcMain.handle('read-setup-file', async (event, payload = {}) => {
    try {
      const settingsPath = getSettingsPath();
      if (!settingsPath) return null;
      const { track, setupName } = payload;
      if (!track || !setupName) return null;
      const fullPath = path.join(settingsPath, track, `${setupName}.svm`);
      const data = await fs.promises.readFile(fullPath, 'utf-8');
      return data;
    } catch (err) {
      console.error('Error reading setup file:', err);
      return null;
    }
  });

  createWindow();
});

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return data;
  } catch (err) {
    console.error('Error reading file:', err);
    return null;
  }
});

ipcMain.handle('get-folder-file-map', async (event, rootPath) => {
  try {
    const settingsPath = rootPath || getSettingsPath();
    if (!settingsPath) return {};
    return await buildSetupIndex(settingsPath);
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

app.on('before-quit', () => {
  isQuitting = true;
});
