// ============================================
// App Component (Main Router)
// ============================================
// This file defines all routes (pages) in the app:
// - Public routes: /login, /register
// - Protected routes: /dashboard, /trips, /reports, /profile

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import { isAuthenticated } from './api/client';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { TripsPage } from './pages/TripsPage.tsx';
import { ReportsPage } from './pages/ReportsPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';




// ============================================
// PROTECTED ROUTE WRAPPER
// ============================================
// This component checks if user is authenticated
// If not logged in → redirect to /login
// If logged in → show the page with Layout (navbar)

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Check if user has JWT token in localStorage
  if (!isAuthenticated()) {
    // Not logged in → redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Logged in → show page with navbar
  return <Layout>{children}</Layout>;
}

// ============================================
// PUBLIC ROUTE WRAPPER
// ============================================
// This wrapper is for login/register pages
// If already logged in → redirect to dashboard
// If not logged in → show the page (no navbar)

interface PublicRouteProps {
  children: React.ReactNode;
}

function PublicRoute({ children }: PublicRouteProps) {
  // Check if user is already logged in
  if (isAuthenticated()) {
    // Already logged in → redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Not logged in → show login/register page
  return <>{children}</>;
}

// ============================================
// MAIN APP COMPONENT
// ============================================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* DEFAULT ROUTE: Redirect to dashboard or login */}
        <Route
          path="/"
          element={
            isAuthenticated()
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* PUBLIC ROUTES (no authentication needed) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* PROTECTED ROUTES (authentication required) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trips"
          element={
            <ProtectedRoute>
              <TripsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* 404 NOT FOUND */}
        <Route
          path="*"
          element={
            <div style={{ padding: '2rem' }}>
              <h1>404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;