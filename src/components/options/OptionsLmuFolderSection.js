import React from 'react';
import { Box, Button, Typography } from '@mui/material';

export default function OptionsLmuFolderSection({ lmuPath, onChoose }) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        LMU Folder
      </Typography>
      <Button variant="outlined" size="small" onClick={onChoose}>
        Set LMU Folder
      </Button>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Current path: {lmuPath || '[not set]'}
      </Typography>
    </Box>
  );
}
