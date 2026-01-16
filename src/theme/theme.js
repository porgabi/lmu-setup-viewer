import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#f2f4f7' },
    secondary: { main: '#e0b15b' },
    background: { default: '#0a0d12', paper: 'rgba(12, 15, 20, 0.78)' },
    text: { primary: '#f1f3f6', secondary: '#a7afba' },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  shape: {
    borderRadius: 2,
  },
  typography: {
    fontFamily: '"Rajdhani", "Bahnschrift Condensed", "Oswald", "Segoe UI", sans-serif',
    h6: {
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    subtitle1: {
      fontWeight: 600,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
    subtitle2: {
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: 'var(--hud-bg)',
          backgroundImage:
            'radial-gradient(1200px 600px at 25% 0%, rgba(255, 255, 255, 0.08), transparent 60%), linear-gradient(130deg, var(--hud-blue) 0%, var(--hud-blue) 24%, rgba(0, 0, 0, 0) 24%), linear-gradient(230deg, var(--hud-red) 0%, var(--hud-red) 20%, rgba(0, 0, 0, 0) 20%)',
          backgroundAttachment: 'fixed',
        },
        '#root': {
          minHeight: '100vh',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 44,
          backgroundColor: 'rgba(7, 9, 12, 0.82)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        },
        indicator: {
          height: 2,
          backgroundColor: '#f2f4f7',
          boxShadow: '0 0 12px rgba(255, 255, 255, 0.6)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 44,
          padding: '12px 16px',
          fontWeight: 600,
          fontSize: '0.85rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.6)',
          '&.Mui-selected': {
            color: '#f2f4f7',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 600,
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.25)',
          color: '#f2f4f7',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.45)',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
        contained: {
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            boxShadow: 'none',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          backgroundColor: 'rgba(6, 8, 12, 0.65)',
          backdropFilter: 'blur(4px)',
          color: '#f1f3f6',
          fontSize: '0.85rem',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.12)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.25)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#f2f4f7',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 0.65)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: 'rgba(255, 255, 255, 0.65)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.85rem',
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
          },
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 600,
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.65)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(10, 12, 18, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.75rem',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 0.65)',
          '&.Mui-checked': {
            color: '#f2f4f7',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#f2f4f7',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(12, 15, 20, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
  },
});

export default theme;
