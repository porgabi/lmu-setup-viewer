import React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useSettings } from '../state/SettingsContext';
import { useSetupContext } from '../state/SetupContext';
import OptionsDiffHighlightSection from './options/OptionsDiffHighlightSection';
import OptionsFeedbackSection from './options/OptionsFeedbackSection';
import OptionsListSizeSection from './options/OptionsListSizeSection';
import OptionsLmuFolderSection from './options/OptionsLmuFolderSection';
import OptionsSortingOrderSection from './options/OptionsSortingOrderSection';
import OptionsUpdatesOnLaunchSection from './options/OptionsUpdatesOnLaunchSection';
import OptionsUpdatesSection from './options/OptionsUpdatesSection';

export default function OptionsDialog({ open, onClose }) {
  const feedbackEmail = 'support@example.com';
  const { settings, loadingSettings, updateSettings, resetSettings } = useSettings();
  const { lmuPath, chooseLmuPath } = useSetupContext();
  const [draft, setDraft] = React.useState(settings);
  const [sortOrder, setSortOrder] = React.useState(settings.dropdownSortOrder);

  React.useEffect(() => {
    if (!open) return;

    setDraft(settings);
    setSortOrder(settings.dropdownSortOrder);
  }, [open, settings]);

  const handleToggle = (key) => (event) => {
    setDraft((prev) => ({ ...prev, [key]: event.target.checked }));
  };

  const handleSave = async () => {
    const next = {
      ...draft,
      dropdownSortOrder: sortOrder,
    };

    await updateSettings(next);
    onClose?.();
  };

  const handleReset = async () => {
    await resetSettings();
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Options</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <OptionsLmuFolderSection lmuPath={lmuPath} onChoose={chooseLmuPath} />
          <OptionsDiffHighlightSection
            checked={draft.diffHighlightEnabled}
            onChange={handleToggle('diffHighlightEnabled')}
          />
          <OptionsUpdatesOnLaunchSection
            checked={draft.checkUpdatesOnLaunch}
            onChange={handleToggle('checkUpdatesOnLaunch')}
          />
          <OptionsSortingOrderSection sortOrder={sortOrder} onSortOrderChange={setSortOrder} />
          <OptionsListSizeSection
            value={draft.dropdownListSize}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, dropdownListSize: event.target.value }))
            }
          />
          <OptionsUpdatesSection />
          <OptionsFeedbackSection feedbackEmail={feedbackEmail} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset} color="secondary" disabled={loadingSettings}>
          Restore Defaults
        </Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loadingSettings}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            color: '#f2f4f7',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.45)',
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
