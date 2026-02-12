import {
  buildDiffMap,
  getCategoryDiffCount,
  getCategoryDiffMap,
  getCompoundColor,
} from '../../domain/setupDiff';
import { getSetupCategory } from '../../domain/setupCategories';

function createParsedSetup({ virtualEnergy, fuelRatio, diffPower }) {
  return {
    sections: [
      {
        name: 'ENGINE',
        lines: [],
        entries: [
          {
            key: 'VirtualEnergySetting',
            value: '100',
            comment: virtualEnergy,
            raw: '',
          },
          {
            key: 'FuelCapacitySetting',
            value: '0',
            comment: fuelRatio,
            raw: '',
          },
        ],
      },
      {
        name: 'DIFFERENTIAL',
        lines: [],
        entries: [
          {
            key: 'DiffPowerSetting',
            value: diffPower,
            comment: '',
            raw: '',
          },
        ],
      },
    ],
  };
}

describe('setupDiff domain', () => {
  it('buildDiffMap marks missing keys as differences', () => {
    const primary = [{ name: 'GENERAL', lines: [], entries: [{ key: 'A', value: '1', comment: '' }] }];
    const secondary = [{ name: 'GENERAL', lines: [], entries: [] }];

    const diffMap = buildDiffMap(primary, secondary);
    expect(diffMap.get('GENERAL::A')).toBe(true);
  });

  it('getCategoryDiffMap and getCategoryDiffCount honor normalization rules in grouped categories', () => {
    const category = getSetupCategory('powertrain');
    const primaryParsed = createParsedSetup({
      virtualEnergy: '100% (31 laps)',
      fuelRatio: '18.0L (5.2 laps)',
      diffPower: '40%',
    });
    const secondaryParsed = createParsedSetup({
      virtualEnergy: '100% (29 laps)',
      fuelRatio: '18.0L (4.8 laps)',
      diffPower: '45%',
    });

    const diffMap = getCategoryDiffMap(category, primaryParsed, secondaryParsed);
    expect(diffMap.get('ENGINE::VirtualEnergySetting')).toBe(false);
    expect(diffMap.get('ENGINE::FuelCapacitySetting')).toBe(false);
    expect(diffMap.get('DIFFERENTIAL::DiffPowerSetting')).toBe(true);

    expect(getCategoryDiffCount(category, primaryParsed, secondaryParsed)).toBe(1);
  });

  it('getCompoundColor maps known compounds and ignores other keys', () => {
    expect(getCompoundColor({ key: 'CompoundSetting' }, 'Soft')).toBe('#f2f4f7');
    expect(getCompoundColor({ key: 'CompoundSetting' }, 'Medium')).toBe('#FFDA0D');
    expect(getCompoundColor({ key: 'CompoundSetting' }, 'Hard')).toBe('#E50B1B');
    expect(getCompoundColor({ key: 'CompoundSetting' }, 'Wet')).toBe('#4BCCEC');
    expect(getCompoundColor({ key: 'FuelCapacitySetting' }, 'Wet')).toBeNull();
  });
});
