import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { statusTextSx } from './statusTextStyles';
import { hintTextSx } from './hintTextStyles';

export default function OptionsUpdatesSection({ onCheckUpdates, checking, currentVersion }) {
  const [showChecking, setShowChecking] = React.useState(false);
  const hideTimeoutRef = React.useRef(null);

  React.useEffect(() => {
    if (checking) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      setShowChecking(true);
      return;
    }

    if (showChecking) {
      hideTimeoutRef.current = setTimeout(() => {
        setShowChecking(false);
      }, 1500);
    }
  }, [checking, showChecking]);

  React.useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Updates
      </Typography>
      <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
        <Typography
          variant="caption"
          sx={{
            ...statusTextSx,
            opacity: showChecking ? 1 : 0,
          }}
        >
          We are checking...
        </Typography>
        <Button variant="outlined" size="small" onClick={onCheckUpdates} disabled={checking}>
          Check for updates
        </Button>
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ ...hintTextSx, mt: 0.5, display: 'block' }}
      >
        Current version: {currentVersion || 'unknown'}
      </Typography>
    </Box>
  );
}
