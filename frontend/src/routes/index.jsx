import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// Import Pages
import LoginPage from '../pages/LoginPage';
import DashboardHome from '../pages/DashboardHome';
import UserManagement from '../pages/UserManagement';
import UnauthorizedPage from '../pages/UnauthorizedPage';

/**
 * Konfigurasi Router Aplikasi menggunakan createBrowserRouter (React Router v6)
 */
export const router = createBrowserRouter([
  // Route Utama: Redirect ke Dashboard
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  
  // Route Autentikasi (Bebas Akses)
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },

  // Route Dashboard (Proteksi Autentikasi General)
  {
    path: '/dashboard',
    element: <ProtectedRoute />, // Memastikan user sudah login
    children: [
      {
        element: <DashboardLayout />, // Menempelkan sidebar & navbar
        children: [
          // Sub-route Dashboard Home
          {
            index: true,
            element: <DashboardHome />,
          },
          // Sub-route CRUD Pengguna (Proteksi Khusus ADMIN / SUPERADMIN)
          {
            path: 'users',
            element: (
              <ProtectedRoute allowedRoles={['SUPERADMIN', 'ADMIN']}>
                <UserManagement />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },

  // Halaman Akses Ditolak (403)
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },

  // Fallback Route: Redirect semua URL tidak dikenal ke Dashboard
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
