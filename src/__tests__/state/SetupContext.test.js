import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { SetupProvider, useSetupContext } from '../../state/SetupContext';
import { electron } from '../../services/electron';

jest.mock('../../services/electron', () => ({
  electron: {
    getLmuPath: jest.fn(),
    getSetupIndex: jest.fn(),
    getTrackInfo: jest.fn(),
    readSetupFile: jest.fn(),
    setLmuPath: jest.fn(),
  },
}));

let latestContext = null;

function ContextProbe() {
  latestContext = useSetupContext();
  return null;
}

function renderProvider() {
  latestContext = null;
  render(
    <SetupProvider>
      <ContextProbe />
    </SetupProvider>
  );
}

async function waitForInitialRefresh() {
  await waitFor(() => expect(electron.getSetupIndex).toHaveBeenCalled());
  await waitFor(() => expect(latestContext.loadingIndex).toBe(false));
}

describe('SetupContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    electron.getLmuPath.mockResolvedValue('C:/LMU');
    electron.getTrackInfo.mockResolvedValue({});
    electron.getSetupIndex.mockResolvedValue({});
    electron.readSetupFile.mockResolvedValue(null);
  });

  it('keeps valid selected setups and clears invalid ones after refresh', async () => {
    electron.getSetupIndex
      .mockResolvedValueOnce({
        Bahrain: [{ name: 'SetupA' }, { name: 'SetupB' }],
      })
      .mockResolvedValueOnce({
        Bahrain: [{ name: 'SetupA' }],
      });
    electron.readSetupFile.mockResolvedValue('[HEADER]\nVehicleClassSetting="Toyota_GR010"');

    renderProvider();
    await waitForInitialRefresh();

    act(() => {
      latestContext.setPrimarySetup('Bahrain/SetupA');
      latestContext.setSecondarySetup('Bahrain/SetupB');
    });

    await act(async () => {
      await latestContext.refreshSetupIndex();
    });

    await waitFor(() => expect(latestContext.primarySetup).toBe('Bahrain/SetupA'));
    expect(latestContext.secondarySetup).toBe('');
  });

  it('sets a user-facing error for non-silent setup read failures', async () => {
    electron.getSetupIndex.mockResolvedValue({
      Bahrain: [{ name: 'SetupA' }],
    });
    electron.readSetupFile.mockResolvedValue(null);

    renderProvider();
    await waitForInitialRefresh();

    act(() => {
      latestContext.setPrimarySetup('Bahrain/SetupA');
    });

    await waitFor(() =>
      expect(latestContext.errors['Bahrain/SetupA']).toBe('Unable to load setup file.')
    );
  });

  it('silent refresh does not add errors when re-reading an already-loaded setup fails', async () => {
    const validRaw = '[HEADER]\nVehicleClassSetting="Toyota_GR010"\n[GENERAL]\nFuelCapacitySetting=0 // 18.0L';

    electron.getSetupIndex
      .mockResolvedValueOnce({
        Bahrain: [{ name: 'SetupA' }],
      })
      .mockResolvedValueOnce({
        Bahrain: [{ name: 'SetupA' }],
      });
    electron.readSetupFile.mockResolvedValueOnce(validRaw).mockResolvedValueOnce(null);

    renderProvider();
    await waitForInitialRefresh();

    act(() => {
      latestContext.setPrimarySetup('Bahrain/SetupA');
    });

    await waitFor(() => expect(latestContext.setupFiles['Bahrain/SetupA']?.raw).toBe(validRaw));

    await act(async () => {
      await latestContext.refreshSetupIndex();
    });

    await waitFor(() => expect(latestContext.primarySetup).toBe('Bahrain/SetupA'));
    expect(latestContext.setupFiles['Bahrain/SetupA']?.raw).toBe(validRaw);
    expect(latestContext.errors['Bahrain/SetupA']).toBeUndefined();
    expect(latestContext.loadingFiles['Bahrain/SetupA']).toBeUndefined();
  });
});
