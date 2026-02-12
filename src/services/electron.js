const electronAPI = window?.electronAPI;
const NO_FALLBACK = Symbol('NO_FALLBACK');

async function safeInvoke(fn, fallback, ...args) {
  if (!fn) {
    if (fallback === NO_FALLBACK) {
      throw new Error('Electron API is unavailable.');
    }
    return fallback;
  }
  try {
    return await fn(...args);
  } catch (error) {
    if (fallback === NO_FALLBACK) {
      throw error;
    }
    console.warn('Electron API call failed', error);
    return fallback;
  }
}

export const electron = {
  getLmuPath: () => safeInvoke(electronAPI?.getLmuPath, null),
  setLmuPath: () => safeInvoke(electronAPI?.setLmuPath, null),
  getSetupIndex: () => safeInvoke(electronAPI?.getSetupIndex, {}),
  readSetupFile: (payload) => safeInvoke(electronAPI?.readSetupFile, null, payload),
  getTrackInfo: () => safeInvoke(electronAPI?.getTrackInfo, {}),
  getSettings: () => safeInvoke(electronAPI?.getSettings, {}),
  setSettings: (payload) => safeInvoke(electronAPI?.setSettings, {}, payload),
  updateSettings: (payload) => safeInvoke(electronAPI?.updateSettings, {}, payload),
  getSettingsStrict: () => safeInvoke(electronAPI?.getSettings, NO_FALLBACK),
  setSettingsStrict: (payload) => safeInvoke(electronAPI?.setSettings, NO_FALLBACK, payload),
  updateSettingsStrict: (payload) =>
    safeInvoke(electronAPI?.updateSettings, NO_FALLBACK, payload),
  checkForUpdates: () => safeInvoke(electronAPI?.checkForUpdates, null),
  openExternal: (url) => safeInvoke(electronAPI?.openExternal, false, url),
  getAppVersion: () => safeInvoke(electronAPI?.getAppVersion, null),
  getPlatform: () => safeInvoke(electronAPI?.getPlatform, null),
  onZoomFactorChanged: (callback) => electronAPI?.onZoomFactorChanged?.(callback),
  onHotkeyCommand: (callback) => electronAPI?.onHotkeyCommand?.(callback),
  getZoomFactor: () => safeInvoke(electronAPI?.getZoomFactor, null),
};

export const isElectronAvailable = Boolean(electronAPI);
