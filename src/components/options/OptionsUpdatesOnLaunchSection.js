import React from 'react';
import { Box, FormControlLabel, Switch } from '@mui/material';

export default function OptionsUpdatesOnLaunchSection({
  checkUpdates,
  onCheckUpdatesChange,
  minimizeToTrayOnClose,
  onMinimizeToTrayChange,
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <FormControlLabel
        control={<Switch checked={checkUpdates} onChange={onCheckUpdatesChange} />}
        label="Check for updates on launch"
      />
      <FormControlLabel
        control={<Switch checked={minimizeToTrayOnClose} onChange={onMinimizeToTrayChange} />}
        label="Minimize to tray on close"
      />
    </Box>
  );
}
