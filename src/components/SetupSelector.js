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
import SettingsIcon from '@mui/icons-material/Settings';
import { useSetupContext } from '../state/SetupContext';
import {
  buildSetupMenuData,
  defaultClassOrder,
  defaultClassOrderKeys,
} from '../domain/setupDisplay';
import { renderSetupValue } from './setupDisplay';
import SetupMenuItem from './SetupMenuItem';
import VirtualizedMenuList from './VirtualizedMenuList';
import OptionsDialog from './OptionsDialog';
import { useSettings } from '../state/SettingsContext';
import { electron } from '../services/electron';
import { getAssetPath } from '../domain/assetPaths';

function buildMenu(setupIndex, trackInfo, excludeValue, showIcons, classOrder, classFilter) {
  const sections = buildSetupMenuData(
    setupIndex,
    trackInfo,
    excludeValue,
    classOrder,
    classFilter
  );
  const items = [];

  sections.forEach((section) => {
    items.push(
      <ListSubheader
        key={`${section.track}-header`}
        sx={{
          width: '100%',
          boxSizing: 'border-box',
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

  return { items, sections };
}

function buildSectionIndexItems(sections) {
  let offset = 0;
  return sections.map((section) => {
    const entry = {
      track: section.track,
      trackLabel: section.trackLabel,
      countryCode: section.countryCode,
      index: offset,
    };
    offset += 1 + section.items.length;
    return entry;
  });
}

function findSetupItemIndex(items, setupKey) {
  if (!setupKey) return 0;
  const index = items.findIndex((item) => item?.props?.value === setupKey);
  if (index === -1) return 0;
  return Math.max(index, 0);
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
  const { settings, updateSettings } = useSettings();
  const [primaryMenuOpen, setPrimaryMenuOpen] = React.useState(false);
  const [secondaryMenuOpen, setSecondaryMenuOpen] = React.useState(false);
  const primaryControlRef = React.useRef(null);
  const secondaryControlRef = React.useRef(null);
  const primarySelectRef = React.useRef(null);
  const secondarySelectRef = React.useRef(null);
  const [primaryMenuWidth, setPrimaryMenuWidth] = React.useState(null);
  const [secondaryMenuWidth, setSecondaryMenuWidth] = React.useState(null);
  const [optionsOpen, setOptionsOpen] = React.useState(false);

  const handlePrimaryChange = (event) => {
    setPrimarySetup(event.target.value);
  };

  const handleSecondaryChange = (event) => {
    setSecondarySetup(event.target.value);
  };

  const classOrderKeys = React.useMemo(() => {
    const order = settings?.dropdownSortOrder;
    if (!Array.isArray(order) || order.length === 0) return defaultClassOrderKeys;
    return order;
  }, [settings?.dropdownSortOrder]);
  const classOrder = React.useMemo(() => {
    return new Map(classOrderKeys.map((value, index) => [value, index]));
  }, [classOrderKeys]);
  const classFilter = React.useMemo(() => {
    return Array.isArray(settings?.classFilter) ? settings.classFilter : classOrderKeys;
  }, [settings?.classFilter]);
  const classFilterItems = React.useMemo(() => {
    const selected = new Set(classFilter);
    return classOrderKeys.map((classKey) => ({
      key: classKey,
      label: classKey,
      icon: getAssetPath(`assets/classes/${classKey}.png`),
      checked: selected.has(classKey),
    }));
  }, [classFilter, classOrderKeys]);
  const handleClassFilterChange = React.useCallback(
    (next) => {
      updateSettings({ classFilter: next });
    },
    [updateSettings]
  );

  const menuHeightMap = {
    short: 320,
    medium: 500,
    long: 800,
  };
  const menuMaxHeight = menuHeightMap[settings.dropdownListSize] || menuHeightMap.short;
  const buildMenuProps = React.useCallback(
    (menuWidth) => {
      const widthValue = menuWidth ? `${menuWidth}px` : undefined;
      return {
      disableScrollLock: true,
      PaperProps: {
        sx: {
          backgroundColor: 'rgba(8, 10, 14, 0.96)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(6px)',
          overflow: 'hidden',
          width: widthValue,
          minWidth: widthValue,
          maxWidth: widthValue,
          '& .MuiMenuItem-root': {
            fontSize: '0.95rem',
          },
        },
      },
      MenuListProps: {
        component: VirtualizedMenuList,
        maxHeight: menuMaxHeight,
        rowHeight: 40,
        overscan: 5,
      },
    };
    },
    [menuMaxHeight]
  );

  React.useLayoutEffect(() => {
    if (!primaryControlRef.current || typeof ResizeObserver === 'undefined') return undefined;
    const updateWidth = () => {
      const width = primaryControlRef.current?.getBoundingClientRect?.().width;
      if (width) {
        setPrimaryMenuWidth(Math.round(width));
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(primaryControlRef.current);
    return () => observer.disconnect();
  }, []);

  React.useLayoutEffect(() => {
    if (!secondaryControlRef.current || typeof ResizeObserver === 'undefined') return undefined;
    const updateWidth = () => {
      const width = secondaryControlRef.current?.getBoundingClientRect?.().width;
      if (width) {
        setSecondaryMenuWidth(Math.round(width));
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(secondaryControlRef.current);
    return () => observer.disconnect();
  }, []);

  const gamePath = lmuPath || '(not set)';
  const primaryMenu = React.useMemo(
    () =>
      buildMenu(setupIndex, trackInfo, secondarySetup, primaryMenuOpen, classOrder, classFilter),
    [setupIndex, trackInfo, secondarySetup, primaryMenuOpen, classOrder, classFilter]
  );
  const secondaryMenu = React.useMemo(
    () =>
      buildMenu(setupIndex, trackInfo, primarySetup, secondaryMenuOpen, classOrder, classFilter),
    [setupIndex, trackInfo, primarySetup, secondaryMenuOpen, classOrder, classFilter]
  );
  const primaryMenuItems = primaryMenu.items;
  const secondaryMenuItems = secondaryMenu.items;
  const primaryScrollIndex = React.useMemo(
    () => findSetupItemIndex(primaryMenuItems, primarySetup),
    [primaryMenuItems, primarySetup]
  );
  const secondaryScrollIndex = React.useMemo(
    () => findSetupItemIndex(secondaryMenuItems, secondarySetup),
    [secondaryMenuItems, secondarySetup]
  );
  const primarySectionIndexItems = React.useMemo(
    () => buildSectionIndexItems(primaryMenu.sections),
    [primaryMenu.sections]
  );
  const secondarySectionIndexItems = React.useMemo(
    () => buildSectionIndexItems(secondaryMenu.sections),
    [secondaryMenu.sections]
  );
  const showPathBanner = !lmuPath;

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
      {showPathBanner ? (
        <Box
          sx={{
            mb: 2,
            p: 1.5,
            borderRadius: 2,
            border: '1px solid rgba(205, 70, 70, 0.6)',
            boxShadow: '0 0 12px rgba(205, 70, 70, 0.45)',
            backgroundColor: 'rgba(18, 22, 30, 0.85)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box sx={{ flex: '1 1 auto', minWidth: 240 }}>
            <Box sx={{ fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              LMU folder not set
            </Box>
            <Box sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
              Select your LMU installation folder to load setups.
            </Box>
          </Box>
          <Button
            variant="contained"
            size="small"
            onClick={chooseLmuPath}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              color: '#f2f4f7',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.45)',
              },
            }}
          >
            Set LMU Folder
          </Button>
        </Box>
      ) : null}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
        <Tooltip title="Options" placement="top">
          <span>
            <IconButton
              size="small"
              onClick={() => setOptionsOpen(true)}
              aria-label="Options"
              sx={{ p: 0.75 }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Reload setups" placement="top">
          <span>
            <IconButton
              size="small"
              onClick={refreshSetupIndex}
              disabled={loadingIndex}
              aria-label="Reload setups"
              sx={{
                p: 0.75,
                '&.Mui-disabled': {
                  opacity: 1,
                  color: 'rgba(255, 255, 255, 0.65)',
                },
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <FormControl
          ref={primaryControlRef}
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
            onOpen={() => {
              setPrimaryMenuOpen(true);
              const width = primarySelectRef.current?.getBoundingClientRect?.().width;
              if (width) {
                setPrimaryMenuWidth(Math.round(width));
              }
            }}
            onClose={() => setPrimaryMenuOpen(false)}
            MenuProps={(() => {
              const menuProps = buildMenuProps(primaryMenuWidth);
              return {
                ...menuProps,
                MenuListProps: {
                  ...menuProps.MenuListProps,
                  initialScrollIndex: primaryScrollIndex,
                  sectionIndexItems: primarySectionIndexItems,
                  classFilterItems,
                  onClassFilterChange: handleClassFilterChange,
                },
              };
            })()}
            renderValue={(value) => renderSetupValue(value, setupIndex, trackInfo)}
            inputRef={primarySelectRef}
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
          ref={secondaryControlRef}
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
            onOpen={() => {
              setSecondaryMenuOpen(true);
              const width = secondarySelectRef.current?.getBoundingClientRect?.().width;
              if (width) {
                setSecondaryMenuWidth(Math.round(width));
              }
            }}
            onClose={() => setSecondaryMenuOpen(false)}
            MenuProps={(() => {
              const menuProps = buildMenuProps(secondaryMenuWidth);
              return {
                ...menuProps,
                MenuListProps: {
                  ...menuProps.MenuListProps,
                  initialScrollIndex: secondaryScrollIndex,
                  sectionIndexItems: secondarySectionIndexItems,
                  classFilterItems,
                  onClassFilterChange: handleClassFilterChange,
                },
              };
            })()}
            disabled={!comparisonEnabled}
            renderValue={(value) => renderSetupValue(value, setupIndex, trackInfo)}
            inputRef={secondarySelectRef}
          >
            {secondaryMenuItems}
          </Select>
        </FormControl>
      </Box>
      <OptionsDialog open={optionsOpen} onClose={() => setOptionsOpen(false)} />
    </Box>
  );
}
