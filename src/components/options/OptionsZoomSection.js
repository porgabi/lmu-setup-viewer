import React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { hintTextSx } from './hintTextStyles';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;
const STEP = 0.1;

function clampZoom(value) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

export default function OptionsZoomSection({ zoomFactor, onZoomChange }) {
  const safeZoom = Number.isFinite(zoomFactor) ? zoomFactor : 1;
  const percentLabel = `${Math.round(safeZoom * 100)}%`;

  const handleAdjust = (delta) => {
    const next = clampZoom(Number((safeZoom + delta).toFixed(2)));
    onZoomChange(next);
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Zoom level
      </Typography>
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          size="small"
          onClick={() => handleAdjust(-STEP)}
          aria-label="Decrease zoom"
          sx={{ p: 0.5 }}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Tooltip title="Reset to default" placement="top">
          <Box
            component="span"
            onClick={() => onZoomChange(1)}
            sx={{
              cursor: 'pointer',
              minWidth: 56,
              textAlign: 'center',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 30,
              px: 0.8,
              py: 0.2,
              borderRadius: 2,
              border: '1px solid transparent',
              backgroundColor: 'transparent',
              transition: 'background-color 150ms ease, border-color 150ms ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderColor: 'rgba(255, 255, 255, 0.35)',
              },
            }}
          >
            <Typography variant="body2">{percentLabel}</Typography>
          </Box>
        </Tooltip>
        <IconButton
          size="small"
          onClick={() => handleAdjust(STEP)}
          aria-label="Increase zoom"
          sx={{ p: 0.5 }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ ...hintTextSx, mt: 0.5, display: 'block' }}
      >
        Ctrl + / - can be used to change zoom level and Ctrl + 0 to reset to default.
      </Typography>
    </Box>
  );
}
