import * as React from 'react';
import { Box, Tabs, Tab, Tooltip, Snackbar, Button } from '@mui/material';
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
import { electron } from './services/electron';
import { getSetupCategory } from './domain/setupCategories';
import { getCategoryDiffCount } from './domain/setupDiff';
import SupportFloatingButton from './components/SupportFloatingButton';
import { DONATION_URL } from './domain/donation';

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
  const tooltipTitle = hasDiffs ? `${count} difference(s) in section` : 'No difference(s) in section';

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
  const { settings, updateSettings } = useSettings();
  const [donationReminderOpen, setDonationReminderOpen] = React.useState(false);

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

  React.useEffect(() => {
    const shouldPrompt =
      settings.launchCount > 0 &&
      settings.launchCount % 10 === 0 &&
      (settings.donationClicks || 0) === 0 &&
      !settings.donationReminderDismissed;
    if (shouldPrompt) {
      setDonationReminderOpen(true);
    }
  }, [settings.launchCount, settings.donationClicks, settings.donationReminderDismissed]);

  const handleDonationClick = async () => {
    await updateSettings({ donationClicks: (settings.donationClicks || 0) + 1 });
    setDonationReminderOpen(false);
    if (electron?.openExternal) {
      electron.openExternal(DONATION_URL);
    } else {
      window.open(DONATION_URL, '_blank', 'noopener');
    }
  };

  const handleDismissReminder = async () => {
    await updateSettings({ donationReminderDismissed: true });
    setDonationReminderOpen(false);
  };

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
      <SupportFloatingButton />
      <Snackbar
        open={donationReminderOpen}
        onClose={(event, reason) => {
          if (reason === 'clickaway') {
            return;
          }
          setDonationReminderOpen(false);
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        style={{ top: 130, right: 10, left: 'auto', bottom: 'auto' }}
        ContentProps={{
          sx: {
            borderRadius: 2,
            border: '1px solid rgba(205, 70, 70, 0.6)',
            boxShadow: '0 0 12px rgba(205, 70, 70, 0.45)',
            backgroundColor: 'rgba(18, 22, 30, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#f2f4f7',
            fontWeight: 500,
          },
        }}
        message="Enjoying the app? Optional donations are available."
        action={
          <>
            <Button
              color="secondary"
              size="small"
              onClick={handleDonationClick}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                color: '#f2f4f7',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.45)',
                },
              }}
            >
              Support
            </Button>
            <Button color="inherit" size="small" onClick={handleDismissReminder}>
              Don’t show again
            </Button>
          </>
        }
      />
    </Box>
  );
}
