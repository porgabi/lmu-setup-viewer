import React from 'react';
import { Box, Typography } from '@mui/material';
import ReactCountryFlag from 'react-country-flag';
import { useSetupContext } from '../state/SetupContext';
import { getSetupCategory } from '../domain/setupCategories';
import { filterSectionsByKeywords } from '../domain/setupParser';
import { applySettingLabels } from '../domain/settingLabels';

function getDisplayValue(entry) {
  if (!entry) return '';
  const commentValue = entry.comment && entry.comment.trim();
  return commentValue || entry.value || '';
}

function getCompoundColor(entry, displayValue) {
  const label = entry?.label || entry?.key || '';
  if (!label.toLowerCase().includes('tyre compound')) {
    return null;
  }
  const normalized = (displayValue || '').toLowerCase();
  if (normalized.includes('soft')) return '#f2f4f7';
  if (normalized.includes('medium')) return '#FFDA0D';
  if (normalized.includes('hard')) return '#E50B1B';
  if (normalized.includes('wet')) return '#4BCCEC';
  return null;
}

function buildDiffMap(primarySections, secondarySections) {
  const diffMap = new Map();
  const buildKey = (sectionName, entryKey) => `${sectionName}::${entryKey}`;
  const addEntries = (sections, target) => {
    sections.forEach((section) => {
      section.entries.forEach((entry) => {
        const key = buildKey(section.name, entry.key);
        target.set(key, getDisplayValue(entry));
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

function EntriesTable({ entries, sectionName, diffMap }) {
  const gridTemplateColumns = 'minmax(0, 1.6fr) minmax(0, 1fr)';
  const rowCellSx = {
    py: 0.5,
    px: 0.75,
  };
  const headerCellSx = {
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    pb: 0.5,
    px: 0.75,
    borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
  };
  const rowSx = {
    display: 'grid',
    gridTemplateColumns,
    columnGap: 0,
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    transition: 'background-color 0.15s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
    },
    '&:last-of-type': {
      borderBottom: 'none',
    },
  };
  const diffRowSx = {
    boxShadow: 'inset 0 0 0 1px rgba(205, 70, 70, 0.55)',
    '&:hover': {
      boxShadow: 'inset 0 0 0 1px rgba(205, 70, 70, 0.75)',
    },
  };
  const buildKey = (entryKey) => `${sectionName}::${entryKey}`;
  return (
    <Box sx={{ fontSize: '0.9rem', fontVariantNumeric: 'tabular-nums' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {entries.map((entry, index) => (
          <Box
            key={`${entry.key}-${index}`}
            sx={{
              ...rowSx,
              ...(diffMap?.get(buildKey(entry.key)) ? diffRowSx : null),
            }}
          >
            <Box sx={rowCellSx}>{entry.label || entry.key}</Box>
            {(() => {
              const displayValue = getDisplayValue(entry);
              const compoundColor = getCompoundColor(entry, displayValue);
              return (
                <Box
                  sx={{
                    ...rowCellSx,
                    textAlign: 'right',
                    fontWeight: 700,
                    color: compoundColor || 'inherit',
                  }}
                >
                  {displayValue}
                </Box>
              );
            })()}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function SectionBlock({ section, diffMap }) {
  const hasEntries = section.entries.length > 0;
  const hasLines = section.lines.length > 0;
  const content = hasLines ? section.lines.join('\n') : '';
  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        bgcolor: 'rgba(8, 10, 14, 0.75)',
        borderRadius: 2,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1 }}
      >
        {section.name}
      </Typography>
      {hasEntries ? (
        <EntriesTable entries={section.entries} sectionName={section.name} diffMap={diffMap} />
      ) : null}
      {hasLines ? (
        <Box
          component="pre"
          sx={{
            mt: hasEntries ? 2 : 0,
            m: 0,
            fontFamily: '"JetBrains Mono", "Consolas", "Courier New", monospace',
            whiteSpace: 'pre-wrap',
            color: 'text.secondary',
          }}
        >
          {content}
        </Box>
      ) : null}
      {!hasEntries && !hasLines ? (
        <Typography variant="body2" color="text.secondary">
          (No entries)
        </Typography>
      ) : null}
    </Box>
  );
}

function getTrackFromSetupKey(setupKey) {
  if (!setupKey) return '';
  const separatorIndex = setupKey.indexOf('/');
  if (separatorIndex === -1) return '';
  return setupKey.slice(0, separatorIndex);
}

function splitSetupKey(setupKey) {
  if (!setupKey) {
    return { track: '', setupName: '' };
  }
  const separatorIndex = setupKey.indexOf('/');
  if (separatorIndex === -1) {
    return { track: '', setupName: setupKey };
  }
  return {
    track: setupKey.slice(0, separatorIndex),
    setupName: setupKey.slice(separatorIndex + 1),
  };
}

function renderHeading(setupKey, title, countryCodes, carName) {
  if (!setupKey) {
    return title;
  }

  const { track, setupName } = splitSetupKey(setupKey);
  const countryCode = track ? countryCodes?.[track] : null;
  const label = track ? (
    <Box component="span">
      <Box component="span">{track}</Box>
      <Box component="span" sx={{ mx: 0.5 }}>
        /
      </Box>
      <Box component="span">{setupName}</Box>
    </Box>
  ) : (
    setupKey
  );

  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      {countryCode ? (
        <ReactCountryFlag
          svg
          countryCode={countryCode}
          style={{ width: '1.1em', height: '1.1em', display: 'block' }}
          aria-label={`${countryCode} flag`}
        />
      ) : null}
      <Box component="span">
        {label}
        {carName ? <Box component="span" sx={{ ml: 1 }}>[{carName}]</Box> : null}
      </Box>
    </Box>
  );
}

function SetupColumn({ title, setupKey, data, loading, error, category, countryCodes }) {
  const carName = data?.parsed?.metadata?.vehicleClass;
  const heading = renderHeading(setupKey, title, countryCodes, carName);

  if (!setupKey) {
    return (
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: '0.08em' }}>
          {heading}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select a setup to view.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: '0.08em' }}>
          {heading}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Loading setup file...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: '0.08em' }}>
          {heading}
        </Typography>
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  const parsed = data?.parsed;
  if (!parsed) {
    return (
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: '0.08em' }}>
          {heading}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No data available for this setup.
        </Typography>
      </Box>
    );
  }

  let availableSections = [];
  let labeledSections = [];

  if (Array.isArray(category.sectionGroups)) {
    const labeledBySection = parsed.sections.map(applySettingLabels);
    const entriesByLabel = new Map();

    labeledBySection.forEach((section) => {
      section.entries.forEach((entry) => {
        const label = entry.label || entry.key;
        if (!label) return;
        const existing = entriesByLabel.get(label) || [];
        existing.push(entry);
        entriesByLabel.set(label, existing);
      });
    });

    labeledSections = category.sectionGroups
      .map((group) => {
        const entries = [];
        group.labels.forEach((label) => {
          const matches = entriesByLabel.get(label);
          if (matches) {
            entries.push(...matches);
          }
        });
        return { name: group.name, entries, lines: [] };
      })
      .filter((section) => section.entries.length > 0);
  } else {
    const { sections, availableSections: sectionList } = filterSectionsByKeywords(parsed, category);
    availableSections = sectionList;
    labeledSections = sections
      .map(applySettingLabels)
      .filter((section) => section.entries.length > 0 || section.lines.length > 0);
  }

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, letterSpacing: '0.08em' }}>
        {heading}
      </Typography>
      {labeledSections.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No matching sections for this category.
          {availableSections.length ? ` Available sections: ${availableSections.join(', ')}` : ''}
        </Typography>
      ) : (
        labeledSections.map((section) => (
          <SectionBlock key={`${setupKey}-${section.name}`} section={section} diffMap={category.diffMap} />
        ))
      )}
    </Box>
  );
}

