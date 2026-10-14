import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

export const NotFoundPage = () => {
  return (
    <div className="container page-center">
      <div className="card" style={{ maxWidth: '440px', width: '100%', textAlign: 'center', padding: '2.5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: 1 }} aria-hidden="true">🔍</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>404</h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '0.925rem' }}>
          The page you are looking for does not exist or has been relocated.
        </p>
        <Link to="/">
          <Button variant="primary" fullWidth>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
