// ============================================
// Color Scheme Provider (Dark Mode)
// ============================================
// Manages dark/light theme switching
// Saves preference to localStorage

import { createContext, useContext, useState } from 'react';
import type { MantineColorScheme } from '@mantine/core';

interface ColorSchemeContextType {
    colorScheme: MantineColorScheme;
    toggleColorScheme: () => void;
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(undefined);

export function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
    // Get saved theme from localStorage or default to 'light'
    const [colorScheme, setColorScheme] = useState<MantineColorScheme>(() => {
        const saved = localStorage.getItem('color-scheme');
        return (saved === 'dark' || saved === 'light') ? saved : 'light';
    });

    // Toggle between light and dark
    const toggleColorScheme = () => {
        setColorScheme((current) => {
            const next = current === 'dark' ? 'light' : 'dark';
            localStorage.setItem('color-scheme', next);
            return next;
        });
    };

    return (
        <ColorSchemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
            {children}
        </ColorSchemeContext.Provider>
    );
}

// Custom hook to use color scheme
export function useColorScheme() {
    const context = useContext(ColorSchemeContext);
    if (!context) {
        throw new Error('useColorScheme must be used within ColorSchemeProvider');
    }
    return context;
}