import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';

export const UnauthorizedPage = () => {
  const { role } = useAuth();

  let destination = '/';
  if (role === 'DONOR') destination = '/donor';
  else if (role === 'HOSPITAL') destination = '/hospital';
  else if (role === 'ADMIN') destination = '/admin';

  return (
    <div className="container page-center">
      <div className="card" style={{ maxWidth: '440px', width: '100%', textAlign: 'center', padding: '2.5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: 1 }} aria-hidden="true">🚫</div>
        <h1 style={{ color: 'var(--danger)', fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>403</h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Access Restricted</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '0.925rem' }}>
          You do not have the credentials or role required to access this portal.
        </p>

        <Link to={destination}>
          <Button variant="primary" fullWidth>
            Return to Authorized Portal
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
