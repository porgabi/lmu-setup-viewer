import React from 'react';
import { electron } from '../services/electron';
import { parseSetup } from '../domain/setupParser';

const SetupContext = React.createContext(null);

const initialState = {
  lmuPath: '',
  setupIndex: {},
  countryCodes: {},
  primarySetup: '',
  secondarySetup: '',
  comparisonEnabled: false,
  setupFiles: {},
  loadingIndex: false,
  loadingFiles: {},
  errors: {},
};

function splitSetupKey(setupKey) {
  const separatorIndex = setupKey.indexOf('/');
  if (separatorIndex === -1) {
    return { track: '', setupName: setupKey };
  }
  return {
    track: setupKey.slice(0, separatorIndex),
    setupName: setupKey.slice(separatorIndex + 1),
  };
}

function isSetupValid(setupKey, setupIndex) {
  if (!setupKey) return false;
  const { track, setupName } = splitSetupKey(setupKey);
  if (!track || !setupName) return false;
  return Array.isArray(setupIndex?.[track]) && setupIndex[track].includes(setupName);
}

export function SetupProvider({ children }) {
  const [state, setState] = React.useState(initialState);

  const refreshSetupIndex = React.useCallback(async () => {
    setState((prev) => ({ ...prev, loadingIndex: true }));
    try {
      const [lmuPath, setupIndex, countryCodes] = await Promise.all([
        electron.getLmuPath(),
        electron.getSetupIndex(),
        electron.getCountryCodes(),
      ]);

      setState((prev) => {
        const nextPrimary = isSetupValid(prev.primarySetup, setupIndex) ? prev.primarySetup : '';
        const nextSecondary = isSetupValid(prev.secondarySetup, setupIndex) ? prev.secondarySetup : '';
        return {
          ...prev,
          lmuPath: lmuPath || '',
          setupIndex: setupIndex || {},
          countryCodes: countryCodes || {},
          primarySetup: nextPrimary,
          secondarySetup: prev.comparisonEnabled ? nextSecondary : '',
          loadingIndex: false,
        };
      });
    } catch (error) {
      console.error('Failed to refresh setup index', error);
      setState((prev) => ({ ...prev, loadingIndex: false }));
    }
  }, []);

  const chooseLmuPath = React.useCallback(async () => {
    const newPath = await electron.setLmuPath();
    if (!newPath) return;

    setState((prev) => ({
      ...prev,
      lmuPath: newPath,
      setupIndex: {},
      setupFiles: {},
      primarySetup: '',
      secondarySetup: '',
      errors: {},
    }));

    refreshSetupIndex();
  }, [refreshSetupIndex]);

  const setPrimarySetup = React.useCallback((setupKey) => {
    setState((prev) => ({ ...prev, primarySetup: setupKey }));
  }, []);

  const setSecondarySetup = React.useCallback((setupKey) => {
    setState((prev) => ({ ...prev, secondarySetup: setupKey }));
  }, []);

  const setComparisonEnabled = React.useCallback((enabled) => {
    setState((prev) => ({
      ...prev,
      comparisonEnabled: enabled,
    }));
  }, []);

  const loadSetupFile = React.useCallback(async (setupKey) => {
    if (!setupKey) return;

    setState((prev) => ({
      ...prev,
      loadingFiles: { ...prev.loadingFiles, [setupKey]: true },
    }));

    const { track, setupName } = splitSetupKey(setupKey);
    if (!track || !setupName) {
      setState((prev) => {
        const nextLoading = { ...prev.loadingFiles };
        delete nextLoading[setupKey];
        return {
          ...prev,
          loadingFiles: nextLoading,
          errors: { ...prev.errors, [setupKey]: 'Invalid setup selection.' },
        };
      });
      return;
    }

    try {
      const raw = await electron.readSetupFile({ track, setupName });
      const parsed = parseSetup(raw);
      setState((prev) => {
        const nextLoading = { ...prev.loadingFiles };
        delete nextLoading[setupKey];
        const nextErrors = { ...prev.errors };
        if (!raw) {
          nextErrors[setupKey] = 'Unable to load setup file.';
        } else {
          delete nextErrors[setupKey];
        }

        return {
          ...prev,
          setupFiles: { ...prev.setupFiles, [setupKey]: { raw, parsed } },
          loadingFiles: nextLoading,
          errors: nextErrors,
        };
      });
    } catch (error) {
      console.error('Failed to read setup file', error);
      setState((prev) => {
        const nextLoading = { ...prev.loadingFiles };
        delete nextLoading[setupKey];
        return {
          ...prev,
          loadingFiles: nextLoading,
          errors: { ...prev.errors, [setupKey]: 'Failed to read setup file.' },
        };
      });
    }
  }, []);

  React.useEffect(() => {
    refreshSetupIndex();
  }, [refreshSetupIndex]);

  React.useEffect(() => {
    if (
      state.primarySetup &&
      !state.setupFiles[state.primarySetup] &&
      !state.loadingFiles[state.primarySetup]
    ) {
      loadSetupFile(state.primarySetup);
    }
  }, [state.primarySetup, state.setupFiles, state.loadingFiles, loadSetupFile]);

  React.useEffect(() => {
    if (
      state.comparisonEnabled &&
      state.secondarySetup &&
      !state.setupFiles[state.secondarySetup] &&
      !state.loadingFiles[state.secondarySetup]
    ) {
      loadSetupFile(state.secondarySetup);
    }
  }, [
    state.comparisonEnabled,
    state.secondarySetup,
    state.setupFiles,
    state.loadingFiles,
    loadSetupFile,
  ]);

  const value = {
    ...state,
    refreshSetupIndex,
    chooseLmuPath,
    setPrimarySetup,
    setSecondarySetup,
    setComparisonEnabled,
  };

  return <SetupContext.Provider value={value}>{children}</SetupContext.Provider>;
}

export function useSetupContext() {
  const context = React.useContext(SetupContext);
  if (!context) {
    throw new Error('useSetupContext must be used within SetupProvider');
  }
  return context;
}
