import React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function OptionsFeedbackSection({ feedbackEmail }) {
  const [emailCopied, setEmailCopied] = React.useState(false);
  const copyTimeoutRef = React.useRef(null);

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
        Feedback
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Got suggestions, new tool ideas for LMU, or found bugs? Let me know at {feedbackEmail}.
        </Typography>
        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              top: '-1.2rem',
              right: 0,
              color: '#6EE783',
              opacity: emailCopied ? 1 : 0,
              transform: emailCopied ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'opacity 150ms ease, transform 150ms ease',
              pointerEvents: 'none',
            }}
          >
            Copied
          </Typography>
          <Tooltip title="Copy email address" placement="top">
            <IconButton size="small" onClick={handleCopyEmail} aria-label="Copy email address">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}
