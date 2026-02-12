import { buildSetupMenuData, splitSetupKey } from '../../domain/setupDisplay';

describe('setupDisplay domain', () => {
  it('splitSetupKey handles full keys, missing separators, and empty input', () => {
    expect(splitSetupKey('Bahrain/TestSetup')).toEqual({ track: 'Bahrain', setupName: 'TestSetup' });
    expect(splitSetupKey('TestName')).toEqual({ track: '', setupName: 'TestName' });
    expect(splitSetupKey('')).toEqual({ track: '', setupName: '' });
  });

  it('buildSetupMenuData applies class filtering, exclusion, sorting, and track info fallback', () => {
    const setupIndex = {
      Bahrain: [
        { name: 'Porsche 911 GT3 R LMGT3', carTechnicalName: 'Porsche_911_GT3_R_LMGT3' },
        { name: 'Toyota GR010', carTechnicalName: 'Toyota_GR010' },
        { name: 'BMW M4 LMGT3', carTechnicalName: 'BMW_M4_LMGT3' },
      ],
      UnknownTrack: [{ name: 'LooseSetup', carTechnicalName: 'UnknownCarClass' }],
    };
    const trackInfo = {
      Bahrain: { displayName: 'Bahrain GP', countryCode: 'BH' },
    };

    const filtered = buildSetupMenuData(
      setupIndex,
      trackInfo,
      'Bahrain/BMW M4 LMGT3',
      undefined,
      ['lmgt3']
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].track).toBe('Bahrain');
    expect(filtered[0].trackLabel).toBe('Bahrain GP');
    expect(filtered[0].countryCode).toBe('BH');
    expect(filtered[0].items.map((item) => item.name)).toEqual(['Porsche 911 GT3 R LMGT3']);

    const unfiltered = buildSetupMenuData(setupIndex, trackInfo, '');
    const bahrainSection = unfiltered.find((section) => section.track === 'Bahrain');
    expect(bahrainSection.items.map((item) => item.name)).toEqual([
      'Toyota GR010',
      'BMW M4 LMGT3',
      'Porsche 911 GT3 R LMGT3',
    ]);

    const fallbackTrack = unfiltered.find((section) => section.track === 'UnknownTrack');
    expect(fallbackTrack.trackLabel).toBe('UnknownTrack');
    expect(fallbackTrack.countryCode).toBeUndefined();
  });
});
