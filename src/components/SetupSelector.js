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
import { useSetupContext } from '../state/SetupContext';
import { buildSetupMenuData, defaultClassOrder } from '../domain/setupDisplay';
import { renderSetupValue } from './setupDisplay';
import SetupMenuItem from './SetupMenuItem';

function buildMenuItems(setupIndex, trackInfo, excludeValue, showIcons) {
  // TODO: will come from app settings.
  const classOrder = defaultClassOrder;

  const sections = buildSetupMenuData(setupIndex, trackInfo, excludeValue, classOrder);
  const items = [];

  sections.forEach((section) => {
    items.push(
      <ListSubheader
        key={`${section.track}-header`}
        sx={{
          backgroundColor: 'rgba(8, 10, 14, 0.9)',
          textTransform: 'uppercase',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {section.trackLabel}
      </ListSubheader>
    );

    section.items.forEach((setup) => {
      const value = `${section.track}/${setup.name}`;
      items.push(
        <SetupMenuItem
          key={value}
          value={value}
          track={section.track}
          trackLabel={section.trackLabel}
          countryCode={section.countryCode}
          setupName={setup.name}
          classIconPath={setup.classIconPath}
          brandIconPath={setup.brandIconPath}
          showIcons={showIcons}
        />
      );
    });
  });

  if (items.length === 0) {
    items.push(
      <MenuItem key="no-setups" value="" disabled>
        No setups found.
      </MenuItem>
    );
  }

  return items;
}

export default function SetupSelector() {
  const {
    lmuPath,
    setupIndex,
    trackInfo,
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
  const [primaryMenuOpen, setPrimaryMenuOpen] = React.useState(false);
  const [secondaryMenuOpen, setSecondaryMenuOpen] = React.useState(false);

  const handlePrimaryChange = (event) => {
    setPrimarySetup(event.target.value);
  };

  const handleSecondaryChange = (event) => {
    setSecondarySetup(event.target.value);
  };

  const menuProps = {
    disableScrollLock: true,
    PaperProps: {
      sx: {
        maxHeight: 320,
        overflowY: 'auto',
        backgroundColor: 'rgba(8, 10, 14, 0.96)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(6px)',
        '& .MuiMenuItem-root': {
          fontSize: '0.95rem',
        },
      },
    },
  };

  const gamePath = lmuPath || '(not set)';
  const pathTooltip = `Current game path: ${gamePath}`;
  const primaryMenuItems = React.useMemo(
    () => buildMenuItems(setupIndex, trackInfo, secondarySetup, primaryMenuOpen),
    [setupIndex, trackInfo, secondarySetup, primaryMenuOpen]
  );
  const secondaryMenuItems = React.useMemo(
    () => buildMenuItems(setupIndex, trackInfo, primarySetup, secondaryMenuOpen),
    [setupIndex, trackInfo, primarySetup, secondaryMenuOpen]
  );

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
        <FormControl
          sx={{
            minWidth: 260,
            flex: '1 1 280px',
            '& .MuiSelect-select': {
              fontSize: '0.95rem',
            },
            '& .MuiInputLabel-root': {
              fontSize: '0.9rem',
            },
            '& .MuiOutlinedInput-notchedOutline legend': {
              padding: 0,
            },
            '& .MuiInputLabel-root.MuiInputLabel-shrink + .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline legend':
              {
                padding: '0 4px',
              },
          }}
          size="small"
        >
          <InputLabel>Setup</InputLabel>
          <Select
            value={primarySetup}
            label="Setup"
            onChange={handlePrimaryChange}
            onOpen={() => setPrimaryMenuOpen(true)}
            onClose={() => setPrimaryMenuOpen(false)}
            MenuProps={menuProps}
            disabled={loadingIndex}
            renderValue={(value) => renderSetupValue(value, setupIndex, trackInfo)}
          >
            {primaryMenuItems}
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
        <FormControl
          sx={{
            minWidth: 260,
            flex: '1 1 280px',
            '& .MuiSelect-select': {
              fontSize: '0.95rem',
            },
            '& .MuiInputLabel-root': {
              fontSize: '0.9rem',
            },
            '& .MuiOutlinedInput-notchedOutline legend': {
              padding: 0,
            },
            '& .MuiInputLabel-root.MuiInputLabel-shrink + .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline legend':
              {
                padding: '0 13px',
              },
          }}
          size="small"
        >
          <InputLabel>Compared setup</InputLabel>
          <Select
            value={secondarySetup}
            label="Compared setup"
            onChange={handleSecondaryChange}
            onOpen={() => setSecondaryMenuOpen(true)}
            onClose={() => setSecondaryMenuOpen(false)}
            MenuProps={menuProps}
            disabled={loadingIndex || !comparisonEnabled}
            renderValue={(value) => renderSetupValue(value, setupIndex, trackInfo)}
          >
            {secondaryMenuItems}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
