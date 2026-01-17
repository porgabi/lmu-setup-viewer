import React from 'react';
import { Box, Typography } from '@mui/material';
import ReactCountryFlag from 'react-country-flag';
import { useSetupContext } from '../state/SetupContext';
import { getSetupCategory } from '../domain/setupCategories';
import { filterSectionsByKeywords } from '../domain/setupParser';
import { applySettingLabels } from '../domain/settingLabels';

function EntriesTable({ entries }) {
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
  return (
    <Box sx={{ fontSize: '0.9rem', fontVariantNumeric: 'tabular-nums' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns,
          columnGap: 0,
        }}
      >
        <Box sx={headerCellSx}>Setting</Box>
        <Box sx={{ ...headerCellSx, textAlign: 'right' }}>Value</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {entries.map((entry, index) => (
          <Box key={`${entry.key}-${index}`} sx={rowSx}>
            <Box sx={rowCellSx}>{entry.label || entry.key}</Box>
            <Box sx={{ ...rowCellSx, textAlign: 'right', color: 'text.secondary' }}>
              {(entry.comment && entry.comment.trim()) || entry.value || ''}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function SectionBlock({ section }) {
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
      {hasEntries ? <EntriesTable entries={section.entries} /> : null}
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

function renderHeading(setupKey, title, countryCodes) {
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
      <Box component="span">{label}</Box>
    </Box>
  );
}

function SetupColumn({ title, setupKey, data, loading, error, category, countryCodes }) {
  const heading = renderHeading(setupKey, title, countryCodes);

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

  const { sections, availableSections } = filterSectionsByKeywords(parsed, category);
  const labeledSections = sections
    .map(applySettingLabels)
    .filter((section) => section.entries.length > 0 || section.lines.length > 0);

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
          <SectionBlock key={`${setupKey}-${section.name}`} section={section} />
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
            category={category}
            countryCodes={countryCodes}
          />
        ))}
      </Box>
    </Box>
  );
}
