// ============================================
// Authentication API Functions
// ============================================
// Functions for user authentication:
// - login, register, logout, profile

import apiClient, { setTokens, clearTokens, getRefreshToken } from './client';
import type {
    User,
    LoginRequest,
    LoginResponse,
    RegisterRequest
} from '../types';

// ============================================
// LOGIN
// ============================================
// Authenticate user and get JWT tokens

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login/', credentials);

    // Save tokens to localStorage
    setTokens(response.data.tokens.access, response.data.tokens.refresh);

    return response.data;
};

// ============================================
// REGISTER
// ============================================
// Create new user account
export const register = async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/register/', data);

    // Auto-login after registration (save tokens)
    setTokens(response.data.tokens.access, response.data.tokens.refresh);

    return response.data;
};

// ============================================
// LOGOUT
// ============================================
// Logout user and blacklist refresh token
export const logout = async (): Promise<void> => {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
        try {
            // Tell backend to blacklist the refresh token
            await apiClient.post('/auth/logout/', { refresh: refreshToken });
        } catch (error) {
            // Even if backend call fails, clear local tokens
            console.error('Logout error:', error);
        }
    }

    // Clear tokens from localStorage
    clearTokens();
};

// ============================================
// GET PROFILE
// ============================================
// Get current user profile data
export const getProfile = async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/profile/');
    return response.data;
};

// ============================================
// UPDATE PROFILE
// ============================================
// Update user profile information
export const updateProfile = async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<User>('/auth/profile/', data);
    return response.data;
};

// ============================================
// CHANGE PASSWORD
// ============================================
// Change user password
export const changePassword = async (
    oldPassword: string,
    newPassword: string
): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
    });
    return response.data;
};