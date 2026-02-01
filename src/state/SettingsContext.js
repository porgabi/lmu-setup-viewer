import React from 'react';
import { electron } from '../services/electron';

const SettingsContext = React.createContext(null);

export const defaultSettings = {
  diffHighlightEnabled: true,
  dropdownSortOrder: ['hy', 'lmgt3', 'lmp2_elms', 'lmp2_wec', 'gte', 'lmp3'],
  checkUpdatesOnLaunch: false,
};

function mergeSettings(base, overrides) {
  return { ...base, ...(overrides || {}) };
}

export function SettingsProvider({ children }) {
  const [settings, setSettingsState] = React.useState(defaultSettings);
  const [loadingSettings, setLoadingSettings] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const stored = await electron.getSettings();
        if (!cancelled) {
          setSettingsState(mergeSettings(defaultSettings, stored));
        }
      } catch (error) {
        console.warn('Failed to load settings', error);
      } finally {
        if (!cancelled) {
          setLoadingSettings(false);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const setSettings = React.useCallback(async (next) => {
    const merged = mergeSettings(defaultSettings, next);
    setSettingsState(merged);
    await electron.setSettings(merged);

    return merged;
  }, []);

  const updateSettings = React.useCallback(async (partial) => {
    let nextSettings = null;
    setSettingsState((prev) => {
      nextSettings = mergeSettings(prev, partial);
      return nextSettings;
    });

    if (nextSettings) {
      await electron.updateSettings(partial);
      return nextSettings;
    }
    
    return null;
  }, []);

  const resetSettings = React.useCallback(async () => {
    setSettingsState(defaultSettings);
    await electron.setSettings(defaultSettings);
  }, []);

  const value = {
    settings,
    loadingSettings,
    setSettings,
    updateSettings,
    resetSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }

  return context;
}
