import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ReactCountryFlag from 'react-country-flag';
import { useSetupContext } from '../state/SetupContext';

function buildMenuItems(setupIndex, countryCodes, excludeValue) {
  const items = [];

  Object.entries(setupIndex).forEach(([track, setups]) => {
    const filtered = setups.filter((setupName) => {
      const value = `${track}/${setupName}`;
      return value !== excludeValue;
    });

    if (!filtered.length) return;

    items.push(
      <ListSubheader
        key={`${track}-header`}
        sx={{
          backgroundColor: 'rgba(8, 10, 14, 0.9)',
          textTransform: 'uppercase',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {track}
      </ListSubheader>
    );

    filtered.forEach((setupName) => {
      const value = `${track}/${setupName}`;
      const countryCode = countryCodes?.[track];
      const content = (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {countryCode ? (
            <ReactCountryFlag
              svg
              countryCode={countryCode}
              style={{ width: '1.1em', height: '1.1em', display: 'block' }}
              aria-label={`${countryCode} flag`}
            />
          ) : null}
          <Box component="span">
            <Box component="span">{track}</Box>
            <Box component="span" sx={{ mx: 0.5 }}>
              /
            </Box>
            <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {setupName}
            </Box>
          </Box>
        </Box>
      );
      items.push(
        <MenuItem key={value} value={value}>
          {content}
        </MenuItem>
      );
    });
  });

  if (items.length === 0) {
    items.push(
      <MenuItem key="no-setups" value="" disabled>
        No setups found
      </MenuItem>
    );
  }

  return items;
}

export default function SetupSelector() {
  const {
    lmuPath,
    setupIndex,
    countryCodes,
    primarySetup,
    secondarySetup,
    comparisonEnabled,
    loadingIndex,
    chooseLmuPath,
    refreshSetupIndex,
    setPrimarySetup,
    setSecondarySetup,
    setComparisonEnabled,
  } = useSetupContext();

  const handlePrimaryChange = (event) => {
    setPrimarySetup(event.target.value);
  };

  const handleSecondaryChange = (event) => {
    setSecondarySetup(event.target.value);
  };

  const menuProps = {
    PaperProps: {
      sx: {
        maxHeight: 320,
        overflowY: 'auto',
        backgroundColor: 'rgba(8, 10, 14, 0.96)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(6px)',
      },
    },
  };

  const gamePath = lmuPath || '(not set)';

  const pathTooltip = `Current game path: ${gamePath}`;

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: 'rgba(7, 9, 12, 0.86)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 10px 24px rgba(0, 0, 0, 0.35)',
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
        <Tooltip title={pathTooltip} placement="top-start">
          <Button variant="outlined" size="small" onClick={chooseLmuPath}>
            Set LMU Folder
          </Button>
        </Tooltip>
        <Tooltip title="Reload setups" placement="top">
          <span>
            <IconButton
              size="small"
              onClick={refreshSetupIndex}
              disabled={loadingIndex}
              aria-label="Reload setups"
              sx={{ p: 0.75 }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <FormControl sx={{ minWidth: 260, flex: '1 1 280px' }} size="small">
          <InputLabel>Setup</InputLabel>
          <Select
            value={primarySetup}
            label="Setup"
            onChange={handlePrimaryChange}
            MenuProps={menuProps}
            disabled={loadingIndex}
          >
            {buildMenuItems(setupIndex, countryCodes, secondarySetup)}
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={comparisonEnabled}
              onChange={(event) => setComparisonEnabled(event.target.checked)}
              size="small"
            />
          }
          label={
            <Box component="span" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Compare
            </Box>
          }
          sx={{ ml: 0 }}
        />
        <FormControl sx={{ minWidth: 260, flex: '1 1 280px' }} size="small">
          <InputLabel>Compared setup</InputLabel>
          <Select
            value={secondarySetup}
            label="Compared setup"
            onChange={handleSecondaryChange}
            MenuProps={menuProps}
            disabled={loadingIndex || !comparisonEnabled}
          >
            {buildMenuItems(setupIndex, countryCodes, primarySetup)}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
