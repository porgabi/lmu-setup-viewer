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
      <Typography variant="body2" color="text.secondary">
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
                position: 'absolute',
                top: '50%',
                left: '100%',
                ml: 0.4,
                transform: emailCopied ? 'translateY(-50%) translateX(4px)' : 'translateY(-50%) translateX(0)',
                color: '#6EE783',
                opacity: emailCopied ? 1 : 0,
                transition: 'opacity 150ms ease, transform 150ms ease',
                pointerEvents: 'none',
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
    </Box>
  );
}
