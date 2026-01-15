export function parseSetup(raw) {
  if (typeof raw !== 'string') {
    return null;
  }

  const lines = raw.split(/\r?\n/);
  const sections = [];
  let current = createSection('General');

  for (const line of lines) {
    const trimmed = line.trim();
    const isHeader = trimmed.startsWith('[') && trimmed.endsWith(']');
    if (isHeader) {
      if (current.lines.length || current.entries.length) {
        sections.push(current);
      }
      const name = trimmed.slice(1, -1).trim() || 'Unnamed';
      current = createSection(name);
      continue;
    }

    current.lines.push(line);

    const delimiterIndex = line.indexOf('=');
    if (delimiterIndex !== -1) {
      const key = line.slice(0, delimiterIndex).trim();
      const value = line.slice(delimiterIndex + 1).trim();
      if (key) {
        current.entries.push({ key, value, raw: line });
      }
    }
  }

  if (current.lines.length || current.entries.length || sections.length === 0) {
    sections.push(current);
  }

  return { raw, sections };
}

function createSection(name) {
  return {
    name,
    lines: [],
    entries: [],
  };
}

export function filterSectionsByKeywords(parsed, keywords) {
  if (!parsed || !Array.isArray(parsed.sections)) {
    return { sections: [], availableSections: [] };
  }

  const availableSections = parsed.sections.map((section) => section.name);

  if (!keywords || keywords.length === 0) {
    return { sections: parsed.sections, availableSections };
  }

  const normalizedKeywords = keywords.map((keyword) => keyword.toLowerCase());
  const sections = parsed.sections.filter((section) => {
    const normalizedName = section.name.toLowerCase();
    return normalizedKeywords.some((keyword) => normalizedName.includes(keyword));
  });

  return { sections, availableSections };
}