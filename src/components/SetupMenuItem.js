import React from 'react';
import { Box, MenuItem } from '@mui/material';
import ReactCountryFlag from 'react-country-flag';
import IconSlot from './IconSlot';

export default function SetupMenuItem({
  value,
  track,
  trackLabel,
  countryCode,
  setupName,
  classIconPath,
  brandIconPath,
  showIcons = true,
  ...menuItemProps
}) {
  const menuItemSx = {
    width: '100%',
    ...(menuItemProps.sx || {}),
  };

  return (
    <MenuItem value={value} {...menuItemProps} sx={menuItemSx}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {countryCode ? (
          <ReactCountryFlag
            svg
            countryCode={countryCode}
            style={{ width: '1.1em', height: '1.1em', display: 'block' }}
            aria-label={`${countryCode} flag`}
          />
        ) : null}
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <Box component="span">{trackLabel}</Box>
          <Box component="span" sx={{ mx: 0.5 }}>
            /
          </Box>
          <IconSlot src={classIconPath} width="1.2em" show={showIcons} />
          <IconSlot src={brandIconPath} width="1.4em" show={showIcons} />
          <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {setupName}
          </Box>
        </Box>
      </Box>
    </MenuItem>
  );
}
