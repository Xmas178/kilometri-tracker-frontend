// ============================================
// Layout Component (Navbar + Content)
// ============================================
// This component wraps all pages with:
// - Navigation bar at top
// - Dark mode toggle
// - Logout button
// - Main content area

import { AppShell, Group, Button, Title, ActionIcon } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth.ts';
import { notifications } from '@mantine/notifications';
import { useColorScheme } from '../utils/ColorSchemeProvider.tsx';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const navigate = useNavigate();
    const { colorScheme, toggleColorScheme } = useColorScheme();

    // Handle logout
    const handleLogout = async () => {
        try {
            await logout();
            notifications.show({
                title: 'Kirjauduttu ulos',
                message: 'Olet kirjautunut ulos onnistuneesti',
                color: 'blue',
                autoClose: 8000,
            });
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AppShell
            header={{ height: 60 }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Title order={3}>KilometriTracker</Title>

                    <Group>
                        <Button variant="subtle" onClick={() => navigate('/dashboard')}>
                            Etusivu
                        </Button>
                        <Button variant="subtle" onClick={() => navigate('/trips')}>
                            Matkat
                        </Button>
                        <Button variant="subtle" onClick={() => navigate('/reports')}>
                            Raportit
                        </Button>
                        <Button variant="subtle" onClick={() => navigate('/profile')}>
                            Profiili
                        </Button>

                        {/* Dark mode toggle */}
                        <ActionIcon
                            variant="default"
                            onClick={toggleColorScheme}
                            size="lg"
                        >
                            {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
                        </ActionIcon>

                        <Button color="red" onClick={handleLogout}>
                            Kirjaudu ulos

                        </Button>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    );
}