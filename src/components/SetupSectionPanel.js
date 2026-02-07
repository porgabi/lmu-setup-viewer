import React from 'react';
import { Box, Typography } from '@mui/material';
import { useSetupContext } from '../state/SetupContext';
import { getSetupCategory } from '../domain/setupCategories';
import { filterSectionsByKeywords } from '../domain/setupParser';
import { applySettingLabels } from '../domain/settingLabels';
import { resolveCarInfo } from '../domain/carInfo';
import { getCategoryDiffMap, getCompoundColor, getDisplayValue } from '../domain/setupDiff';
import { buildGroupedSections } from '../domain/setupGrouping';
import SetupHeading from './SetupHeading';
import { useSettings } from '../state/SettingsContext';

function EntriesTable({ entries, sectionName, diffMap }) {
  const gridTemplateColumns = 'minmax(0, 1.6fr) minmax(0, 1fr)';
  const rowCellSx = {
    py: 0.5,
    px: 0.75,
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
    borderRadius: 2,
    '&:hover': {
      boxShadow: 'inset 0 0 0 1px rgba(205, 70, 70, 0.75)',
    },
  };

  const buildKey = (entryKey) => `${sectionName}::${entryKey}`;
  
  return (
    <Box sx={{ fontSize: '1.0rem', fontVariantNumeric: 'tabular-nums' }}>
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

function SectionBlock({ section, diffMap, noMargin }) {
  const hasEntries = section.entries.length > 0;
  const hasLines = section.lines.length > 0;
  const content = hasLines ? section.lines.join('\n') : '';
  
  return (
    <Box
      sx={{
        mb: noMargin ? 0 : 2,
        p: 2,
        bgcolor: 'rgba(8, 10, 14, 0.75)',
        borderRadius: 2,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Typography
        variant="subtitle1"
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

function renderSections(sections, diffMap, layout, setupKey) {
  if (!layout?.single?.length) {
    return sections.map((section) => (
      <SectionBlock key={`${setupKey}-${section.name}`} section={section} diffMap={diffMap} />
    ));
  }

  const sectionsByName = new Map();
  sections.forEach((section) => {
    sectionsByName.set(section.name.toUpperCase(), section);
  });

  const used = new Set();
  const rows = layout.single
    .map((row) =>
      row
        .map((name) => {
          const section = sectionsByName.get(String(name).toUpperCase());
          if (section) {
            used.add(section.name.toUpperCase());
          }
          return section;
        })
        .filter(Boolean)
    )
    .filter((row) => row.length > 0);

  const leftovers = sections.filter((section) => !used.has(section.name.toUpperCase()));
  const rowKeyBase = setupKey || 'sections';

  return (
    <>
      {rows.map((rowSections, rowIndex) => (
        <Box
          key={`${rowKeyBase}-row-${rowIndex}`}
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: `repeat(${rowSections.length}, minmax(0, 1fr))`,
            mb: rowIndex === rows.length - 1 && leftovers.length === 0 ? 0 : 2,
          }}
        >
          {rowSections.map((section) => (
            <SectionBlock
              key={`${setupKey}-${section.name}`}
              section={section}
              diffMap={diffMap}
              noMargin
            />
          ))}
        </Box>
      ))}
      {leftovers.map((section) => (
        <SectionBlock key={`${setupKey}-${section.name}`} section={section} diffMap={diffMap} />
      ))}
    </>
  );
}

function SetupColumn({ title, setupKey, data, loading, error, category, trackInfo, layout }) {
  const rawCarName = data?.parsed?.metadata?.vehicleClass;
  const carInfo = resolveCarInfo(rawCarName);
  const heading = (
    <SetupHeading title={title} setupKey={setupKey} trackInfo={trackInfo} carInfo={carInfo} />
  );

  if (!setupKey) {
    return (
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: '0.08em' }}>
          {heading}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select a setup.
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
    labeledSections = buildGroupedSections(parsed, category.sectionGroups);
  } else {
    const { sections, availableSections: sectionList } = filterSectionsByKeywords(parsed, category);
    availableSections = sectionList;
    labeledSections = sections
      .map(applySettingLabels)
      .filter((section) => section.entries.length > 0 || section.lines.length > 0);
  }

  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, letterSpacing: '0.08em' }}>
        {heading}
      </Typography>
      {labeledSections.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No matching sections for this category.
          {availableSections.length ? ` Available sections: ${availableSections.join(', ')}` : ''}
        </Typography>
      ) : (
        renderSections(labeledSections, category.diffMap, layout, setupKey)
      )}
    </Box>
  );
}

export default function SetupSectionPanel({ categoryKey }) {
  const {
    primarySetup,
    secondarySetup,
    comparisonEnabled,
    trackInfo,
    setupFiles,
    loadingFiles,
    errors,
  } = useSetupContext();
  const { settings } = useSettings();

  const category = getSetupCategory(categoryKey);
  const columns = [
    {
      title: 'Primary setup',
      setupKey: primarySetup,
    },
  ];

  if (comparisonEnabled) {
    columns.push({
      title: 'Compared setup',
      setupKey: secondarySetup,
    });
  }

  const gridTemplateColumns =
    columns.length > 1 ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)';

  let diffMap = null;
  if (comparisonEnabled && settings.diffHighlightEnabled && primarySetup && secondarySetup) {
    const primaryParsed = setupFiles[primarySetup]?.parsed;
    const secondaryParsed = setupFiles[secondarySetup]?.parsed;
    diffMap = getCategoryDiffMap(category, primaryParsed, secondaryParsed);
  }

  const categoryWithDiff = { ...category, diffMap };
  const layout = comparisonEnabled ? null : category.layout;

  return (
    <Box>
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
            trackInfo={trackInfo}
            layout={layout}
          />
        ))}
      </Box>
    </Box>
  );
}
