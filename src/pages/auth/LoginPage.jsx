import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { parseApiError } from '../../utils/errorHandler';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if redirected due to expired session
  const queryParams = new URLSearchParams(location.search);
  const sessionExpired = queryParams.get('sessionExpired') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const loggedUser = await login({ email, password });
      // Role-based redirect
      if (loggedUser.role === 'DONOR') navigate('/donor');
      else if (loggedUser.role === 'HOSPITAL') navigate('/hospital');
      else if (loggedUser.role === 'ADMIN') navigate('/admin');
      else navigate('/');
    } catch (err) {
      const parsed = parseApiError(err);
      setErrorMsg(parsed.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick helper to fill demo credentials
  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-icon" aria-hidden="true">🩸</div>
          <h2>Sign In to GeoBlood Link</h2>
          <p>Emergency Blood Donor Discovery Platform</p>
        </div>

        {sessionExpired && (
          <div className="alert alert-warning" role="alert">
            Your session has expired. Please log in again.
          </div>
        )}

        {errorMsg && (
          <div className="alert alert-error" role="alert">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <FormInput
            id="login-email"
            label="Email Address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. donor@test.com"
            required
            disabled={isSubmitting}
          />

          <FormInput
            id="login-password"
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={isSubmitting}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="demo-credentials-card">
          <h4>Demo Logins (Click to autofill):</h4>
          <div className="demo-buttons-col">
            <button
              type="button"
              onClick={() => fillDemo('donor@test.com')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'flex-start' }}
            >
              🩸 <strong>Donor</strong> (donor@test.com)
            </button>
            <button
              type="button"
              onClick={() => fillDemo('hospital@test.com')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'flex-start' }}
            >
              🏥 <strong>Hospital</strong> (hospital@test.com)
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin@test.com')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'flex-start' }}
            >
              🛡️ <strong>Admin</strong> (admin@test.com)
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
            Password for all demo accounts: <code>password123</code>
          </p>
        </div>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
