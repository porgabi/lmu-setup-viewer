import labels from './settingLabels.json';

const REMOVE_VALUE = 'REMOVE';

export function getSettingLabel(key, sectionName) {
  if (!key) return null;
  const sectionKey = sectionName ? `${sectionName}.${key}` : null;
  const mapped = (sectionKey && labels[sectionKey]) || labels[key];
  if (!mapped) {
    return key;
  }
  if (mapped === REMOVE_VALUE) {
    return null;
  }
  return mapped;
}

function extractLineKey(line) {
  if (!line) return null;
  const trimmed = line.trim();
  if (!trimmed) return null;
  const raw = trimmed.startsWith('//') ? trimmed.slice(2).trim() : trimmed;
  const equalsIndex = raw.indexOf('=');
  const colonIndex = raw.indexOf(':');
  let splitIndex = -1;
  if (equalsIndex !== -1 && colonIndex !== -1) {
    splitIndex = Math.min(equalsIndex, colonIndex);
  } else {
    splitIndex = equalsIndex !== -1 ? equalsIndex : colonIndex;
  }
  if (splitIndex === -1) return null;
  const key = raw.slice(0, splitIndex).trim();
  return key || null;
}

function filterSectionLines(lines, sectionName) {
  if (!Array.isArray(lines)) return [];
  return lines.filter((line) => {
    const key = extractLineKey(line);
    if (!key) return true;
    return getSettingLabel(key, sectionName) !== null;
  });
}

export function applySettingLabels(section) {
  const entries = section.entries
    .map((entry) => {
      const label = getSettingLabel(entry.key, section.name);
      if (!label) return null;
      return { ...entry, label };
    })
    .filter(Boolean);

  return {
    ...section,
    entries,
    lines: filterSectionLines(section.lines, section.name),
  };
}
