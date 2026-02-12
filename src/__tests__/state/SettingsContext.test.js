import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { defaultSettings, SettingsProvider, useSettings } from '../../state/SettingsContext';
import { electron } from '../../services/electron';

jest.mock('../../services/electron', () => ({
  electron: {
    getSettingsStrict: jest.fn(),
    setSettingsStrict: jest.fn(),
    updateSettingsStrict: jest.fn(),
    onZoomFactorChanged: jest.fn(),
  },
}));

let latestContext = null;
let zoomListener = null;

function ContextProbe() {
  latestContext = useSettings();
  return null;
}

function renderProvider() {
  latestContext = null;
  render(
    <SettingsProvider>
      <ContextProbe />
    </SettingsProvider>
  );
}

describe('SettingsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    zoomListener = null;
    electron.onZoomFactorChanged.mockImplementation((callback) => {
      zoomListener = callback;
      return jest.fn();
    });
    electron.getSettingsStrict.mockResolvedValue({});
    electron.updateSettingsStrict.mockResolvedValue({ ...defaultSettings, launchCount: 1 });
    electron.setSettingsStrict.mockResolvedValue(defaultSettings);
  });

  it('loads settings and increments launch count', async () => {
    electron.getSettingsStrict.mockResolvedValue({ launchCount: 3 });

    renderProvider();

    await waitFor(() => expect(latestContext.loadingSettings).toBe(false));
    expect(electron.updateSettingsStrict).toHaveBeenCalledWith({ launchCount: 4 });
    expect(latestContext.settings.launchCount).toBe(4);
    expect(latestContext.settingsError).toBeNull();
  });

  it('rolls back optimistic state when updateSettings persistence fails', async () => {
    renderProvider();
    await waitFor(() => expect(latestContext.loadingSettings).toBe(false));

    const previous = latestContext.settings.diffHighlightEnabled;

    electron.updateSettingsStrict.mockRejectedValueOnce(new Error('write failed'));
    let result;
    await act(async () => {
      result = await latestContext.updateSettings({ diffHighlightEnabled: !previous });
    });

    expect(result).toBeNull();
    expect(latestContext.settings.diffHighlightEnabled).toBe(previous);
    expect(latestContext.settingsError).toBe('write failed');
  });

  it('rolls back optimistic state when setSettings persistence result mismatches', async () => {
    renderProvider();
    await waitFor(() => expect(latestContext.loadingSettings).toBe(false));

    const previousZoom = latestContext.settings.zoomFactor;
    electron.setSettingsStrict.mockResolvedValue({
      ...defaultSettings,
      zoomFactor: 1,
    });

    let result;
    await act(async () => {
      result = await latestContext.setSettings({
        ...latestContext.settings,
        zoomFactor: 1.2,
      });
    });

    expect(result).toBeNull();
    expect(latestContext.settings.zoomFactor).toBe(previousZoom);
    expect(latestContext.settingsError).toBe('Settings persistence mismatch.');
  });

  it('syncs zoom factor updates from Electron events', async () => {
    renderProvider();
    await waitFor(() => expect(latestContext.loadingSettings).toBe(false));

    act(() => {
      zoomListener(1.25);
    });

    expect(latestContext.settings.zoomFactor).toBe(1.25);
  });
});
