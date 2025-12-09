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
import { IconPlus, IconTrash, IconEdit } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { getTrips, createTrip, deleteTrip, updateTrip } from '../api/trips.ts'; import type { Trip } from '../types/index.ts';
import { translateBackendError } from '../utils/translateError.ts';


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
    // State for editing (track which trip is being edited)
    const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

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
        } catch (error: any) {
            notifications.show({
                title: 'Virhe',
                message: translateBackendError(error),
                color: 'red',
                autoClose: 8000,
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
                autoClose: 8000,
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

            notifications.show({
                title: 'Virhe',
                message: translateBackendError(error),
                color: 'red',
                autoClose: 8000,
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
                autoClose: 8000,
            });
            fetchTrips();
        } catch (error: any) {
            notifications.show({
                title: 'Virhe',
                message: translateBackendError(error),
                color: 'red',
                autoClose: 8000,
            });
        }
    };

    // Handle trip edit
    const handleEditClick = (trip: Trip) => {
        setEditingTrip(trip);
        setFormData({
            date: trip.date,
            start_address: trip.start_address,
            end_address: trip.end_address,
            distance_km: trip.distance_km,
            purpose: trip.purpose || '',
        });
        setModalOpened(true);
    };

    // Handle trip update
    const handleUpdateTrip = async () => {
        if (!editingTrip) return;

        setSubmitting(true);
        try {
            await updateTrip(editingTrip.id, {
                date: formData.date,
                start_address: formData.start_address,
                end_address: formData.end_address,
                distance_km: formData.distance_km,
                purpose: formData.purpose,
                is_manual: true,
            });

            notifications.show({
                title: 'Päivitetty!',
                message: 'Matka päivitetty onnistuneesti',
                color: 'green',
                autoClose: 8000,
            });

            // Reset form and close modal
            setFormData({
                date: new Date().toISOString().split('T')[0],
                start_address: '',
                end_address: '',
                distance_km: 0,
                purpose: '',
            });
            setEditingTrip(null);
            setModalOpened(false);

            // Refresh trips list
            fetchTrips();
        } catch (error: any) {
            console.error('=== UPDATE TRIP ERROR ===');
            console.error('Error response:', error.response?.data);

            notifications.show({
                title: 'Virhe',
                message: translateBackendError(error),
                color: 'red',
                autoClose: 8000,
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Handle save (either add or update)
    const handleSaveTrip = () => {
        if (editingTrip) {
            handleUpdateTrip();
        } else {
            handleAddTrip();
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
                                            <Group gap="xs">
                                                <ActionIcon
                                                    color="blue"
                                                    variant="subtle"
                                                    onClick={() => handleEditClick(trip)}
                                                >
                                                    <IconEdit size={18} />
                                                </ActionIcon>
                                                <ActionIcon
                                                    color="red"
                                                    variant="subtle"
                                                    onClick={() => handleDelete(trip.id)}
                                                >
                                                    <IconTrash size={18} />
                                                </ActionIcon>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    )}
                </Paper>
            </Stack>

            {/* Add/Edit Trip Modal */}
            <Modal
                opened={modalOpened}
                onClose={() => {
                    setModalOpened(false);
                    setEditingTrip(null);
                    setFormData({
                        date: new Date().toISOString().split('T')[0],
                        start_address: '',
                        end_address: '',
                        distance_km: 0,
                        purpose: '',
                    });
                }}
                title={editingTrip ? 'Muokkaa matkaa' : 'Lisää uusi matka'}
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
                        <Button variant="subtle" onClick={() => {
                            setModalOpened(false);
                            setEditingTrip(null);
                        }}>
                            Peruuta
                        </Button>
                        <Button onClick={handleSaveTrip} loading={submitting}>
                            {editingTrip ? 'Tallenna muutokset' : 'Lisää matka'}
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Container>
    );
}