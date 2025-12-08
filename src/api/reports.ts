// ============================================
// Reports API Functions
// ============================================
// Functions for managing monthly reports:
// - list reports, generate PDF, download PDF

import apiClient from './client';
import type {
    Report,
    GenerateReportRequest,
    GenerateReportResponse,
    PaginatedResponse
} from '../types';

// ============================================
// GET ALL REPORTS
// ============================================
// Get list of generated reports (paginated)
export const getReports = async (params?: {
    year?: number;             // Filter by year
    month?: number;            // Filter by month
    ordering?: string;         // Sort by field (e.g., '-created_at')
    page?: number;             // Page number
}): Promise<PaginatedResponse<Report>> => {
    const response = await apiClient.get<PaginatedResponse<Report>>('/reports/', { params });
    return response.data;
};

// ============================================
// GET SINGLE REPORT
// ============================================
// Get details of a specific report by ID
export const getReport = async (id: number): Promise<Report> => {
    const response = await apiClient.get<Report>(`/reports/${id}/`);
    return response.data;
};

// ============================================
// GENERATE REPORT (WITH PDF)
// ============================================
// Generate monthly report and PDF file
// This is the MOST IMPORTANT function for your app!
export const generateReport = async (
    data: GenerateReportRequest
): Promise<GenerateReportResponse> => {
    const response = await apiClient.post<GenerateReportResponse>('/reports/generate/', data);
    return response.data;
};

// ============================================
// DOWNLOAD PDF
// ============================================
// Helper function to download PDF file
// Opens PDF in new browser tab or triggers download
export const downloadPDF = (pdfUrl: string): void => {
    // Remove API base URL if it's included (we want relative path)
    const cleanUrl = pdfUrl.replace('http://127.0.0.1:8000', '');

    // Open PDF in new tab
    window.open(`http://127.0.0.1:8000${cleanUrl}`, '_blank');
};

// Alternative: Force download instead of opening
export const forceDownloadPDF = async (pdfUrl: string, filename: string): Promise<void> => {
    try {
        // Fetch the PDF file
        const response = await fetch(pdfUrl);
        const blob = await response.blob();

        // Create temporary download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || 'report.pdf';

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('PDF download error:', error);
        throw new Error('Failed to download PDF');
    }
};