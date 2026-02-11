import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { hintTextSx } from './hintTextStyles';

export default function OptionsLmuFolderSection({ lmuPath, onChoose }) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        LMU Folder
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Button variant="outlined" size="small" onClick={onChoose}>
          Set LMU Folder
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ ...hintTextSx, mt: 1 }}>
          Current path: {lmuPath || '[not set]'}
        </Typography>
      </Box>
    </Box>
  );
}
