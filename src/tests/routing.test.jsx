import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AuthContext from '../context/AuthContext';

describe('ProtectedRoute and Role-Based Routing', () => {
  it('redirects unauthenticated user to login screen', () => {
    render(
      <MemoryRouter initialEntries={['/hospital']}>
        <AuthContext.Provider
          value={{
            isAuthenticated: false,
            user: null,
            role: null,
            loading: false
          }}
        >
          <Routes>
            <Route
              path="/hospital"
              element={
                <ProtectedRoute allowedRoles={['HOSPITAL']}>
                  <div>Hospital Protected Area</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page Screen</div>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.queryByText(/Hospital Protected Area/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Login Page Screen/i)).toBeInTheDocument();
  });

  it('redirects authenticated user to their own role portal if accessing unauthorized role route', () => {
    render(
      <MemoryRouter initialEntries={['/hospital']}>
        <AuthContext.Provider
          value={{
            isAuthenticated: true,
            user: { id: 'donor-1', name: 'Test Donor', role: 'DONOR' },
            role: 'DONOR',
            loading: false
          }}
        >
          <Routes>
            <Route
              path="/hospital"
              element={
                <ProtectedRoute allowedRoles={['HOSPITAL']}>
                  <div>Hospital Dashboard Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/donor" element={<div>Donor Portal Home</div>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Donor should not see Hospital Dashboard, but be redirected to /donor
    expect(screen.queryByText(/Hospital Dashboard Content/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Donor Portal Home/i)).toBeInTheDocument();
  });

  it('renders protected content when user has the matching allowed role', () => {
    render(
      <MemoryRouter initialEntries={['/hospital']}>
        <AuthContext.Provider
          value={{
            isAuthenticated: true,
            user: { id: 'hosp-1', name: 'City Hospital', role: 'HOSPITAL' },
            role: 'HOSPITAL',
            loading: false
          }}
        >
          <Routes>
            <Route
              path="/hospital"
              element={
                <ProtectedRoute allowedRoles={['HOSPITAL']}>
                  <div>Hospital Dashboard Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Hospital Dashboard Content/i)).toBeInTheDocument();
  });
});
