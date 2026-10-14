import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * 
 * IMPORTANT ARCHITECTURAL & SECURITY NOTE:
 * Client-side route protection (like this component) is solely for USER EXPERIENCE (UX)
 * and page navigation flow. It prevents legitimate users from stumbling into screens
 * meant for other roles.
 * 
 * It DOES NOT provide real security! A malicious user can inspect client code, alter
 * local storage, or simulate requests directly with Postman / curl.
 * REAL authorization MUST ALWAYS be enforced on the backend (Java Spring Boot)
 * by verifying the JWT signature, claims, and authorities on every secured endpoint.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child component to render if authorized
 * @param {Array<string>} [props.allowedRoles] - Optional list of permitted roles (e.g., ['DONOR', 'HOSPITAL'])
 */
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Not logged in -> redirect to login with original location state for redirect-after-login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in, but does not match required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to their appropriate home based on role
    if (role === 'DONOR') return <Navigate to="/donor" replace />;
    if (role === 'HOSPITAL') return <Navigate to="/hospital" replace />;
    if (role === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
