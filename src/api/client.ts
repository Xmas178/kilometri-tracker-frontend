// ============================================
// Axios API Client with JWT Authentication
// ============================================
// This file creates an axios instance that:
// 1. Automatically adds JWT token to requests
// 2. Handles token refresh when expired
// 3. Redirects to login on authentication failure

import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

// Backend API base URL
// Change this if backend runs on different port
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,           // All requests prepend this URL
    headers: {
        'Content-Type': 'application/json',  // Send JSON data
    },
    timeout: 10000,                  // 10 second timeout
});

// ============================================
// TOKEN MANAGEMENT FUNCTIONS
// ============================================

// Get access token from localStorage
export const getAccessToken = (): string | null => {
    return localStorage.getItem('access_token');
};

// Get refresh token from localStorage
export const getRefreshToken = (): string | null => {
    return localStorage.getItem('refresh_token');
};

// Save tokens to localStorage (after login)
export const setTokens = (access: string, refresh: string): void => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
};

// Remove tokens from localStorage (logout)
export const clearTokens = (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

// Check if user is authenticated (has valid tokens)
export const isAuthenticated = (): boolean => {
    return getAccessToken() !== null;
};

// ============================================
// REQUEST INTERCEPTOR
// ============================================
// This runs BEFORE every API request
// Adds JWT token to Authorization header

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();

        // If token exists, add it to Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
// This runs AFTER every API response
// Handles token refresh if access token expired

apiClient.interceptors.response.use(
    (response: any) => {
        return response;
    },

    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Don't refresh token for login/register endpoints
        const url = originalRequest.url || '';
        if (url.includes('/auth/login/') || url.includes('/auth/register/')) {
            return Promise.reject(error);
        }

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = getRefreshToken();

            if (refreshToken) {
                try {
                    const response = await axios.post(
                        `${API_BASE_URL}/auth/token/refresh/`,
                        { refresh: refreshToken }
                    );

                    const newAccessToken = response.data.access;
                    localStorage.setItem('access_token', newAccessToken);

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    }

                    return apiClient(originalRequest);
                } catch (refreshError) {
                    clearTokens();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                clearTokens();
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

// Export the configured axios instance
export default apiClient;