import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import AuthContext from '../context/AuthContext';

describe('LoginPage and Auth Flows', () => {
  it('handles login failure when credentials are invalid', async () => {
    const mockLogin = vi.fn().mockRejectedValue({
      response: {
        status: 401,
        data: {
          status: 401,
          message: 'Invalid email or password.'
        }
      }
    });

    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            login: mockLogin,
            user: null,
            isAuthenticated: false,
            role: null
          }}
        >
          <LoginPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'badpass' } });
    fireEvent.click(submitBtn);

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'wrong@test.com',
      password: 'badpass'
    });

    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('handles login success and submits valid credentials', async () => {
    const mockLogin = vi.fn().mockResolvedValue({
      id: 'user-donor-1',
      name: 'Aarav Sharma',
      role: 'DONOR'
    });

    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            login: mockLogin,
            user: null,
            isAuthenticated: false,
            role: null
          }}
        >
          <LoginPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'donor@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'donor@test.com',
        password: 'password123'
      });
    });
  });
});
