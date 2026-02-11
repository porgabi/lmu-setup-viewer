export const setupTableTextSizeOptions = [
  { value: 'compact', label: 'Compact' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'extraLarge', label: 'Extra Large' },
];

const setupTableTextSizeConfigs = {
  compact: {
    columnHeaderFontSize: '1rem',
    sectionHeaderFontSize: '1rem',
    rowFontSize: '1rem',
  },
  medium: {
    columnHeaderFontSize: '1.06rem',
    sectionHeaderFontSize: '1.06rem',
    rowFontSize: '1.06rem',
  },
  large: {
    columnHeaderFontSize: '1.14rem',
    sectionHeaderFontSize: '1.14rem',
    rowFontSize: '1.14rem',
  },
  extraLarge: {
    columnHeaderFontSize: '1.24rem',
    sectionHeaderFontSize: '1.24rem',
    rowFontSize: '1.24rem',
  },
};

export function getSetupTableTextSizeConfig(sizeKey) {
  if (!sizeKey || !setupTableTextSizeConfigs[sizeKey]) {
    return setupTableTextSizeConfigs.compact;
  }

  return setupTableTextSizeConfigs[sizeKey];
}
