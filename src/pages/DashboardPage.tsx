// ============================================
// Dashboard Page Component
// ============================================
// Overview page with:
// - Summary statistics cards
// - Recent trips table
// - Monthly statistics

import { useState, useEffect } from 'react';
import {
    Container,
    Title,
    SimpleGrid,
    Paper,
    Text,
    Stack,
    Table,
    LoadingOverlay,
    Group,
    ThemeIcon
} from '@mantine/core';
import { IconCar, IconCalendar, IconRoad, IconReportMoney } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { getTrips, getMonthlySummary } from '../api/trips.ts';
import type { Trip, MonthlySummary } from '../types/index.ts';
import { translateBackendError } from '../utils/translateError.ts';

export function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [allTrips, setAllTrips] = useState<Trip[]>([]);
    const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
    const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null);

    // Calculate total statistics
    const totalKm = allTrips.reduce((sum, trip) => sum + Number(trip.distance_km), 0) || 0;
    const totalTrips = allTrips.length || 0;

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch all trips
            const tripsResponse = await getTrips({ ordering: '-date' });
            setAllTrips(tripsResponse.results);

            // Get 5 most recent trips
            setRecentTrips(tripsResponse.results.slice(0, 5));

            // Fetch current month summary
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;

            try {
                const summaryResponse = await getMonthlySummary(currentYear, currentMonth);
                setMonthlySummary(summaryResponse);
            } catch (error) {
                // Monthly summary might not exist yet, that's ok
                console.log('No monthly summary yet');
            }

        } catch (error: any) {
            console.error('Fetch dashboard data error:', error);
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

    // Get current month name in Finnish
    const getCurrentMonthName = (): string => {
        const months = [
            'Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu',
            'Toukokuu', 'Kesäkuu', 'Heinäkuu', 'Elokuu',
            'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu'
        ];
        return months[new Date().getMonth()];
    };

    return (
        <Container size="xl">
            <Stack>
                <Title order={2}>Etusivu</Title>

                {/* Summary cards */}
                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
                    {/* Total kilometers card */}
                    <Paper withBorder p="md" radius="md">
                        <Group justify="space-between">
                            <div>
                                <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                                    Yhteensä kilometrejä
                                </Text>
                                <Text fw={700} size="xl">
                                    {Number(totalKm).toFixed(1)} km
                                </Text>
                            </div>
                            <ThemeIcon color="blue" variant="light" size={38} radius="md">
                                <IconRoad size={20} />
                            </ThemeIcon>
                        </Group>
                    </Paper>

                    {/* Total trips card */}
                    <Paper withBorder p="md" radius="md">
                        <Group justify="space-between">
                            <div>
                                <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                                    Yhteensä matkoja
                                </Text>
                                <Text fw={700} size="xl">
                                    {totalTrips} kpl
                                </Text>
                            </div>
                            <ThemeIcon color="teal" variant="light" size={38} radius="md">
                                <IconCar size={20} />
                            </ThemeIcon>
                        </Group>
                    </Paper>

                    {/* Monthly kilometers card */}
                    <Paper withBorder p="md" radius="md">
                        <Group justify="space-between">
                            <div>
                                <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                                    {getCurrentMonthName()}
                                </Text>
                                <Text fw={700} size="xl">
                                    {monthlySummary ? monthlySummary.total_km.toFixed(1) : '0'} km
                                </Text>
                            </div>
                            <ThemeIcon color="grape" variant="light" size={38} radius="md">
                                <IconCalendar size={20} />
                            </ThemeIcon>
                        </Group>
                    </Paper>

                    {/* Monthly trips card */}
                    <Paper withBorder p="md" radius="md">
                        <Group justify="space-between">
                            <div>
                                <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                                    Kuukauden matkat
                                </Text>
                                <Text fw={700} size="xl">
                                    {monthlySummary ? monthlySummary.trip_count : 0} kpl
                                </Text>
                            </div>
                            <ThemeIcon color="orange" variant="light" size={38} radius="md">
                                <IconReportMoney size={20} />
                            </ThemeIcon>
                        </Group>
                    </Paper>
                </SimpleGrid>

                {/* Recent trips table */}
                <Paper withBorder p="md" pos="relative">
                    <LoadingOverlay visible={loading} />

                    <Text fw={500} size="lg" mb="md">Viimeisimmät matkat</Text>

                    {recentTrips.length === 0 && !loading ? (
                        <Text c="dimmed" ta="center" py="xl">
                            Ei matkoja vielä. Lisää ensimmäinen matka!
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
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {recentTrips.map((trip) => (
                                    <Table.Tr key={trip.id}>
                                        <Table.Td>{new Date(trip.date).toLocaleDateString('fi-FI')}</Table.Td>
                                        <Table.Td>{trip.start_address}</Table.Td>
                                        <Table.Td>{trip.end_address}</Table.Td>
                                        <Table.Td>{trip.distance_km} km</Table.Td>
                                        <Table.Td>{trip.purpose || '-'}</Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    )}
                </Paper>
            </Stack>
        </Container>
    );
}