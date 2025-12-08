// ============================================
// Trips Page Component
// ============================================
// Main trip management page with:
// - List of all trips in a table
// - Add new trip button (opens modal)
// - Delete trip button for each row
// - Automatic data refresh after changes

import { useState, useEffect } from 'react';
import {
    Container,
    Title,
    Button,
    Table,
    ActionIcon,
    Stack,
    Text,
    Paper,
    Group,
    Modal,
    TextInput,
    NumberInput,
    Textarea,
    LoadingOverlay
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { getTrips, createTrip, deleteTrip } from '../api/trips.ts';
import type { Trip } from '../types/index.ts';

export function TripsPage() {
    // State for trips list
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    // State for "Add Trip" modal
    const [modalOpened, setModalOpened] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form data for new trip
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        start_address: '',
        end_address: '',
        distance_km: 0,
        purpose: '',
    });

    // Fetch trips on component mount
    useEffect(() => {
        fetchTrips();
    }, []);

    // Fetch trips from API
    const fetchTrips = async () => {
        setLoading(true);
        try {
            const response = await getTrips({ ordering: '-date' });
            setTrips(response.results);
        } catch (error) {
            notifications.show({
                title: 'Virhe',
                message: 'Matkojen hakeminen epäonnistui',
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle new trip submission
    const handleAddTrip = async () => {
        setSubmitting(true);
        try {
            await createTrip({
                date: formData.date,
                start_address: formData.start_address,
                end_address: formData.end_address,
                distance_km: formData.distance_km,
                purpose: formData.purpose,
                is_manual: true,
            });

            notifications.show({
                title: 'Onnistui!',
                message: 'Matka lisätty',
                color: 'green',
            });

            // Reset form and close modal
            setFormData({
                date: new Date().toISOString().split('T')[0],
                start_address: '',
                end_address: '',
                distance_km: 0,
                purpose: '',
            });
            setModalOpened(false);

            // Refresh trips list
            fetchTrips();
        } catch (error: any) {
            console.error('=== ADD TRIP ERROR ===');
            console.error('Error response:', error.response?.data);
            console.error('Error response:', error.response?.data);
            console.error('Start address error:', error.response?.data?.start_address?.[0]);

            notifications.show({
                title: 'Virhe',
                message: 'Matkan lisääminen epäonnistui',
                color: 'red',
            });

        } finally {
            setSubmitting(false);
        }
    };

    // Handle trip deletion
    const handleDelete = async (id: number) => {
        if (!confirm('Haluatko varmasti poistaa tämän matkan?')) {
            return;
        }

        try {
            await deleteTrip(id);
            notifications.show({
                title: 'Poistettu',
                message: 'Matka poistettu',
                color: 'blue',
            });
            fetchTrips();
        } catch (error) {
            notifications.show({
                title: 'Virhe',
                message: 'Matkan poistaminen epäonnistui',
                color: 'red',
            });
        }
    };

    return (
        <Container size="xl">
            <Stack>
                {/* Page header */}
                <Group justify="space-between">
                    <Title order={2}>Matkat</Title>
                    <Button
                        leftSection={<IconPlus size={18} />}
                        onClick={() => setModalOpened(true)}
                    >
                        Lisää matka
                    </Button>
                </Group>

                {/* Trips table */}
                <Paper withBorder p="md" pos="relative">
                    <LoadingOverlay visible={loading} />

                    {trips.length === 0 && !loading ? (
                        <Text c="dimmed" ta="center" py="xl">
                            Ei matkoja. Lisää ensimmäinen matka yllä olevasta napista!
                        </Text>
                    ) : (
                        <Table striped highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Päivämäärä</Table.Th>
                                    <Table.Th>Lähtöpaikka</Table.Th>
                                    <Table.Th>Määränpää</Table.Th>
                                    <Table.Th>Matka (km)</Table.Th>
                                    <Table.Th>Tarkoitus</Table.Th>
                                    <Table.Th>Toiminnot</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {trips.map((trip) => (
                                    <Table.Tr key={trip.id}>
                                        <Table.Td>{new Date(trip.date).toLocaleDateString('fi-FI')}</Table.Td>
                                        <Table.Td>{trip.start_address}</Table.Td>
                                        <Table.Td>{trip.end_address}</Table.Td>
                                        <Table.Td>{trip.distance_km} km</Table.Td>
                                        <Table.Td>{trip.purpose}</Table.Td>
                                        <Table.Td>
                                            <ActionIcon
                                                color="red"
                                                variant="subtle"
                                                onClick={() => handleDelete(trip.id)}
                                            >
                                                <IconTrash size={18} />
                                            </ActionIcon>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    )}
                </Paper>
            </Stack>

            {/* Add Trip Modal */}
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Lisää uusi matka"
                size="lg"
            >
                <Stack>
                    <DatePickerInput
                        label="Päivämäärä"
                        placeholder="Valitse päivämäärä"
                        valueFormat="DD.MM.YYYY"
                        value={new Date(formData.date)}
                        onChange={(date: any) => {
                            if (date) {
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const day = String(date.getDate()).padStart(2, '0');
                                const isoDate = `${year}-${month}-${day}`;
                                setFormData({ ...formData, date: isoDate });
                            }
                        }}
                        required
                    />

                    <TextInput
                        label="Lähtöpaikka"
                        placeholder="esim. Helsinki"
                        value={formData.start_address}
                        onChange={(e) => setFormData({ ...formData, start_address: e.target.value })}
                        required
                    />

                    <TextInput
                        label="Määränpää"
                        placeholder="esim. Tampere"
                        value={formData.end_address}
                        onChange={(e) => setFormData({ ...formData, end_address: e.target.value })}
                        required
                    />

                    <NumberInput
                        label="Matka (km)"
                        placeholder="esim. 180"
                        min={0}
                        step={0.1}
                        value={formData.distance_km}
                        onChange={(value) => setFormData({ ...formData, distance_km: Number(value) || 0 })}
                        required
                    />

                    <Textarea
                        label="Tarkoitus (Valinnainen)"
                        placeholder="esim. Asiakastapaamiset"
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        rows={3}
                    />

                    <Group justify="flex-end">
                        <Button variant="subtle" onClick={() => setModalOpened(false)}>
                            Peruuta
                        </Button>
                        <Button onClick={handleAddTrip} loading={submitting}>
                            Lisää matka
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Container>
    );
}