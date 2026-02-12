const { app, BrowserWindow, ipcMain, dialog, Menu, Tray, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const windowStateKeeper = require('electron-window-state');
const TRACK_INFO = require('./common/trackInfo');

// Use classic scrollbars so track styling can be applied consistently.
app.commandLine.appendSwitch('disable-features', 'OverlayScrollbar');

const SETTINGS_RELATIVE_PATH = path.join('UserData', 'player', 'Settings');
const UPDATE_REPO = {
  owner: 'porgabi',
  repo: 'lmu-setup-viewer',
};

let tray = null;
let mainWindow = null;
let isQuitting = false;

function mapInputToHotkeyCommand(input) {
  if (!input || input.type !== 'keyDown' || input.isAutoRepeat) {
    return null;
  }

  const key = String(input.key || '').toLowerCase();
  const hasCtrlOnly = Boolean(input.control && !input.shift && !input.alt && !input.meta);
  const hasCtrlShiftOnly = Boolean(input.control && input.shift && !input.alt && !input.meta);
  const hasNoModifiers = Boolean(!input.control && !input.shift && !input.alt && !input.meta);

  if (hasCtrlShiftOnly && key === 'tab') {
    return 'cycle-tabs-backward';
  }

  if (hasCtrlOnly && key === 'tab') {
    return 'cycle-tabs-forward';
  }

  if (!hasNoModifiers) {
    return null;
  }

  if (key === 'o') return 'open-options';
  if (key === 'r') return 'reload-setups';
  if (key === '1') return 'open-selector-1';
  if (key === '2') return 'open-selector-2';
  if (key === 'c') return 'toggle-comparison';

  return null;
}

function getTrayIconPath() {
  const iconName = process.platform === 'win32' ? 'app.ico' : 'app.png';
  const unpackedPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'assets', 'icons', iconName);
  if (fs.existsSync(unpackedPath)) return unpackedPath;

  const packagedPath = path.join(__dirname, 'assets', 'icons', iconName);
  if (fs.existsSync(packagedPath)) return packagedPath;

  return path.join(process.cwd(), 'assets', 'icons', iconName);
}

function ensureTray() {
  if (tray) return tray;

  try {
    tray = new Tray(getTrayIconPath());
  } catch (error) {
    console.error('Failed to create tray icon.', error);
    tray = null;
    return null;
  }
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

function normalizeVersionString(input) {
  if (!input) return null;
  const cleaned = String(input).trim().replace(/^v/i, '');
  const match = cleaned.match(/\d+(?:\.\d+){0,2}/);
  if (!match) return null;

  const parts = match[0].split('.');
  while (parts.length < 3) parts.push('0');
  return parts.join('.');
}

function compareSemver(a, b) {
  const aParts = a.split('.').map((value) => Number(value || 0));
  const bParts = b.split('.').map((value) => Number(value || 0));
  for (let index = 0; index < 3; index += 1) {
    if (aParts[index] > bParts[index]) return 1;
    if (aParts[index] < bParts[index]) return -1;
  }
  return 0;
}

function fetchJson(url) {
  const REQUEST_TIMEOUT_MS = 8000;

  return new Promise((resolve, reject) => {
    const request = https.request(
      url,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'LMU-Setup-Viewer',
        },
      },
      (response) => {
        let body = '';
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.on('end', () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`Request failed (${response.statusCode}).`));
            return;
          }
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    request.setTimeout(REQUEST_TIMEOUT_MS, () => {
      request.destroy(new Error(`Request timed out after ${REQUEST_TIMEOUT_MS}ms.`));
    });
    request.on('error', reject);
    request.end();
  });
}

async function fetchJsonWithRetry(url, retries = 1) {
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fetchJson(url);
    } catch (error) {
      lastError = error;
      if (attempt === retries) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  throw lastError || new Error('Request failed.');
}

function getDownloadUrl(release) {
  return release.html_url || '';
}

