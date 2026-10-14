import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const { isAuthenticated, role } = useAuth();

  // If already logged in, redirect to their role-specific dashboard
  if (isAuthenticated) {
    if (role === 'DONOR') return <Navigate to="/donor" replace />;
    if (role === 'HOSPITAL') return <Navigate to="/hospital" replace />;
    if (role === 'ADMIN') return <Navigate to="/admin" replace />;
  }

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero-section" aria-labelledby="hero-title">
        <span className="hero-pill">Emergency Coordination Platform</span>
        <h1 id="hero-title" className="hero-title">
          Intelligent Geo-Localized Blood Donor Discovery
        </h1>
        <p className="hero-subtitle">
          Connecting critical hospital emergency blood demands with nearby eligible voluntary donors
          through intelligent proximity matching.
        </p>

        <div className="hero-notice-banner" role="note">
          <span aria-hidden="true">⚠️</span>
          <span>
            <strong>Notice:</strong> This application supports coordination only; it does not
            replace hospital blood-bank procedures or medical judgment.
          </span>
        </div>

        <div className="hero-actions">
          <Link to="/login" className="btn btn-primary btn-large">
            Sign In
          </Link>
          <Link to="/register" className="btn btn-outline btn-large">
            Register as Donor or Hospital
          </Link>
        </div>
      </section>

      {/* 3-Column Features Section */}
      <section className="features-section" aria-labelledby="features-title">
        <div className="section-heading-center">
          <h2 id="features-title">Designed for Fast, Reliable Emergency Response</h2>
          <p>Coordination tools tailored for healthcare institutions and voluntary lifesavers.</p>
        </div>

        <div className="feature-cards-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <h3>For Hospitals</h3>
            <p>
              Broadcast emergency blood requirements in seconds. Get ranked, proximity-based candidate
              matches instantly, filtered by ABO/Rh compatibility and current availability.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <h3>For Donors</h3>
            <p>
              Receive targeted alerts for urgent nearby blood needs. Accept or decline invitations
              with one click, manage your real-time availability, and keep verified donation logs.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3>Privacy First</h3>
            <p>
              Exact home GPS coordinates and personal phone numbers are guarded by design.
              Only calculated distance and general neighborhood areas are shown during matching.
            </p>
          </div>
        </div>
      </section>

      {/* "How It Works" 4-Step Section */}
      <section className="how-it-works-section" aria-labelledby="steps-title">
        <div className="section-heading-center">
          <h2 id="steps-title">How It Works in Emergencies</h2>
          <p>Four streamlined stages from emergency demand to fulfilled patient transfusion.</p>
        </div>

        <div className="steps-grid">
          <div className="step-item">
            <span className="step-badge" aria-hidden="true">1</span>
            <h4>Request</h4>
            <p>Hospital staff posts blood type, units required, urgency classification, and receiving ward.</p>
          </div>

          <div className="step-item">
            <span className="step-badge" aria-hidden="true">2</span>
            <h4>Match</h4>
            <p>Intelligent discovery engine filters compatible, eligible donors sorted by proximity distance.</p>
          </div>

          <div className="step-item">
            <span className="step-badge" aria-hidden="true">3</span>
            <h4>Respond</h4>
            <p>Nearby donors receive immediate notifications and confirm acceptance via their portal.</p>
          </div>

          <div className="step-item">
            <span className="step-badge" aria-hidden="true">4</span>
            <h4>Fulfil</h4>
            <p>Donor arrives at hospital, cross-matching is verified, and the donation outcome is recorded.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
