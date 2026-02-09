import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { electron } from '../services/electron';
import { useSettings } from '../state/SettingsContext';
import { DONATION_URL } from '../domain/donation';

export default function SupportFloatingButton() {
  const { settings, updateSettings } = useSettings();
  const donationClicks = settings?.donationClicks || 0;
  const showDonationButton = donationClicks === 0;

  const handleDonationClick = async () => {
    await updateSettings({ donationClicks: donationClicks + 1 });
    if (electron?.openExternal) {
      electron.openExternal(DONATION_URL);
    } else {
      window.open(DONATION_URL, '_blank', 'noopener');
    }
  };

  if (!showDonationButton) {
    return null;
  }

  return (
    <Tooltip title="Support on Ko-fi" placement="left">
      <IconButton
        size="small"
        onClick={handleDonationClick}
        aria-label="Support on Ko-fi"
        sx={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          zIndex: 1200,
          backgroundColor: 'rgba(16, 18, 24, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.35)',
          '&:hover': {
            backgroundColor: 'rgba(24, 28, 36, 0.95)',
          },
        }}
      >
        <FavoriteBorderIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
