// ============================================
// TypeScript Types for KilometriTracker API
// ============================================
// These interfaces define the shape of data
// received from Django backend API

// --------------------------------------------
// USER TYPES
// --------------------------------------------

// User data from backend (login/register/profile)
export interface User {
    id: number;                    // User ID from database
    username: string;              // Unique username
    email: string;                 // User email
    first_name: string;            // First name (optional)
    last_name: string;             // Last name (optional)
    company?: string;              // Company name (optional)
    phone?: string;                // Phone number (optional)
    created_at: string;            // ISO date string (e.g. "2025-01-01T12:00:00Z")
}

// Login request body
export interface LoginRequest {
    username: string;              // Username or email
    password: string;              // User password
}

// Login response with JWT tokens
export interface LoginResponse {
    user: User;
    tokens: {
        access: string;
        refresh: string;
    };
    message: string;
}

// Register request body
export interface RegisterRequest {
    username: string;              // Unique username
    email: string;                 // Valid email address
    password: string;              // Strong password
    password2: string;             // Password confirmation (must match)
    first_name?: string;           // Optional first name
    last_name?: string;            // Optional last name
    company?: string;              // Optional company
    phone?: string;                // Optional phone
}

// --------------------------------------------
// TRIP TYPES
// --------------------------------------------

// Trip data from backend
export interface Trip {
    id: number;                    // Trip ID
    user: number;                  // User ID (foreign key)
    date: string;                  // Trip date (ISO format)
    start_address: string;         // Starting location
    end_address: string;           // Destination
    distance_km: number;           // Distance in kilometers
    purpose: string;               // Trip purpose/reason
    is_manual: boolean;            // Manual entry or Google Maps calculated
    route_data?: any;              // Google Maps route data (JSON)
    created_at: string;            // Created timestamp
    updated_at: string;            // Last updated timestamp
}

// Create/Update trip request
export interface TripRequest {
    date: string;                  // ISO date string
    start_address: string;         // Starting point
    end_address: string;           // Destination
    distance_km: number;           // Distance in km
    purpose: string;               // Why traveling
    is_manual?: boolean;           // Default: true
}

// Monthly summary response
export interface MonthlySummary {
    year: number;                  // Year (e.g. 2025)
    month: number;                 // Month (1-12)
    total_km: number;              // Total kilometers
    trip_count: number;            // Number of trips
    trips: Trip[];                 // List of trips for that month
}

// --------------------------------------------
// REPORT TYPES
// --------------------------------------------

// Monthly report from backend
export interface Report {
    id: number;                    // Report ID
    user: number;                  // User ID
    year: number;                  // Report year
    month: number;                 // Report month
    total_km: number;              // Total kilometers
    trip_count: number;            // Number of trips
    pdf_file?: string;             // PDF file URL (if generated)
    excel_file?: string;           // Excel file URL (if generated)
    sent_at?: string;              // Email sent timestamp (if sent)
    created_at: string;            // Report creation timestamp
}

// Generate report request
export interface GenerateReportRequest {
    year: number;                  // Which year
    month: number;                 // Which month (1-12)
}

// Generate report response
export interface GenerateReportResponse {
    report: Report;                // Generated report data
    pdf_url?: string;              // Direct PDF download URL
    message: string;               // Success message
}

// --------------------------------------------
// API RESPONSE TYPES
// --------------------------------------------

// Generic API error response
export interface ApiError {
    detail?: string;               // Error message
    [key: string]: any;            // Other error fields from backend
}

// Paginated list response (for trips, reports lists)
export interface PaginatedResponse<T> {
    count: number;                 // Total number of items
    next: string | null;           // Next page URL
    previous: string | null;       // Previous page URL
    results: T[];                  // Array of items
}