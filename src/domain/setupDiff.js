export function getDisplayValue(entry) {
  if (!entry) return '';

  const commentValue = entry.comment && entry.comment.trim();
  return commentValue || entry.value || '';
}

export function getComparableValue(entry) {
  const value = getDisplayValue(entry);
  if (!value) return '';

  const key = entry?.key || '';
  if (key === 'VirtualEnergySetting' || key === 'FuelCapacitySetting') {
    return value.replace(/\s*\([^)]*\)\s*/g, '').trim();
  }

  if (key === 'CompoundSetting') {
    return value.replace(/^\s*\d+%\s*/g, '').trim();
  }

  return value;
}

export function getCompoundColor(entry, displayValue) {
  if (entry?.key !== 'CompoundSetting') {
    return null;
  }

  const normalized = (displayValue || '').toLowerCase();
  if (normalized.includes('soft')) return '#f2f4f7';
  if (normalized.includes('medium')) return '#FFDA0D';
  if (normalized.includes('hard')) return '#E50B1B';
  if (normalized.includes('wet')) return '#4BCCEC';

  return null;
}

export function buildDiffMap(primarySections, secondarySections) {
  const diffMap = new Map();
  const buildKey = (sectionName, entryKey) => `${sectionName}::${entryKey}`;

  const addEntries = (sections, target) => {
    sections.forEach((section) => {
      section.entries.forEach((entry) => {
        const key = buildKey(section.name, entry.key);
        target.set(key, getComparableValue(entry));
      });
    });
  };

  const primaryValues = new Map();
  const secondaryValues = new Map();
  addEntries(primarySections, primaryValues);
  addEntries(secondarySections, secondaryValues);

  const allKeys = new Set([...primaryValues.keys(), ...secondaryValues.keys()]);
  allKeys.forEach((key) => {
    const primaryValue = primaryValues.get(key) || '';
    const secondaryValue = secondaryValues.get(key) || '';
    diffMap.set(key, primaryValue !== secondaryValue);
  });

  return diffMap;
}
