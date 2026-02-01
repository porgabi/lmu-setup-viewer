const electronAPI = window?.electronAPI;

async function safeInvoke(fn, fallback, ...args) {
  if (!fn) return fallback;
  try {
    return await fn(...args);
  } catch (error) {
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
};

export const isElectronAvailable = Boolean(electronAPI);