function createWindow() {
  // Load previous state or use default values.
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1400,
    defaultHeight: 1000,
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
    icon: getTrayIconPath(),
    autoHideMenuBar: true,
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
    : null;

  if (isDev) {
    mainWindow.loadURL(startUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  }
  mainWindow.once('ready-to-show', () => {
    const settings = store?.get('settings') || DEFAULT_SETTINGS;
    if (!settings.startMinimized) {
      mainWindow.show();
    }
  });

  if (mainWindowState.isMaximized) {
    mainWindow.maximize();
  }

  const storedSettings = store?.get('settings') || DEFAULT_SETTINGS;
  applyZoomFactor(storedSettings);
  applyAlwaysOnTop(storedSettings);

  mainWindow.webContents.on('zoom-changed', syncZoomFromWebContents);
  mainWindow.webContents.on('did-change-zoom-level', syncZoomFromWebContents);
  mainWindow.webContents.on('before-input-event', (event, input) => {
    const command = mapInputToHotkeyCommand(input);
    if (!command) return;
    event.preventDefault();
    mainWindow.webContents.send('hotkey-command', command);
  });

  mainWindow.on('close', (event) => {
    if (isQuitting) return;

    const settings = store?.get('settings') || {};
    if (settings.minimizeToTrayOnClose) {
      const trayInstance = ensureTray();
      if (!trayInstance) {
        return;
      }
      event.preventDefault();
      mainWindow.hide();
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
  classFilter: ['hy', 'lmgt3', 'lmp2_elms', 'lmp2_wec', 'gte', 'lmp3'],
  dropdownListSize: 'short',
  setupTableTextSize: 'compact',
  checkUpdatesOnLaunch: false,
  minimizeToTrayOnClose: false,
  startMinimized: false,
  alwaysOnTop: false,
  startOnLogin: false,
  zoomFactor: 1,
  donationClicks: 0,
  launchCount: 0,
  donationReminderDismissed: false,
};

function getSettingsPath() {
  if (!store) return null;
  const rootPath = store.get('lmuPath');
  if (!rootPath) return null;
  return path.join(rootPath, SETTINGS_RELATIVE_PATH);
}

function applyLoginItemSettings(settings) {
  if (process.platform !== 'win32') return;
  const openAtLogin = Boolean(settings?.startOnLogin);
  app.setLoginItemSettings({
    openAtLogin,
    path: process.execPath,
  });
}

function applyAlwaysOnTop(settings) {
  if (!mainWindow) return;
  mainWindow.setAlwaysOnTop(Boolean(settings?.alwaysOnTop));
}

function applyZoomFactor(settings) {
  if (!mainWindow || !mainWindow.webContents) return;
  const rawFactor = Number(settings?.zoomFactor);
  if (Number.isNaN(rawFactor)) return;
  const clamped = Math.min(2.5, Math.max(0.5, rawFactor));
  mainWindow.webContents.setZoomFactor(clamped);
}

function hasOwnSetting(payload, key) {
  return Boolean(payload) && Object.prototype.hasOwnProperty.call(payload, key);
}

function syncZoomFromWebContents() {
  if (!mainWindow || !mainWindow.webContents || !store) return;
  const zoomFactor = mainWindow.webContents.getZoomFactor();
  const current = store.get('settings') || {};
  const currentZoom = Number(current.zoomFactor || 1);
  if (Math.abs(currentZoom - zoomFactor) < 0.001) return;

  const next = { ...DEFAULT_SETTINGS, ...current, zoomFactor };
  store.set('settings', next);
  mainWindow.webContents.send('zoom-factor-changed', zoomFactor);
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

  ensureTray();

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
    applyLoginItemSettings(next);
    applyAlwaysOnTop(next);
    if (hasOwnSetting(payload, 'zoomFactor')) {
      applyZoomFactor(next);
    }
    return next;
  });

  ipcMain.handle('update-settings', (event, payload = {}) => {
    const current = store.get('settings') || {};
    const next = { ...DEFAULT_SETTINGS, ...current, ...payload };
    store.set('settings', next);
    applyLoginItemSettings(next);
    applyAlwaysOnTop(next);
    if (hasOwnSetting(payload, 'zoomFactor')) {
      applyZoomFactor(next);
    }
    return next;
  });

  ipcMain.handle('get-platform', () => {
    return process.platform;
  });

  ipcMain.handle('get-zoom-factor', () => {
    if (!mainWindow || !mainWindow.webContents) return null;
    return mainWindow.webContents.getZoomFactor();
  });

  ipcMain.handle('check-for-updates', async () => {
    if (!UPDATE_REPO.owner || !UPDATE_REPO.repo) {
      return { error: 'Update repository not configured.' };
    }

    try {
      const url = `https://api.github.com/repos/${UPDATE_REPO.owner}/${UPDATE_REPO.repo}/releases/latest`;
      const release = await fetchJsonWithRetry(url, 1);
      const latestVersionRaw = release.tag_name || release.name;
      const latestVersion = normalizeVersionString(latestVersionRaw);
      const currentVersion = normalizeVersionString(app.getVersion());

      if (!latestVersion || !currentVersion) {
        return { error: 'Unable to parse version information.' };
      }

      const hasUpdate = compareSemver(latestVersion, currentVersion) > 0;
      return {
        hasUpdate,
        latestVersion,
        currentVersion,
        url: getDownloadUrl(release),
        notes: typeof release.body === 'string' ? release.body : '',
      };
    } catch (error) {
      return { error: error?.message || 'Update check failed.' };
    }
  });

  ipcMain.handle('get-app-version', () => {
    return app.getVersion();
  });

  ipcMain.handle('open-external', (event, url) => {
    if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
      return false;
    }
    return shell.openExternal(url);
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
