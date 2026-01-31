import { getComparableValue } from '../../domain/setupDiff';

describe('diff comparison logic', () => {
  it('strips parentheses for VirtualEnergySetting', () => {
    const entry = {
      key: 'VirtualEnergySetting',
      value: '100% (31 laps)',
      comment: '',
    };
    expect(getComparableValue(entry)).toBe('100%');
  });

  it('strips parentheses for FuelCapacitySetting', () => {
    const entry = {
      key: 'FuelCapacitySetting',
      value: '18.0L (5.2 laps)',
      comment: '',
    };
    expect(getComparableValue(entry)).toBe('18.0L');
  });

  it('removes leading percentage for CompoundSetting', () => {
    const entry = {
      key: 'CompoundSetting',
      value: '92% Medium',
      comment: '',
    };
    expect(getComparableValue(entry)).toBe('Medium');
  });

  it('leaves normal values intact', () => {
    const cases = [
      { key: 'DiffPowerSetting', value: '25%' },
      { key: 'BrakeMigrationSetting', value: '2.5% F' },
      { key: 'CamberSetting', value: '-1.0 deg' },
      { key: 'RideHeightSetting', value: '4.3 cm' },
      { key: 'RatioSetSetting', value: 'Standard' },
      { key: 'EngineMixtureSetting', value: 'Race' },
    ];

    cases.forEach((entry) => {
      expect(getComparableValue({ ...entry, comment: '' })).toBe(entry.value);
    });
  });
});
