import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { parseApiError } from '../../utils/errorHandler';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import Select from '../../components/Select';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'DONOR'
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setFieldErrors({});

    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      setSuccessMsg('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const parsed = parseApiError(err);
      setGeneralError(parsed.message);
      setFieldErrors(parsed.fieldErrors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { value: 'DONOR', label: 'Blood Donor (Voluntary Lifesaver)' },
    { value: 'HOSPITAL', label: 'Hospital / Blood Bank Institution' }
  ];

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-icon" aria-hidden="true">🩸</div>
          <h2>Create Account</h2>
          <p>Join as a Voluntary Donor or Hospital Entity</p>
        </div>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {generalError && <div className="alert alert-error">{generalError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <FormInput
            id="reg-name"
            label="Full Name or Hospital Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Aarav Sharma or City Care Hospital"
            required
            error={fieldErrors.name}
            disabled={isSubmitting}
          />

          <FormInput
            id="reg-email"
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            required
            error={fieldErrors.email}
            disabled={isSubmitting}
          />

          <Select
            id="reg-role"
            label="Account Type (Role)"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={roleOptions}
            required
            placeholder=""
            disabled={isSubmitting}
          />

          <FormInput
            id="reg-password"
            label="Password (min 6 characters)"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Choose a password"
            required
            error={fieldErrors.password}
            disabled={isSubmitting}
          />

          <FormInput
            id="reg-confirmPassword"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            required
            error={fieldErrors.confirmPassword}
            disabled={isSubmitting}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
