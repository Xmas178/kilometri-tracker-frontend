// ============================================
// Reports Page Component
// ============================================
// Monthly report generation and management:
// - Select year and month
// - Generate PDF report button
// - List of all generated reports
// - Download PDF for each report

import { useState, useEffect } from 'react';
import {
    Container,
    Title,
    Button,
    Table,
    Stack,
    Text,
    Paper,
    Group,
    Select,
    LoadingOverlay
} from '@mantine/core';
import { IconFileTypePdf, IconDownload } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { getReports, generateReport, downloadPDF } from '../api/reports.ts';
import type { Report } from '../types/index.ts';
import { translateBackendError } from '../utils/translateError.ts';

export function ReportsPage() {
    // State for reports list
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    // State for report generation form
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth.toString());

    // Generate year options (current year and 2 years back)
    const yearOptions = Array.from({ length: 3 }, (_, i) => {
        const year = currentYear - i;
        return { value: year.toString(), label: year.toString() };
    });

    // Month options in Finnish
    const monthOptions = [
        { value: '1', label: 'Tammikuu' },
        { value: '2', label: 'Helmikuu' },
        { value: '3', label: 'Maaliskuu' },
        { value: '4', label: 'Huhtikuu' },
        { value: '5', label: 'Toukokuu' },
        { value: '6', label: 'Kesäkuu' },
        { value: '7', label: 'Heinäkuu' },
        { value: '8', label: 'Elokuu' },
        { value: '9', label: 'Syyskuu' },
        { value: '10', label: 'Lokakuu' },
        { value: '11', label: 'Marraskuu' },
        { value: '12', label: 'Joulukuu' },
    ];

    // Fetch reports on component mount
    useEffect(() => {
        fetchReports();
    }, []);

    // Fetch all reports from API
    const fetchReports = async () => {
        setLoading(true);
        try {
            const response = await getReports({ ordering: '-created_at' });
            setReports(response.results);
        } catch (error: any) {
            console.error('Fetch reports error:', error);
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

    // Handle PDF generation
    const handleGenerateReport = async () => {
        setGenerating(true);
        try {
            await generateReport({
                year: parseInt(selectedYear),
                month: parseInt(selectedMonth),
            });

            notifications.show({
                title: 'Onnistui!',
                message: 'PDF raportti luotu onnistuneesti',
                color: 'green',
                autoClose: 8000
            });

            // Refresh reports list
            fetchReports();
        } catch (error: any) {
            console.error('Generate report error:', error);

            let errorMsg = 'Raportin luominen epäonnistui';
            if (error.response?.data?.detail) {
                errorMsg = error.response.data.detail;
            }

            notifications.show({
                title: 'Virhe',
                message: translateBackendError(error),
                color: 'red',
                autoClose: 8000
            });
        } finally {
            setGenerating(false);
        }
    };

    // Handle PDF download
    const handleDownloadPDF = (pdfUrl: string) => {
        try {
            downloadPDF(pdfUrl);
            notifications.show({
                title: 'PDF avattu',
                message: 'PDF avattu uudessa välilehdessä',
                color: 'blue',
                autoClose: 8000
            });
        } catch (error) {
            notifications.show({
                title: 'Virhe',
                message: 'PDF:n avaaminen epäonnistui',
                color: 'red',
                autoClose: 8000
            });
        }
    };

    // Get month name in Finnish
    const getMonthName = (month: number): string => {
        const monthOption = monthOptions.find(m => m.value === month.toString());
        return monthOption?.label || month.toString();
    };

    return (
        <Container size="xl">
            <Stack>
                {/* Page title */}
                <Title order={2}>Raportit</Title>

                {/* Report generation form */}
                <Paper withBorder p="md">
                    <Stack>
                        <Text fw={500} size="lg">Luo uusi raportti</Text>

                        <Group>
                            <Select
                                label="Vuosi"
                                placeholder="Valitse vuosi"
                                data={yearOptions}
                                value={selectedYear}
                                onChange={(value) => setSelectedYear(value || currentYear.toString())}
                                style={{ width: 150 }}
                            />

                            <Select
                                label="Kuukausi"
                                placeholder="Valitse kuukausi"
                                data={monthOptions}
                                value={selectedMonth}
                                onChange={(value) => setSelectedMonth(value || currentMonth.toString())}
                                style={{ width: 200 }}
                            />

                            <Button
                                leftSection={<IconFileTypePdf size={18} />}
                                onClick={handleGenerateReport}
                                loading={generating}
                                mt="xl"
                            >
                                Luo PDF
                            </Button>
                        </Group>
                    </Stack>
                </Paper>

                {/* Reports list */}
                <Paper withBorder p="md" pos="relative">
                    <LoadingOverlay visible={loading} />

                    <Text fw={500} size="lg" mb="md">Luodut raportit</Text>

                    {reports.length === 0 && !loading ? (
                        <Text c="dimmed" ta="center" py="xl">
                            Ei raportteja. Luo ensimmäinen raportti yllä olevasta lomakkeesta!
                        </Text>
                    ) : (
                        <Table striped highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Kuukausi</Table.Th>
                                    <Table.Th>Vuosi</Table.Th>
                                    <Table.Th>Matkat (kpl)</Table.Th>
                                    <Table.Th>Yhteensä (km)</Table.Th>
                                    <Table.Th>Luotu</Table.Th>
                                    <Table.Th>Toiminnot</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {reports.map((report) => (
                                    <Table.Tr key={report.id}>
                                        <Table.Td>{getMonthName(report.month)}</Table.Td>
                                        <Table.Td>{report.year}</Table.Td>
                                        <Table.Td>{report.trip_count}</Table.Td>
                                        <Table.Td>{report.total_km} km</Table.Td>
                                        <Table.Td>{new Date(report.created_at).toLocaleDateString('fi-FI')}</Table.Td>
                                        <Table.Td>
                                            {report.pdf_file && (
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    leftSection={<IconDownload size={16} />}
                                                    onClick={() => handleDownloadPDF(report.pdf_file!)}
                                                >
                                                    Lataa PDF
                                                </Button>
                                            )}
                                        </Table.Td>
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