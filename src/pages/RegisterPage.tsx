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
            });

            navigate('/dashboard');
        } catch (error: any) {
            console.error('=== REGISTER ERROR ===');
            console.error('Response data:', error.response?.data);

            // Get error message from different possible locations
            let errorMsg = 'Rekisteröinti epäonnistui';

            if (error.response?.data) {
                const data = error.response.data;

                // Check for specific field errors
                if (data.username) {
                    errorMsg = `Käyttäjätunnus: ${data.username[0]}`;
                } else if (data.email) {
                    errorMsg = `Sähköposti: ${data.email[0]}`;
                } else if (data.password) {
                    errorMsg = `Salasana: ${data.password[0]}`;
                } else if (data.non_field_errors) {
                    // Translate common Django errors to Finnish
                    const err = data.non_field_errors[0];
                    if (err.includes('too common')) {
                        errorMsg = 'Salasana on liian yleinen. Käytä vahvempaa salasanaa (esim. isot/pienet kirjaimet, numerot, erikoismerkit).';
                    } else if (err.includes('too short')) {
                        errorMsg = 'Salasana on liian lyhyt. Vähintään 8 merkkiä vaaditaan.';
                    } else if (err.includes('entirely numeric')) {
                        errorMsg = 'Salasana ei voi olla pelkkiä numeroita.';
                    } else if (err.includes('too similar')) {
                        errorMsg = 'Salasana on liian samanlainen käyttäjätietojen kanssa.';
                    } else {
                        errorMsg = err;
                    }
                } else if (data.detail) {
                    errorMsg = data.detail;
                }
            }

            notifications.show({
                title: 'Rekisteröinti epäonnistui',
                message: errorMsg,
                color: 'red',
                autoClose: 8000, // Show for 8 seconds (longer for password hint)
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