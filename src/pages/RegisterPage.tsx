// ============================================
// Register Page Component
// ============================================
// Handles user registration with:
// - Username, email, password fields
// - Optional: first_name, last_name, company, phone
// - Password confirmation validation
// - Auto-login after successful registration

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
    Anchor,
    ActionIcon,
    Group
} from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { register } from '../api/auth.ts';
import { useColorScheme } from '../utils/ColorSchemeProvider.tsx';
import { translateBackendError } from '../utils/translateError.ts';

export function RegisterPage() {
    const navigate = useNavigate();
    const { colorScheme, toggleColorScheme } = useColorScheme();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        company: '',
        phone: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log('=== REGISTER DEBUG ===');
        console.log('Form data:', formData);

        // Password check error
        if (formData.password !== formData.password2) {
            notifications.show({
                title: 'Virhe',
                message: 'Salasanat eivät täsmää',
                color: 'red',
                autoClose: 8000,
            });
            return;
        }

        setLoading(true);

        try {
            const response = await register(formData);

            // Success
            notifications.show({
                title: 'Onnistui!',
                message: `Tervetuloa, ${response.user.username}! Tili luotu.`,
                color: 'green',
                autoClose: 8000,
            });

            navigate('/dashboard');
        } catch (error: any) {
            console.error('=== REGISTER ERROR ===');
            console.error('Response data:', error.response?.data);

            notifications.show({
                title: 'Rekisteröinti epäonnistui',
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
        <Container size={500} my={40} pos="relative">
            <ActionIcon
                variant="default"
                onClick={toggleColorScheme}
                size="lg"
                style={{ position: 'absolute', top: 0, right: 0 }}
            >
                {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>

            <Title ta="center" mb="md">
                Luo tili
            </Title>
            <Text c="dimmed" size="sm" ta="center" mb="xl">
                Liity KilometriTrackeriin seurataksesi työmatkojasi
            </Text>

            <Paper withBorder shadow="md" p={30} radius="md">
                <form onSubmit={handleSubmit}>
                    <Stack>
                        <TextInput
                            label="Käyttäjätunnus"
                            placeholder="Valitse käyttäjätunnus"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />

                        <TextInput
                            label="Sähköposti"
                            placeholder="matti@esimerkki.fi"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />

                        <Group grow>
                            <TextInput
                                label="Etunimi"
                                placeholder="Matti"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            />

                            <TextInput
                                label="Sukunimi"
                                placeholder="Meikäläinen"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            />
                        </Group>

                        <TextInput
                            label="Yritys (Valinnainen)"
                            placeholder="Yrityksen nimi"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />

                        <TextInput
                            label="Puhelin (Valinnainen)"
                            placeholder="+358 40 123 4567"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />

                        <PasswordInput
                            label="Salasana"
                            placeholder="Vahva salasana"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />

                        <PasswordInput
                            label="Vahvista salasana"
                            placeholder="Toista salasana"
                            required
                            value={formData.password2}
                            onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
                        />

                        <Button type="submit" fullWidth loading={loading}>
                            Luo tili
                        </Button>
                    </Stack>
                </form>

                <Text ta="center" mt="md" size="sm">
                    Onko sinulla jo tili?{' '}
                    <Anchor component={Link} to="/login">
                        Kirjaudu sisään
                    </Anchor>
                </Text>
            </Paper>
        </Container>
    );
}