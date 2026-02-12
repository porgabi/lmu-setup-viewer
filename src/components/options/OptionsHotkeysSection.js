import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { hintTextSx } from './hintTextStyles';

const HOTKEY_ROWS = [
  { shortcut: 'O', action: 'Open options' },
  { shortcut: 'R', action: 'Reload setups' },
  { shortcut: '1', action: 'Open setup selector 1' },
  { shortcut: '2', action: 'Open setup selector 2' },
  { shortcut: 'C', action: 'Toggle comparison mode' },
  { shortcut: 'Ctrl + Tab', action: 'Cycle setup tabs forward' },
  { shortcut: 'Ctrl + Shift + Tab', action: 'Cycle setup tabs backward' },
];

export default function OptionsHotkeysSection() {
  const [showHotkeys, setShowHotkeys] = React.useState(false);

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Hotkeys
      </Typography>
      <Button
        variant="outlined"
        size="small"
        onClick={() => setShowHotkeys((prev) => !prev)}
      >
        {showHotkeys ? 'Hide hotkeys' : 'Show hotkeys'}
      </Button>
      <Typography variant="caption" color="text.secondary" sx={{ ...hintTextSx, mt: 0.5, mb: showHotkeys ? 1 : 0, display: 'block' }}>
        View available hotkeys.
      </Typography>
      {showHotkeys ? (
        <Box
          sx={{
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 1.5,
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            overflow: 'hidden',
          }}
        >
          {HOTKEY_ROWS.map((row, index) => (
            <Box
              key={row.shortcut}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.6fr)',
                alignItems: 'center',
                gap: 1,
                px: 1.25,
                py: 0.7,
                borderBottom:
                  index === HOTKEY_ROWS.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  ...hintTextSx,
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  color: 'rgba(255, 255, 255, 0.92)',
                }}
              >
                {row.shortcut}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={hintTextSx}>
                {row.action}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}
