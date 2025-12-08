// ============================================
// Mantine Theme Configuration
// ============================================
// Define colors, fonts, and styles for the app

import type { MantineTheme } from '@mantine/core';

// Custom theme settings
export const theme: Partial<MantineTheme> = {
    // Primary color (used for buttons, links, etc.)
    primaryColor: 'blue',

    // Default radius for buttons, inputs, cards (0 = sharp, 'md' = rounded)
    defaultRadius: 'md',

    // Font family
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',

    // You can customize colors here
    // colors: {
    //   brand: ['#f0f9ff', '#e0f2fe', '#bae6fd', ...],
    // },
};