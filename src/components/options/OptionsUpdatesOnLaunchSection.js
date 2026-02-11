import React from 'react';
import { Box, FormControlLabel, Switch, Typography } from '@mui/material';
import { hintTextSx } from './hintTextStyles';

export default function OptionsUpdatesOnLaunchSection({
  checkUpdates,
  onCheckUpdatesChange,
  minimizeToTrayOnClose,
  onMinimizeToTrayChange,
  startOnLogin,
  onStartOnLoginChange,
  showStartOnLogin,
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
      {showStartOnLogin ? (
        <Box>
          <FormControlLabel
            control={<Switch checked={startOnLogin} onChange={onStartOnLoginChange} />}
            label="Start with Windows"
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ ...hintTextSx, ml: 0, display: 'block' }}
          >
            Note: the executable must stay in the same location for this to keep working.
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}
