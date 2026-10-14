import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useToast } from '../context/ToastContext';

export const Navbar = () => {
  const { isAuthenticated, user, role, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { info } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [simulateError, setSimulateError] = useState(() => {
    return localStorage.getItem('MOCK_SIMULATE_RANDOM_FAILURES') === 'true';
  });

  const isMockEnabled = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true;
  const notifRef = useRef(null);

  // Close notification popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSimulateError = () => {
    const nextVal = !simulateError;
    setSimulateError(nextVal);
    localStorage.setItem('MOCK_SIMULATE_RANDOM_FAILURES', String(nextVal));
    info(`Simulated API Failures: ${nextVal ? 'ON (500 errors)' : 'OFF'}`);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="nav-brand-container">
          <Link to="/" className="nav-brand" aria-label="GeoBlood Link Home">
            <span className="brand-icon" aria-hidden="true">🩸</span>
            <span>GeoBlood Link</span>
          </Link>
          <span className="coordination-tag">Coordination Only</span>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          className="nav-mobile-toggle"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          ☰
        </button>

        <nav className={`nav-links ${mobileMenuOpen ? 'nav-links-mobile-open' : ''}`}>
          {/* Subtle Dev-Only Error Simulator Toggle (Only shown when mock mode is enabled) */}
          {isMockEnabled && (
            <button
              type="button"
              onClick={toggleSimulateError}
              className={`dev-pill-btn ${simulateError ? 'dev-pill-active' : ''}`}
              title="Toggle simulated 500 network errors for testing error banners & retry logic"
            >
              {simulateError ? '⚠️ 500 On' : '🧪 Dev: 500 Test'}
            </button>
          )}

          {isAuthenticated ? (
            <>
              {role === 'DONOR' && (
                <>
                  <Link
                    to="/donor"
                    className={location.pathname === '/donor' ? 'active-link' : ''}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Invitations & Profile
                  </Link>
                  <Link
                    to="/donor/history"
                    className={location.pathname === '/donor/history' ? 'active-link' : ''}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Donation History
                  </Link>
                </>
              )}

              {role === 'HOSPITAL' && (
                <>
                  <Link
                    to="/hospital"
                    className={location.pathname === '/hospital' ? 'active-link' : ''}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Requests Dashboard
                  </Link>
                  <Link
                    to="/hospital/requests/new"
                    className={location.pathname === '/hospital/requests/new' ? 'active-link' : ''}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    + New Request
                  </Link>
                </>
              )}

              {role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className={location.pathname === '/admin' ? 'active-link' : ''}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Verification
                </Link>
              )}

              {/* Notification Bell */}
              <div className="notif-wrapper" ref={notifRef}>
                <button
                  type="button"
                  className="notif-bell-btn"
                  onClick={() => setNotifOpen((prev) => !prev)}
                  aria-label={`Notifications (${unreadCount} unread)`}
                >
                  🔔
                  {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                </button>

                {notifOpen && (
                  <div className="notif-dropdown" role="region" aria-label="Recent notifications">
                    <div className="notif-header">
                      <h4>Notifications</h4>
                      {unreadCount > 0 && (
                        <button type="button" onClick={markAllAsRead} className="btn-link-action">
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="notif-list">
                      {notifications.length === 0 ? (
                        <p className="notif-empty">No notifications yet.</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`notif-item ${!n.read ? 'notif-unread' : ''}`}
                            onClick={() => {
                              markAsRead(n.id);
                              if (n.link) {
                                navigate(n.link);
                                setNotifOpen(false);
                                setMobileMenuOpen(false);
                              }
                            }}
                          >
                            <div className="notif-title-row">
                              <span className="notif-item-title">{n.title}</span>
                              <span className="notif-item-time">{n.time}</span>
                            </div>
                            <p className="notif-item-msg">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <span className="badge badge-primary">{role}</span>
              <span className="nav-user-name" title={user?.email}>
                {user?.name || user?.email}
              </span>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="btn btn-secondary btn-chip"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link
                to="/register"
                className="btn btn-primary btn-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
