import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Switch,
  Tooltip,
  Typography,
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

  const gamePath = lmuPath || '(not set)';

  const pathTooltip = `Current game path: ${gamePath}`;

  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', backgroundColor: 'background.paper' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <Box sx={{ minWidth: 260 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
            General configuration
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            sx={{ display: 'block', maxWidth: 520 }}
          >
            Current game path: {gamePath}
          </Typography>
        </Box>
        <Tooltip title={pathTooltip} placement="top-start">
          <Button variant="outlined" size="small" onClick={chooseLmuPath}>
            Set LMU Folder
          </Button>
        </Tooltip>
      </Box>
      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
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
        <FormControl sx={{ minWidth: 320, flex: '1 1 320px' }} size="small">
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
        {comparisonEnabled && (
          <FormControl sx={{ minWidth: 320, flex: '1 1 320px' }} size="small">
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
