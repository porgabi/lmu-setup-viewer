import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { SetupProvider } from './state/SetupContext';
import { SettingsProvider } from './state/SettingsContext';
import theme from './theme/theme';

test('renders setup selector', () => {
  render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SettingsProvider>
        <SetupProvider>
          <App />
        </SetupProvider>
      </SettingsProvider>
    </ThemeProvider>
  );

  const banner = screen.getByText(/lmu folder not set/i);
  expect(banner).toBeInTheDocument();
});
