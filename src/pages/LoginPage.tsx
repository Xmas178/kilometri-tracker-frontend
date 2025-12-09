// ============================================
// Login Page Component
// ============================================
// Handles user authentication with:
// - Username and password form
// - JWT token storage on success
// - Error notifications on failure
// - Redirect to dashboard after login

import { ActionIcon } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useColorScheme } from '../utils/ColorSchemeProvider.tsx';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Paper,
    Title,
    TextInput,
    PasswordInput,
    Button,
    Text,
    Stack,
    Anchor
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { login } from '../api/auth.ts';
import { translateBackendError } from '../utils/translateError.ts';

export function LoginPage() {
    const navigate = useNavigate();

    const { colorScheme, toggleColorScheme } = useColorScheme();

    // Loading state for submit button
    const [loading, setLoading] = useState(false);

    // Form data state
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Call login API (saves JWT tokens automatically)
            const response = await login(formData);

            // Show success notification
            notifications.show({
                title: 'Onnistui!',
                message: `Tervetuloa takaisin, ${response.user.username}!`,
                color: 'green',
                autoClose: 8000,
            });
            // Redirect to dashboard
            navigate('/dashboard');
        } catch (error: any) {
            // Show error notification
            notifications.show({
                title: 'Kirjautuminen epäonnistui',
                message: translateBackendError(error),
                color: 'red',
                autoClose: 8000,
            });
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Container size={420} my={40} pos="relative">
            <ActionIcon
                variant="default"
                onClick={toggleColorScheme}
                size="lg"
                style={{ position: 'absolute', top: 0, right: 0 }}
            >
                {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>

            <Title ta="center" mb="md">
                KilometriTracker
            </Title>
            <Text c="dimmed" size="sm" ta="center" mb="xl">
                Kirjaudu sisään hallitaksesi matkojasi
            </Text>

            <Paper withBorder shadow="md" p={30} radius="md">
                <form onSubmit={handleSubmit}>
                    <Stack>
                        <TextInput
                            label="Käyttäjätunnus"
                            placeholder="Käyttäjätunnuksesi"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />

                        <PasswordInput
                            label="Salasana"
                            placeholder="Salasanasi"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />

                        <Button type="submit" fullWidth loading={loading}>
                            Kirjaudu sisään
                        </Button>
                    </Stack>
                </form>

                <Text ta="center" mt="md" size="sm">
                    Eikö sinulla ole tiliä?{' '}
                    <Anchor component={Link} to="/register">
                        Luo tili
                    </Anchor>
                </Text>
            </Paper>
        </Container>
    );
}