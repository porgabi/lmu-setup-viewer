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
import { resolveCarInfo } from '../domain/carInfo';

function splitSetupKey(setupKey) {
  if (!setupKey) return { track: '', setupName: '' };
  const separatorIndex = setupKey.indexOf('/');
  if (separatorIndex === -1) {
    return { track: '', setupName: setupKey };
  }
  return {
    track: setupKey.slice(0, separatorIndex),
    setupName: setupKey.slice(separatorIndex + 1),
  };
}

function getSetupEntry(setupIndex, track, setupName) {
  const setups = setupIndex?.[track];
  if (!Array.isArray(setups)) return null;
  const match = setups.find((setup) => {
    if (typeof setup === 'string') {
      return setup === setupName;
    }
    return setup?.name === setupName;
  });
  if (!match) return null;
  if (typeof match === 'string') {
    return { name: match, carTechnicalName: '' };
  }
  return match;
}

function renderSetupValue(value, setupIndex, trackInfo) {
  if (!value) return '';
  const { track, setupName } = splitSetupKey(value);
  if (!track || !setupName) return value;
  const entry = getSetupEntry(setupIndex, track, setupName);
  const carTechnicalName = entry?.carTechnicalName;
  const carInfo = resolveCarInfo(carTechnicalName);
  const brand = carInfo?.brand;
  const brandIconPath = brand ? `/assets/brands/${brand}.png` : '';
  const classIconPath = carInfo?.class ? `/assets/classes/${carInfo.class}.png` : '';
  const trackEntry = trackInfo?.[track];
  const countryCode = trackEntry?.countryCode;
  const trackLabel = trackEntry?.displayName || track;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {countryCode ? (
        <ReactCountryFlag
          svg
          countryCode={countryCode}
          style={{ width: '1.1em', height: '1.1em', display: 'block' }}
          aria-label={`${countryCode} flag`}
        />
      ) : null}
      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
        <Box component="span">{trackLabel}</Box>
        <Box component="span" sx={{ mx: 0.5 }}>
          /
        </Box>
        {classIconPath ? (
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '1.2em',
              height: '1em',
              mr: 0.5,
              flex: '0 0 1.2em',
            }}
          >
            <Box
              component="img"
              src={classIconPath}
              alt=""
              aria-hidden
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
              sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
            />
          </Box>
        ) : null}
        {brandIconPath ? (
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '1.4em',
              height: '1em',
              mr: 0.5,
              flex: '0 0 1.4em',
            }}
          >
            <Box
              component="img"
              src={brandIconPath}
              alt=""
              aria-hidden
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
              sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
            />
          </Box>
        ) : null}
        <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {setupName}
        </Box>
      </Box>
    </Box>
  );
}

function buildMenuItems(setupIndex, trackInfo, excludeValue) {
  const items = [];
  const classOrder = new Map([
    ['hy', 0],
    ['lmgt3', 1],
    ['lmp2_elms', 2],
    ['lmp2_wec', 3],
    ['gte', 4],
    ['lmp3', 5],
  ]);

  Object.entries(setupIndex).forEach(([track, setups]) => {
    if (!Array.isArray(setups)) return;
    const filtered = setups
      .map((setup) => {
        const setupName = typeof setup === 'string' ? setup : setup?.name;
        if (!setupName) return null;
        const carTechnicalName = typeof setup === 'string' ? '' : setup?.carTechnicalName;
        const carInfo = resolveCarInfo(carTechnicalName);
        return {
          name: setupName,
          carInfo,
        };
      })
      .filter(Boolean)
      .filter((setup) => {
        const value = `${track}/${setup.name}`;
        return value !== excludeValue;
      });

    if (!filtered.length) return;

    filtered.sort((a, b) => {
      const aClass = a.carInfo?.class || '';
      const bClass = b.carInfo?.class || '';
      const aOrder = classOrder.has(aClass) ? classOrder.get(aClass) : classOrder.size + 1;
      const bOrder = classOrder.has(bClass) ? classOrder.get(bClass) : classOrder.size + 1;
      if (aOrder !== bOrder) return aOrder - bOrder;
      const aBrand = a.carInfo?.brand || '';
      const bBrand = b.carInfo?.brand || '';
      const brandCompare = aBrand.localeCompare(bBrand);
      if (brandCompare !== 0) return brandCompare;
      return a.name.localeCompare(b.name);
    });

    items.push(
      <ListSubheader
        key={`${track}-header`}
        sx={{
          backgroundColor: 'rgba(8, 10, 14, 0.9)',
          textTransform: 'uppercase',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {trackInfo?.[track]?.displayName || track}
      </ListSubheader>
    );

    filtered.forEach((setup) => {
      const setupName = setup.name;
      const carInfo = setup.carInfo;
      const brand = carInfo?.brand;
      const brandIconPath = brand ? `/assets/brands/${brand}.png` : '';
      const classIconPath = carInfo?.class ? `/assets/classes/${carInfo.class}.png` : '';
      const value = `${track}/${setupName}`;
      const trackEntry = trackInfo?.[track];
      const countryCode = trackEntry?.countryCode;
      const trackLabel = trackEntry?.displayName || track;
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
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
            <Box component="span">{trackLabel}</Box>
            <Box component="span" sx={{ mx: 0.5 }}>
              /
            </Box>
            {classIconPath ? (
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '1.2em',
                  height: '1em',
                  mr: 0.5,
                  flex: '0 0 1.2em',
                }}
              >
                <Box
                  component="img"
                  src={classIconPath}
                  alt=""
                  aria-hidden
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </Box>
            ) : null}
            {brandIconPath ? (
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '1.4em',
                  height: '1em',
                  mr: 0.5,
                  flex: '0 0 1.4em',
                }}
              >
                <Box
                  component="img"
                  src={brandIconPath}
                  alt=""
                  aria-hidden
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </Box>
            ) : null}
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
            MenuProps={menuProps}
            disabled={loadingIndex}
            renderValue={(value) => renderSetupValue(value, setupIndex, trackInfo)}
          >
            {buildMenuItems(setupIndex, trackInfo, secondarySetup)}
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
            MenuProps={menuProps}
            disabled={loadingIndex || !comparisonEnabled}
            renderValue={(value) => renderSetupValue(value, setupIndex, trackInfo)}
          >
            {buildMenuItems(setupIndex, trackInfo, primarySetup)}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
