import React from 'react';
import { Box, Typography } from '@mui/material';
import { useSetupContext } from '../state/SetupContext';
import { getSetupCategory } from '../domain/setupCategories';
import { filterSectionsByKeywords } from '../domain/setupParser';

function EntriesTable({ entries }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr) minmax(0, 1.4fr)',
        gap: 1,
        fontFamily: 'monospace',
        fontSize: '0.85rem',
      }}
    >
      <Box sx={{ fontWeight: 700 }}>Setting</Box>
      <Box sx={{ fontWeight: 700 }}>Value</Box>
      <Box sx={{ fontWeight: 700 }}>Notes</Box>
      {entries.map((entry, index) => (
        <React.Fragment key={`${entry.key}-${index}`}>
          <Box>{entry.key}</Box>
          <Box>{entry.value || '-'}</Box>
          <Box sx={{ color: 'text.secondary' }}>
            {entry.comment ? `// ${entry.comment}` : ''}
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );
}

function SectionBlock({ section }) {
  const hasEntries = section.entries.length > 0;
  const hasLines = section.lines.length > 0;
  const content = hasLines ? section.lines.join('\n') : '';
  return (
    <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', mb: 1 }}>
        {section.name}
      </Typography>
      {hasEntries ? <EntriesTable entries={section.entries} /> : null}
      {hasLines ? (
        <Box
          component="pre"
          sx={{ mt: hasEntries ? 2 : 0, m: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}
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

function SetupColumn({ title, setupKey, data, loading, error, category }) {
  if (!setupKey) {
    return (
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}
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
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}: {setupKey}
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
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}: {setupKey}
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
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}: {setupKey}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No data available for this setup.
        </Typography>
      </Box>
    );
  }

  const { sections, availableSections } = filterSectionsByKeywords(parsed, category);

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        {title}: {setupKey}
      </Typography>
      {sections.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No matching sections for this category.
          {availableSections.length ? ` Available sections: ${availableSections.join(', ')}` : ''}
        </Typography>
      ) : (
        sections.map((section) => (
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
          />
        ))}
      </Box>
    </Box>
  );
}
