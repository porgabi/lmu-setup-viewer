import React from 'react';
import { Box } from '@mui/material';

export default function IconSlot({ src, width = '1.2em', height = '1em', mr = 0.5, show = true }) {
  if (!src) return null;

  const slotSx = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width,
    height,
    mr,
    flex: `0 0 ${width}`,
    verticalAlign: 'middle',
  };

  if (!show) {
    return <Box component="span" sx={slotSx} />;
  }

  return (
    <Box
      component="span"
      sx={slotSx}
    >
      <Box
        component="img"
        src={src}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
        sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
      />
    </Box>
  );
}
