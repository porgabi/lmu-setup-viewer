import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { SetupProvider } from './state/SetupContext';
import theme from './theme/theme';

test('renders setup selector', () => {
  render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SetupProvider>
        <App />
      </SetupProvider>
    </ThemeProvider>
  );

  const hint = screen.getByText(/select setups to view\/compare/i);
  expect(hint).toBeInTheDocument();
});