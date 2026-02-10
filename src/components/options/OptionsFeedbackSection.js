import React from 'react';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { electron } from '../../services/electron';
import { useSettings } from '../../state/SettingsContext';
import { DONATION_URL } from '../../domain/donation';
import { statusTextSx } from './statusTextStyles';

export default function OptionsFeedbackSection({ feedbackEmail }) {
  const { settings, updateSettings } = useSettings();
  const [emailCopied, setEmailCopied] = React.useState(false);
  const copyTimeoutRef = React.useRef(null);
  const donationClicks = settings?.donationClicks || 0;

  const handleDonationClick = async () => {
    await updateSettings({ donationClicks: donationClicks + 1 });
    if (electron?.openExternal) {
      electron.openExternal(DONATION_URL);
    } else {
      window.open(DONATION_URL, '_blank', 'noopener');
    }
  };

  React.useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(feedbackEmail);
    } catch (error) {
      const textarea = document.createElement('textarea');
      textarea.value = feedbackEmail;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';

      document.body.appendChild(textarea);
      textarea.select();
      
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setEmailCopied(true);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setEmailCopied(false), 1500);
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Feedback & Support
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Missing a feature, want to add suggestions, or got new tool ideas for LMU? Feel free to let me know at{' '}
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            whiteSpace: 'nowrap',
          }}
        >
          <Box
            component="a"
            href={`mailto:${feedbackEmail}`}
            sx={{
              color: '#bcd7ff',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
              '&:hover': {
                color: '#e0ecff',
              },
            }}
          >
            {feedbackEmail}
          </Box>
          .
          <Box component="span" sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <Typography
              variant="caption"
              sx={{
                ...statusTextSx,
                ml: 0.4,
                opacity: emailCopied ? 1 : 0,
              }}
            >
              Copied
            </Typography>
            <Tooltip title="Copy email address" placement="top">
              <Box component="span">
                <IconButton
                  size="small"
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                  sx={{ p: 0.2 }}
                >
                  <ContentCopyIcon fontSize="inherit" sx={{ fontSize: '0.8rem' }} />
                </IconButton>
              </Box>
            </Tooltip>
          </Box>
        </Box>
      </Typography>
      <Typography variant="body2" color="text.secondary">
        If you're enjoying the app and feeling generous, optional donations are also welcome.
      </Typography>
      <Button
        variant="outlined"
        size="small"
        startIcon={<FavoriteBorderIcon />}
        onClick={handleDonationClick}
        sx={{
          mt: 1,
          borderColor: 'rgba(205, 70, 70, 0.7)',
          color: '#f2f4f7',
          boxShadow: '0 0 12px rgba(205, 70, 70, 0.45)',
          backgroundColor: 'rgba(18, 22, 30, 0.55)',
          '&:hover': {
            borderColor: 'rgba(205, 70, 70, 0.95)',
            boxShadow: '0 0 14px rgba(205, 70, 70, 0.6)',
            backgroundColor: 'rgba(18, 22, 30, 0.7)',
          },
        }}
      >
        Support on Ko-fi
      </Button>
    </Box>
  );
}
