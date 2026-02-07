import * as React from 'react';
import { Box, Tabs, Tab, Tooltip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import SetupSelector from './components/SetupSelector';
import ChassisAndAero from './views/ChassisAndAero';
import Dampers from './views/Dampers';
import Powertrain from './views/Powertrain';
import WheelsAndBrakes from './views/WheelsAndBrakes';
import Suspension from './views/Suspension';
import { preloadBrandAndClassIcons } from './domain/assetPreload';
import { useSetupContext } from './state/SetupContext';
import { useSettings } from './state/SettingsContext';
import { getSetupCategory } from './domain/setupCategories';
import { getCategoryDiffCount } from './domain/setupDiff';

const TAB_DEFINITIONS = [
  { key: 'powertrain', label: 'Powertrain', Component: Powertrain },
  { key: 'wheelsAndBrakes', label: 'Wheels & Brakes', Component: WheelsAndBrakes },
  { key: 'suspension', label: 'Suspension', Component: Suspension },
  { key: 'dampers', label: 'Dampers', Component: Dampers },
  { key: 'chassisAndAero', label: 'Chassis & Aero', Component: ChassisAndAero },
];

// A component to show content per tab.
function TabPanel({ children, value, index }) {
  return (
    <Box role="tabpanel" hidden={value !== index} sx={{ px: 3, py: 2.5 }}>
      {value === index && children}
    </Box>
  );
}

function TabStatusLabel({ label, count, showStatus }) {
  if (!showStatus || typeof count !== 'number') {
    return <Box component="span">{label}</Box>;
  }

  const hasDiffs = count > 0;
  const badgeText = count > 99 ? '99+' : String(count);
  const tooltipTitle = hasDiffs ? `${count} differences in section` : 'No differences in section';

  return (
    <Box component="span" sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <Box component="span">{label}</Box>
      <Tooltip title={tooltipTitle} placement="top">
        <Box
          sx={{
            position: 'absolute',
            top: -6,
            right: -17,
            width: 18,
            height: 18,
            borderRadius: '50%',
            backgroundColor: hasDiffs ? 'rgba(205, 70, 70, 0.95)' : 'rgba(80, 190, 120, 0.95)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            fontWeight: 700,
            boxShadow: hasDiffs
              ? '0 0 10px rgba(205, 70, 70, 0.6)'
              : '0 0 10px rgba(80, 190, 120, 0.6)',
          }}
        >
          {hasDiffs ? badgeText : <CheckIcon sx={{ fontSize: '0.75rem' }} />}
        </Box>
      </Tooltip>
    </Box>
  );
}

export default function App() {
  const [value, setValue] = React.useState(0);
  const { comparisonEnabled, primarySetup, secondarySetup, setupFiles } = useSetupContext();
  const { settings } = useSettings();

  React.useEffect(() => {
    preloadBrandAndClassIcons();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const diffCounts = React.useMemo(() => {
    if (
      !comparisonEnabled ||
      !settings.diffHighlightEnabled ||
      !primarySetup ||
      !secondarySetup
    ) {
      return null;
    }

    const primaryParsed = setupFiles[primarySetup]?.parsed;
    const secondaryParsed = setupFiles[secondarySetup]?.parsed;
    if (!primaryParsed || !secondaryParsed) return null;

    return TAB_DEFINITIONS.reduce((acc, tab) => {
      const category = getSetupCategory(tab.key);
      acc[tab.key] = getCategoryDiffCount(category, primaryParsed, secondaryParsed);
      return acc;
    }, {});
  }, [
    comparisonEnabled,
    primarySetup,
    secondarySetup,
    setupFiles,
    settings.diffHighlightEnabled,
  ]);

  const showTabStatus = Boolean(
    comparisonEnabled &&
      settings.diffHighlightEnabled &&
      primarySetup &&
      secondarySetup &&
      diffCounts
  );

  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 10 }}>
        <SetupSelector />
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit"
          variant="standard"
          centered
          sx={{ px: 2 }}
        >
          {TAB_DEFINITIONS.map((tab) => (
            <Tab
              key={tab.key}
              label={
                <TabStatusLabel
                  label={tab.label}
                  count={diffCounts?.[tab.key]}
                  showStatus={showTabStatus}
                />
              }
            />
          ))}
        </Tabs>
      </Box>

      {TAB_DEFINITIONS.map((tab, index) => {
        const PanelComponent = tab.Component;
        return (
          <TabPanel key={tab.key} value={value} index={index}>
            <PanelComponent />
          </TabPanel>
        );
      })}
    </Box>
  );
}
