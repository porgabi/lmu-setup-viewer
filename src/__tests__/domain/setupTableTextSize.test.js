import {
  getSetupTableTextSizeConfig,
  setupTableTextSizeOptions,
} from '../../domain/setupTableTextSize';

describe('setupTableTextSize', () => {
  it('exposes exactly four selectable options in expected order', () => {
    expect(setupTableTextSizeOptions).toEqual([
      { value: 'compact', label: 'Compact' },
      { value: 'medium', label: 'Medium' },
      { value: 'large', label: 'Large' },
      { value: 'extraLarge', label: 'Extra Large' },
    ]);
  });

  it('returns compact as fallback for unknown values', () => {
    const compactConfig = getSetupTableTextSizeConfig('compact');
    const unknownConfig = getSetupTableTextSizeConfig('unknown');
    const emptyConfig = getSetupTableTextSizeConfig('');

    expect(unknownConfig).toEqual(compactConfig);
    expect(emptyConfig).toEqual(compactConfig);
  });

  it('returns increasing row sizes across presets', () => {
    const compact = getSetupTableTextSizeConfig('compact');
    const medium = getSetupTableTextSizeConfig('medium');
    const large = getSetupTableTextSizeConfig('large');
    const extraLarge = getSetupTableTextSizeConfig('extraLarge');

    expect(parseFloat(compact.rowFontSize)).toBeLessThan(parseFloat(medium.rowFontSize));
    expect(parseFloat(medium.rowFontSize)).toBeLessThan(parseFloat(large.rowFontSize));
    expect(parseFloat(large.rowFontSize)).toBeLessThan(parseFloat(extraLarge.rowFontSize));
  });
});
