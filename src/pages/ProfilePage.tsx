// ============================================
// Profile Page Component
// ============================================
// User profile management:
// - View user information
// - Edit profile (name, company, phone)
// - Change password

import { useState, useEffect } from 'react';
import {
    Container,
    Title,
    Paper,
    TextInput,
    Button,
    Stack,
    Text,
    PasswordInput,
    Group
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { getProfile, updateProfile, changePassword } from '../api/auth.ts';
import type { User } from '../types/index.ts';
import { translateBackendError } from '../utils/translateError.ts';

export function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    // Profile data
    const [profileData, setProfileData] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        company: '',
        phone: '',
    });

    // Password change data
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });

    // Fetch profile on mount
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const profile = await getProfile();
            setProfileData(profile);

            // Populate form with current data
            setFormData({
                first_name: profile.first_name || '',
                last_name: profile.last_name || '',
                company: profile.company || '',
                phone: profile.phone || '',
            });
        } catch (error: any) {
            console.error('Fetch profile error:', error);
            notifications.show({
                title: 'Virhe',
                message: translateBackendError(error),
                color: 'red',
                autoClose: 8000
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle profile update
    const handleUpdateProfile = async () => {
        setSaving(true);
        try {
            await updateProfile(formData);

            notifications.show({
                title: 'Tallennettu!',
                message: 'Profiili päivitetty onnistuneesti',
                color: 'green',
                autoClose: 8000
            });

            // Refresh profile data
            fetchProfile();
        } catch (error: any) {
            console.error('Update profile error:', error);
            notifications.show({
                title: 'Virhe',
                message: translateBackendError(error),
                color: 'red',
                autoClose: 8000
            });
        } finally {
            setSaving(false);
        }
    };

    // Handle password change
    const handleChangePassword = async () => {
        // Validate passwords match
        if (passwordData.new_password !== passwordData.confirm_password) {
            notifications.show({
                title: 'Virhe',
                message: 'Uudet salasanat eivät täsmää',
                color: 'red',
                autoClose: 8000
            });
            return;
        }

        // Validate password not empty
        if (!passwordData.new_password || passwordData.new_password.length < 8) {
            notifications.show({
                title: 'Virhe',
                message: 'Salasanan pitää olla vähintään 8 merkkiä',
                color: 'red',
                autoClose: 8000
            });
            return;
        }

        setChangingPassword(true);
        try {
            await changePassword(passwordData.old_password, passwordData.new_password);

            notifications.show({
                title: 'Vaihdettu!',
                message: 'Salasana vaihdettu onnistuneesti',
                color: 'green',
                autoClose: 8000
            });

            // Clear password fields
            setPasswordData({
                old_password: '',
                new_password: '',
                confirm_password: '',
            });
        } catch (error: any) {
            console.error('Change password error:', error);


            notifications.show({
                title: 'Virhe',
                message: translateBackendError(error),
                color: 'red',
                autoClose: 8000
            });
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <Container size="md">
                <Text ta="center" py="xl">Ladataan...</Text>
            </Container>
        );
    }

    return (
        <Container size="md">
            <Stack>
                <Title order={2}>Profiili</Title>

                {/* Basic info (read-only) */}
                <Paper withBorder p="md">
                    <Stack>
                        <Text fw={500} size="lg">Perustiedot</Text>

                        <TextInput
                            label="Käyttäjätunnus"
                            value={profileData?.username || ''}
                            disabled
                        />

                        <TextInput
                            label="Sähköposti"
                            value={profileData?.email || ''}
                            disabled
                        />
                    </Stack>
                </Paper>

                {/* Editable profile info */}
                <Paper withBorder p="md">
                    <Stack>
                        <Text fw={500} size="lg">Muokattavat tiedot</Text>

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
                            label="Yritys"
                            placeholder="Yrityksen nimi"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />

                        <TextInput
                            label="Puhelin"
                            placeholder="+358 40 123 4567"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />

                        <Button onClick={handleUpdateProfile} loading={saving}>
                            Tallenna tiedot
                        </Button>
                    </Stack>
                </Paper>

                {/* Password change */}
                <Paper withBorder p="md">
                    <Stack>
                        <Text fw={500} size="lg">Vaihda salasana</Text>

                        <PasswordInput
                            label="Vanha salasana"
                            placeholder="Nykyinen salasana"
                            value={passwordData.old_password}
                            onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                        />

                        <PasswordInput
                            label="Uusi salasana"
                            placeholder="Uusi salasana (vähintään 8 merkkiä)"
                            value={passwordData.new_password}
                            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                        />

                        <PasswordInput
                            label="Vahvista uusi salasana"
                            placeholder="Toista uusi salasana"
                            value={passwordData.confirm_password}
                            onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                        />

                        <Button onClick={handleChangePassword} loading={changingPassword} color="orange">
                            Vaihda salasana
                        </Button>
                    </Stack>
                </Paper>
            </Stack>
        </Container>
    );
}