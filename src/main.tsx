// ============================================
// Main Entry Point
// ============================================
// This file:
// 1. Imports Mantine CSS (required!)
// 2. Wraps app with MantineProvider (theme)
// 3. Adds Notifications support (toast messages)
// 4. Adds Dark Mode support

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import App from './App.tsx';
import { theme } from './theme.ts';
import { ColorSchemeProvider, useColorScheme } from './utils/ColorSchemeProvider.tsx';

// Import Mantine core styles (REQUIRED!)
import '@mantine/core/styles.css';
// Import Mantine notifications styles (for toast messages)
import '@mantine/notifications/styles.css';
// Import Mantine dates styles (for date pickers - we'll use this later)
import '@mantine/dates/styles.css';

// Wrapper component to use colorScheme hook
function AppWrapper() {
  const { colorScheme } = useColorScheme();

  return (
    <MantineProvider theme={theme} forceColorScheme={colorScheme as 'light' | 'dark'}>
      <Notifications position="top-right" zIndex={1000} />
      <App />
    </MantineProvider>
  );
}

// Get root element from index.html
const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

// Render the app
createRoot(root).render(
  <StrictMode>
    <ColorSchemeProvider>
      <AppWrapper />
    </ColorSchemeProvider>
  </StrictMode>
);