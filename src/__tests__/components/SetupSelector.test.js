import React from 'react';
import { act, render, screen } from '@testing-library/react';
import SetupSelector from '../../components/SetupSelector';
import { useSetupContext } from '../../state/SetupContext';
import { useSettings } from '../../state/SettingsContext';
import { electron } from '../../services/electron';

jest.mock('../../state/SetupContext', () => ({
  useSetupContext: jest.fn(),
}));

jest.mock('../../state/SettingsContext', () => ({
  useSettings: jest.fn(),
}));

jest.mock('../../services/electron', () => ({
  electron: {
    onHotkeyCommand: jest.fn(),
  },
}));

jest.mock('../../components/OptionsDialog', () => {
  return function OptionsDialogMock({ open }) {
    return <div data-testid="options-dialog-state">{open ? 'open' : 'closed'}</div>;
  };
});

function createSetupContext(overrides = {}) {
  return {
    lmuPath: 'C:/LMU',
    setupIndex: {
      Bahrain: [{ name: 'SetupA', carTechnicalName: 'Toyota_GR010' }],
    },
    trackInfo: {
      Bahrain: { displayName: 'Bahrain', countryCode: 'BH' },
    },
    primarySetup: '',
    secondarySetup: '',
    comparisonEnabled: false,
    loadingIndex: false,
    chooseLmuPath: jest.fn(),
    refreshSetupIndex: jest.fn(),
    setPrimarySetup: jest.fn(),
    setSecondarySetup: jest.fn(),
    setComparisonEnabled: jest.fn(),
    ...overrides,
  };
}

describe('SetupSelector hotkeys', () => {
  let hotkeyHandler = null;

  beforeEach(() => {
    jest.clearAllMocks();
    hotkeyHandler = null;

    useSettings.mockReturnValue({
      settings: {
        dropdownSortOrder: ['hy', 'lmgt3', 'lmp2_elms', 'lmp2_wec', 'gte', 'lmp3'],
        classFilter: ['hy', 'lmgt3', 'lmp2_elms', 'lmp2_wec', 'gte', 'lmp3'],
        dropdownListSize: 'short',
      },
      updateSettings: jest.fn(),
    });

    electron.onHotkeyCommand.mockImplementation((callback) => {
      hotkeyHandler = callback;
      return jest.fn();
    });
  });

  it('handles reload, comparison toggle, and selector-2 open hotkeys', () => {
    const context = createSetupContext({ comparisonEnabled: false });
    useSetupContext.mockReturnValue(context);

    render(<SetupSelector />);

    act(() => {
      hotkeyHandler('reload-setups');
      hotkeyHandler('toggle-comparison');
      hotkeyHandler('open-selector-2');
    });

    expect(context.refreshSetupIndex).toHaveBeenCalledTimes(1);
    expect(context.setComparisonEnabled).toHaveBeenCalledWith(true);
    expect(context.setComparisonEnabled).toHaveBeenCalledTimes(2);
  });

  it('opens options dialog when open-options hotkey is triggered', () => {
    useSetupContext.mockReturnValue(createSetupContext());

    render(<SetupSelector />);
    expect(screen.getByTestId('options-dialog-state')).toHaveTextContent('closed');

    act(() => {
      hotkeyHandler('open-options');
    });

    expect(screen.getByTestId('options-dialog-state')).toHaveTextContent('open');
  });
});
