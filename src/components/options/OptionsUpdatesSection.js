import React from 'react';
import { Box, Button, Typography } from '@mui/material';

export default function OptionsUpdatesSection({ onCheckUpdates, checking, currentVersion }) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Updates
      </Typography>
      <Button variant="outlined" size="small" onClick={onCheckUpdates} disabled={checking}>
        {checking ? 'Checking...' : 'Check for updates'}
      </Button>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
        Current version: {currentVersion || 'unknown'}
      </Typography>
    </Box>
  );
}
