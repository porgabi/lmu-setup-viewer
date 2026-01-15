import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1f3a5f' },
    secondary: { main: '#c28c16' },
    background: { default: '#f3f5f7', paper: '#ffffff' },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h6: {
      fontWeight: 700,
    },
    subtitle1: {
      fontWeight: 600,
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
