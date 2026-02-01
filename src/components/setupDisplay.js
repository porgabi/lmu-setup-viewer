import React from 'react';
import { Box } from '@mui/material';
import ReactCountryFlag from 'react-country-flag';
import { resolveCarInfo } from '../domain/carInfo';
import { getSetupDisplayAssets, getSetupEntry, splitSetupKey } from '../domain/setupDisplay';
import IconSlot from './IconSlot';

export function renderSetupValue(value, setupIndex, trackInfo, iconSlotSize = {}) {
  if (!value) return '';
  
  const { track, setupName } = splitSetupKey(value);
  if (!track || !setupName) return value;
  
  const entry = getSetupEntry(setupIndex, track, setupName);
  const carTechnicalName = entry?.carTechnicalName;
  const carInfo = resolveCarInfo(carTechnicalName);
  const { brandIconPath, classIconPath } = getSetupDisplayAssets(carInfo);
  const trackEntry = trackInfo?.[track];
  const countryCode = trackEntry?.countryCode;
  const trackLabel = trackEntry?.displayName || track;
  const classWidth = iconSlotSize.classWidth || '1.2em';
  const brandWidth = iconSlotSize.brandWidth || '1.4em';

  return (
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
        <IconSlot src={classIconPath} width={classWidth} />
        <IconSlot src={brandIconPath} width={brandWidth} />
        <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {setupName}
        </Box>
      </Box>
    </Box>
  );
}
