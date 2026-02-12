import React from 'react';
import { electron } from '../services/electron';

const SettingsContext = React.createContext(null);

export const defaultSettings = {
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

function mergeSettings(base, overrides) {
  return { ...base, ...(overrides || {}) };
}

function isPersistedSettingsValid(result, expected, keysToCheck) {
  if (!result || typeof result !== 'object') return false;
  return keysToCheck.every((key) => Object.is(result[key], expected[key]));
}

export function SettingsProvider({ children }) {
  const [settings, setSettingsState] = React.useState(defaultSettings);
  const [loadingSettings, setLoadingSettings] = React.useState(true);
  const [settingsError, setSettingsError] = React.useState(null);
  const settingsRef = React.useRef(defaultSettings);

  React.useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const stored = await electron.getSettingsStrict();
        if (!cancelled) {
          const merged = mergeSettings(defaultSettings, stored);
          setSettingsState(merged);
          const nextLaunchCount = (merged.launchCount || 0) + 1;
          await electron.updateSettingsStrict({ launchCount: nextLaunchCount });
          setSettingsState((prev) => mergeSettings(prev, { launchCount: nextLaunchCount }));
          setSettingsError(null);
        }
      } catch (error) {
        console.warn('Failed to load settings', error);
        if (!cancelled) {
          setSettingsError(error?.message || 'Failed to load settings.');
        }
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
    const previous = settingsRef.current;
    const merged = mergeSettings(defaultSettings, next);
    setSettingsState(merged);
    try {
      const persisted = await electron.setSettingsStrict(merged);
      const persistedMerged = mergeSettings(defaultSettings, persisted);
      const keys = Object.keys(defaultSettings);
      if (!isPersistedSettingsValid(persistedMerged, merged, keys)) {
        throw new Error('Settings persistence mismatch.');
      }
      setSettingsError(null);
      setSettingsState(persistedMerged);
      return persistedMerged;
    } catch (error) {
      console.warn('Failed to persist settings', error);
      setSettingsState(previous);
      setSettingsError(error?.message || 'Failed to persist settings.');
      return null;
    }
  }, []);

  const updateSettings = React.useCallback(async (partial) => {
    const previous = settingsRef.current;
    const nextSettings = mergeSettings(previous, partial);
    setSettingsState(nextSettings);

    try {
      const persisted = await electron.updateSettingsStrict(partial);
      const persistedMerged = mergeSettings(defaultSettings, persisted);
      const keys = Object.keys(partial || {});
      if (!isPersistedSettingsValid(persistedMerged, nextSettings, keys)) {
        throw new Error('Settings persistence mismatch.');
      }
      setSettingsError(null);
      setSettingsState(persistedMerged);
      return persistedMerged;
    } catch (error) {
      console.warn('Failed to update settings', error);
      setSettingsState(previous);
      setSettingsError(error?.message || 'Failed to update settings.');
      return null;
    }
  }, []);

  const value = {
    settings,
    loadingSettings,
    settingsError,
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
