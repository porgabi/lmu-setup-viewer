export function parseSetup(raw) {
  if (typeof raw !== 'string') {
    return null;
  }

  const lines = raw.split(/\r?\n/);
  const sections = [];
  let current = createSection('HEADER');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    const isHeader = trimmed.startsWith('[') && trimmed.endsWith(']');
    if (isHeader) {
      if (current.lines.length || current.entries.length) {
        sections.push(current);
      }
      const name = trimmed.slice(1, -1).trim() || 'Unnamed';
      current = createSection(name);
      continue;
    }

    const parsedLine = parseLine(line);
    if (parsedLine.type === 'entry') {
      current.entries.push(parsedLine.entry);
    } else if (parsedLine.type === 'comment') {
      current.lines.push(parsedLine.value);
    } else if (parsedLine.type === 'line') {
      current.lines.push(parsedLine.value);
    }
  }

  if (current.lines.length || current.entries.length || sections.length === 0) {
    sections.push(current);
  }

  const metadata = extractMetadata(sections);

  return { raw, sections, metadata };
}

function createSection(name) {
  return {
    name,
    lines: [],
    entries: [],
  };
}

function parseLine(line) {
  const trimmed = line.trim();
  if (!trimmed) {
    return { type: 'line', value: '' };
  }

  if (trimmed.startsWith('//')) {
    return { type: 'comment', value: trimmed };
  }

  const { content, comment } = splitInlineComment(line);
  const delimiterIndex = content.indexOf('=');
  if (delimiterIndex === -1) {
    return { type: 'line', value: content.trim() };
  }

  const key = content.slice(0, delimiterIndex).trim();
  const value = content.slice(delimiterIndex + 1).trim();
  if (!key) {
    return { type: 'line', value: content.trim() };
  }

  return {
    type: 'entry',
    entry: {
      key,
      value,
      comment: comment || '',
      raw: line,
    },
  };
}

function splitInlineComment(line) {
  const commentIndex = line.indexOf('//');
  if (commentIndex === -1) {
    return { content: line, comment: '' };
  }

  return {
    content: line.slice(0, commentIndex).trimEnd(),
    comment: line.slice(commentIndex + 2).trim(),
  };
}

function extractMetadata(sections) {
  const metadata = {};
  const header = sections.find((section) => section.name.toLowerCase() === 'header');
  if (!header || !header.entries) {
    return metadata;
  }

  header.entries.forEach((entry) => {
    if (entry.key === 'VehicleClassSetting') {
      metadata.vehicleClass = entry.value.replace(/^\"|\"$/g, '');
    }
  });

  return metadata;
}

export function filterSectionsByKeywords(parsed, options) {
  if (!parsed || !Array.isArray(parsed.sections)) {
    return { sections: [], availableSections: [] };
  }

  const config = Array.isArray(options) ? { keywords: options } : options || {};
  const keywords = config.keywords || [];
  const sectionNames = config.sectionNames || [];
  const entryKeywords = config.entryKeywords || [];

  const availableSections = parsed.sections.map((section) => section.name);
  const normalizedKeywords = keywords.map((keyword) => keyword.toLowerCase());
  const normalizedSectionNames = sectionNames.map((name) => name.toLowerCase());
  const normalizedEntryKeywords = entryKeywords.map((keyword) => keyword.toLowerCase());
  const hasSectionFilters = normalizedKeywords.length > 0 || normalizedSectionNames.length > 0;

  const sections = parsed.sections
    .map((section) => {
      const normalizedName = section.name.toLowerCase();
      const nameMatches =
        !hasSectionFilters ||
        normalizedSectionNames.includes(normalizedName) ||
        normalizedKeywords.some((keyword) => normalizedName.includes(keyword));

      if (!nameMatches) {
        return null;
      }

      if (!normalizedEntryKeywords.length) {
        return section;
      }

      const filteredEntries = section.entries.filter((entry) => {
        const haystack = `${entry.key} ${entry.value} ${entry.comment}`.toLowerCase();
        return normalizedEntryKeywords.some((keyword) => haystack.includes(keyword));
      });

      if (filteredEntries.length === 0 && section.lines.length === 0) {
        return null;
      }

      return {
        ...section,
        entries: filteredEntries,
      };
    })
    .filter(Boolean);

  return { sections, availableSections };
}
