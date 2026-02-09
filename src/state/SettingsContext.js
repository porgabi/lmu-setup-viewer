import React from 'react';
import { electron } from '../services/electron';

const SettingsContext = React.createContext(null);

export const defaultSettings = {
  diffHighlightEnabled: true,
  dropdownSortOrder: ['hy', 'lmgt3', 'lmp2_elms', 'lmp2_wec', 'gte', 'lmp3'],
  dropdownListSize: 'short',
  checkUpdatesOnLaunch: false,
  minimizeToTrayOnClose: false,
  startOnLogin: false,
  zoomFactor: 1,
  donationClicks: 0,
  launchCount: 0,
  donationReminderDismissed: false,
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
          const merged = mergeSettings(defaultSettings, stored);
          setSettingsState(merged);
          const nextLaunchCount = (merged.launchCount || 0) + 1;
          await electron.updateSettings({ launchCount: nextLaunchCount });
          setSettingsState((prev) => mergeSettings(prev, { launchCount: nextLaunchCount }));
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

  React.useEffect(() => {
    if (!electron?.onZoomFactorChanged) return undefined;
    const unsubscribe = electron.onZoomFactorChanged((zoomFactor) => {
      setSettingsState((prev) => {
        const current = Number(prev.zoomFactor || 1);
        if (Math.abs(current - zoomFactor) < 0.001) {
          return prev;
        }
        return mergeSettings(prev, { zoomFactor });
      });
    });
    return unsubscribe;
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

  const value = {
    settings,
    loadingSettings,
    setSettings,
    updateSettings,
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