export default function SetupSectionPanel({ categoryKey }) {
  const {
    primarySetup,
    secondarySetup,
    comparisonEnabled,
    countryCodes,
    setupFiles,
    loadingFiles,
    errors,
  } = useSetupContext();

  const category = getSetupCategory(categoryKey);
  const columns = [
    {
      title: 'Primary',
      setupKey: primarySetup,
    },
  ];

  if (comparisonEnabled) {
    columns.push({
      title: 'Comparison',
      setupKey: secondarySetup,
    });
  }

  const gridTemplateColumns =
    columns.length > 1 ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)';

  let diffMap = null;
  if (comparisonEnabled && primarySetup && secondarySetup) {
    const primaryParsed = setupFiles[primarySetup]?.parsed;
    const secondaryParsed = setupFiles[secondarySetup]?.parsed;
    if (primaryParsed && secondaryParsed) {
      const primarySections = Array.isArray(category.sectionGroups)
        ? category.sectionGroups
            .map((group) => {
              const entries = [];
              primaryParsed.sections
                .map(applySettingLabels)
                .forEach((section) => {
                  section.entries.forEach((entry) => {
                    const label = entry.label || entry.key;
                    if (group.labels.includes(label)) {
                      entries.push(entry);
                    }
                  });
                });
              return { name: group.name, entries };
            })
            .filter((section) => section.entries.length > 0)
        : filterSectionsByKeywords(primaryParsed, category).sections.map(applySettingLabels);

      const secondarySections = Array.isArray(category.sectionGroups)
        ? category.sectionGroups
            .map((group) => {
              const entries = [];
              secondaryParsed.sections
                .map(applySettingLabels)
                .forEach((section) => {
                  section.entries.forEach((entry) => {
                    const label = entry.label || entry.key;
                    if (group.labels.includes(label)) {
                      entries.push(entry);
                    }
                  });
                });
              return { name: group.name, entries };
            })
            .filter((section) => section.entries.length > 0)
        : filterSectionsByKeywords(secondaryParsed, category).sections.map(applySettingLabels);

      diffMap = buildDiffMap(primarySections, secondarySections);
    }
  }

  const categoryWithDiff = { ...category, diffMap };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {category.label}
      </Typography>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns }}>
        {columns.map((column) => (
          <SetupColumn
            key={column.title}
            title={column.title}
            setupKey={column.setupKey}
            data={setupFiles[column.setupKey]}
            loading={loadingFiles[column.setupKey]}
            error={errors[column.setupKey]}
            category={categoryWithDiff}
            countryCodes={countryCodes}
          />
        ))}
      </Box>
    </Box>
  );
}
