import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tokenStorage } from '../utils/tokenStorage';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => tokenStorage.getUser());
  const [token, setToken] = useState(() => tokenStorage.getToken());
  const loading = false;

  // Sync state if session expires or is cleared from another event/interceptor
  const handleSessionExpired = useCallback(() => {
    tokenStorage.clearAuth();
    setUser(null);
    setToken(null);
  }, []);

  useEffect(() => {
    // Listen for 401 session-expired event dispatched by Axios interceptor
    window.addEventListener('auth:session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, [handleSessionExpired]);

  // Log in
  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    const { token: receivedToken, user: receivedUser } = data;

    tokenStorage.setToken(receivedToken);
    tokenStorage.setUser(receivedUser);

    setToken(receivedToken);
    setUser(receivedUser);

    return receivedUser;
  };

  // Register
  const register = async (userData) => {
    const res = await authApi.register(userData);
    return res;
  };

  // Log out
  const logout = () => {
    tokenStorage.clearAuth();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    role: user?.role || null,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for convenient consumption in components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
