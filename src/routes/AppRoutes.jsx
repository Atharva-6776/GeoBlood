import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Public Pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/common/UnauthorizedPage';

// Donor Pages
import DonorDashboardPage from '../pages/donor/DonorDashboardPage';
import DonorHistoryPage from '../pages/donor/DonorHistoryPage';

// Hospital Pages
import HospitalDashboardPage from '../pages/hospital/HospitalDashboardPage';
import CreateRequestPage from '../pages/hospital/CreateRequestPage';
import RequestDetailPage from '../pages/hospital/RequestDetailPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';

/**
 * Main Application Routing Configuration
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Donor Protected Routes */}
      <Route
        path="/donor"
        element={
          <ProtectedRoute allowedRoles={['DONOR']}>
            <DonorDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/history"
        element={
          <ProtectedRoute allowedRoles={['DONOR']}>
            <DonorHistoryPage />
          </ProtectedRoute>
        }
      />

      {/* Hospital Protected Routes */}
      <Route
        path="/hospital"
        element={
          <ProtectedRoute allowedRoles={['HOSPITAL']}>
            <HospitalDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hospital/requests/new"
        element={
          <ProtectedRoute allowedRoles={['HOSPITAL']}>
            <CreateRequestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hospital/requests/:id"
        element={
          <ProtectedRoute allowedRoles={['HOSPITAL']}>
            <RequestDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
