import React from 'react';

/**
 * Global Application Footer with Mandatory Medical & Legal Coordination Disclaimer
 */
export const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="alert alert-warning" role="note" style={{ margin: 0 }}>
          <strong>⚠️ Clinical Notice:</strong> This platform is an emergency discovery and coordination tool only.
          It does not replace hospital blood-bank safety protocols, cross-matching validation, donor screening procedures, or clinical medical judgment.
        </div>

        <div className="footer-bottom">
          <p className="copyright-text">
            © 2026 GeoBlood Link — Intelligent Blood Donor Discovery & Emergency Matching System.
          </p>
          <div className="footer-links">
            <span className="badge badge-neutral" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
              Frontend Mock Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
