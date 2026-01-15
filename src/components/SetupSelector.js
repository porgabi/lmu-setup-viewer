import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Switch,
  Typography,
} from '@mui/material';
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
        sx={{ backgroundColor: 'background.paper', textTransform: 'uppercase' }}
      >
        {track}
      </ListSubheader>
    );

    filtered.forEach((setupName) => {
      const value = `${track}/${setupName}`;
      const countryCode = countryCodes?.[track];
      const prefix = countryCode ? (
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', mr: 1 }}>
          <ReactCountryFlag
            svg
            countryCode={countryCode}
            style={{ width: '1.1em', height: '1.1em' }}
            aria-label={`${countryCode} flag`}
          />
        </Box>
      ) : null;
      items.push(
        <MenuItem key={value} value={value}>
          {prefix}
          {value}
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
      style: {
        maxHeight: 320,
        overflowY: 'auto',
      },
    },
  };

  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', backgroundColor: 'background.paper' }}>
      <Typography variant="body1">Select setups to view/compare.</Typography>
      <Typography variant="caption" color="text.secondary">
        Current root path: {lmuPath || '(not set)'}
      </Typography>
      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
        <Button variant="outlined" size="small" onClick={chooseLmuPath}>
          Change LMU Folder
        </Button>
        <Button variant="text" size="small" onClick={refreshSetupIndex} disabled={loadingIndex}>
          Refresh setups
        </Button>
        <FormControlLabel
          control={
            <Switch
              checked={comparisonEnabled}
              onChange={(event) => setComparisonEnabled(event.target.checked)}
              size="small"
            />
          }
          label="Compare"
        />
      </Box>
      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <FormControl sx={{ minWidth: 320 }} size="small">
          <InputLabel>Primary setup</InputLabel>
          <Select
            value={primarySetup}
            label="Primary setup"
            onChange={handlePrimaryChange}
            MenuProps={menuProps}
            disabled={loadingIndex}
          >
            {buildMenuItems(setupIndex, countryCodes, secondarySetup)}
          </Select>
        </FormControl>
        {comparisonEnabled && (
          <FormControl sx={{ minWidth: 320 }} size="small">
            <InputLabel>Compare with</InputLabel>
            <Select
              value={secondarySetup}
              label="Compare with"
              onChange={handleSecondaryChange}
              MenuProps={menuProps}
              disabled={loadingIndex}
            >
              {buildMenuItems(setupIndex, countryCodes, primarySetup)}
            </Select>
          </FormControl>
        )}
      </Box>
    </Box>
  );
}
