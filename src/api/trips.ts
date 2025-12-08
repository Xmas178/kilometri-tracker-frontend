// ============================================
// Trips API Functions
// ============================================
// Functions for managing trips:
// - list, create, update, delete trips
// - get monthly summary

import apiClient from './client';
import type {
    Trip,
    TripRequest,
    MonthlySummary,
    PaginatedResponse
} from '../types';

// ============================================
// GET ALL TRIPS
// ============================================
// Get list of user's trips (paginated)
// Optional filters: search, date range, ordering
export const getTrips = async (params?: {
    search?: string;           // Search in addresses or purpose
    date_after?: string;       // Filter trips after this date (ISO format)
    date_before?: string;      // Filter trips before this date
    ordering?: string;         // Sort by field (e.g., '-date' for newest first)
    page?: number;             // Page number (default: 1)
}): Promise<PaginatedResponse<Trip>> => {
    const response = await apiClient.get<PaginatedResponse<Trip>>('/trips/', { params });
    return response.data;
};

// ============================================
// GET SINGLE TRIP
// ============================================
// Get details of a specific trip by ID
export const getTrip = async (id: number): Promise<Trip> => {
    const response = await apiClient.get<Trip>(`/trips/${id}/`);
    return response.data;
};

// ============================================
// CREATE TRIP
// ============================================
// Create a new trip
export const createTrip = async (data: TripRequest): Promise<Trip> => {
    const response = await apiClient.post<Trip>('/trips/', data);
    return response.data;
};

// ============================================
// UPDATE TRIP
// ============================================
// Update existing trip (full update with PUT)
export const updateTrip = async (id: number, data: TripRequest): Promise<Trip> => {
    const response = await apiClient.put<Trip>(`/trips/${id}/`, data);
    return response.data;
};

// ============================================
// PARTIAL UPDATE TRIP
// ============================================
// Partially update trip (only changed fields with PATCH)
export const patchTrip = async (id: number, data: Partial<TripRequest>): Promise<Trip> => {
    const response = await apiClient.patch<Trip>(`/trips/${id}/`, data);
    return response.data;
};

// ============================================
// DELETE TRIP
// ============================================
// Delete a trip by ID
export const deleteTrip = async (id: number): Promise<void> => {
    await apiClient.delete(`/trips/${id}/`);
};

// ============================================
// GET MONTHLY SUMMARY
// ============================================
// Get summary of trips for a specific month
export const getMonthlySummary = async (year: number, month: number): Promise<MonthlySummary> => {
    const response = await apiClient.get<MonthlySummary>('/trips/monthly-summary/', {
        params: { year, month }
    });
    return response.data;
};

// ============================================
// CALCULATE DISTANCE (Google Maps)
// ============================================
// Calculate distance using Google Maps API (placeholder)
export const calculateDistance = async (
    startAddress: string,
    endAddress: string
): Promise<{ distance_km: number; route_data?: any }> => {
    const response = await apiClient.post('/trips/calculate-distance/', {
        start_address: startAddress,
        end_address: endAddress,
    });
    return response.data;
};