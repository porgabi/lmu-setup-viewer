import React from 'react';
import { Box, FormControlLabel, Switch } from '@mui/material';

export default function OptionsWindowSection({
  startMinimized,
  onStartMinimizedChange,
  alwaysOnTop,
  onAlwaysOnTopChange,
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <FormControlLabel
        control={<Switch checked={startMinimized} onChange={onStartMinimizedChange} />}
        label="Start minimized"
      />
      <FormControlLabel
        control={<Switch checked={alwaysOnTop} onChange={onAlwaysOnTopChange} />}
        label="Always on top"
      />
    </Box>
  );
}
