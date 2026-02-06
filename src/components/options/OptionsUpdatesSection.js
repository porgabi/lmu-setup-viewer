import React from 'react';
import { Box, Button, Typography } from '@mui/material';

export default function OptionsUpdatesSection() {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Updates
      </Typography>
      <Button variant="outlined" size="small" disabled>
        Check for updates
      </Button>
    </Box>
  );
}
