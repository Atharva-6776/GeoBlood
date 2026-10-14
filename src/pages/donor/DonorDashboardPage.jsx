import React, { useState, useEffect, useCallback } from 'react';
import { donorsApi } from '../../api/donors';
import { requestsApi } from '../../api/requests';
import { parseApiError } from '../../utils/errorHandler';
import { useToast } from '../../context/ToastContext';
import { BLOOD_GROUPS, isValidPhone } from '../../utils/validators';
import { formatDate, formatDistance, formatUrgency } from '../../utils/formatters';

import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import Select from '../../components/Select';
import Spinner from '../../components/Spinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';

export const DonorDashboardPage = () => {
  const toast = useToast();

  // Profile State
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  // Profile Form Fields
  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: '',
    locationArea: '',
    contactNumber: '',
    latitude: '',
    longitude: '',
    notificationPrefs: {
      emailAlerts: true,
      smsAlerts: true,
      emergencyPush: true
    }
  });
  const [profileValidationErrors, setProfileValidationErrors] = useState({});

  // Geolocation Browser State
  const [geoLocating, setGeoLocating] = useState(false);
  const [geoNotice, setGeoNotice] = useState('');

  // Invitations State
  const [invitations, setInvitations] = useState([]);
  const [invitationsLoading, setInvitationsLoading] = useState(true);
  const [invitationsError, setInvitationsError] = useState(null);

  // Response In-Flight & Confirmation Modal State
  const [respondingInvId, setRespondingInvId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    invitation: null,
    action: null
  });

  // Fetch Donor Profile
  const fetchProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const data = await donorsApi.getMe();
      setProfile(data);
      setFormData({
        name: data.name || '',
        bloodGroup: data.bloodGroup || '',
        locationArea: data.locationArea || '',
        contactNumber: data.contactNumber || '',
        latitude: data.latitude !== null && data.latitude !== undefined ? data.latitude : '',
        longitude: data.longitude !== null && data.longitude !== undefined ? data.longitude : '',
        notificationPrefs: data.notificationPrefs || {
          emailAlerts: true,
          smsAlerts: true,
          emergencyPush: true
        }
      });
    } catch (err) {
      setProfileError(parseApiError(err).message);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // Fetch Invitations
  const fetchInvitations = useCallback(async () => {
    setInvitationsLoading(true);
    setInvitationsError(null);
    try {
      const data = await donorsApi.getInvitations();
      setInvitations(data);
    } catch (err) {
      setInvitationsError(parseApiError(err).message);
    } finally {
      setInvitationsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchInvitations();
  }, [fetchProfile, fetchInvitations]);

  // Handle Availability Toggle
  const handleToggleAvailability = async () => {
    if (!profile) return;
    const targetStatus = !profile.isAvailable;
    try {
      await donorsApi.updateAvailability(targetStatus);
      setProfile((prev) => ({ ...prev, isAvailable: targetStatus }));
      toast.success(
        targetStatus
          ? 'You are now marked as AVAILABLE for emergency requests.'
          : 'You are now marked as UNAVAILABLE.'
      );
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error(parsed.message || 'Failed to update availability.');
    }
  };

  // Browser Geolocation API ("Use My Location")
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLocating(true);
    setGeoNotice('Requesting location permission from browser...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          latitude: Number(latitude.toFixed(4)),
          longitude: Number(longitude.toFixed(4))
        }));
        setGeoLocating(false);
        setGeoNotice('Location coordinates captured successfully.');
        toast.success('Current coordinates populated.');
      },
      (error) => {
        setGeoLocating(false);
        let msg = 'Failed to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. You can enter your general area manually.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        setGeoNotice(msg);
        toast.warning(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Save Profile Form
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileValidationErrors({});

    const errors = {};
    if (!formData.bloodGroup) errors.bloodGroup = 'Please select your blood group.';
    if (!formData.locationArea.trim()) errors.locationArea = 'Please enter your neighborhood/city.';
    if (!formData.contactNumber.trim()) errors.contactNumber = 'Contact phone number is required.';
    else if (!isValidPhone(formData.contactNumber)) {
      errors.contactNumber = 'Please enter a valid phone number (8-16 digits).';
    }

    if (Object.keys(errors).length > 0) {
      setProfileValidationErrors(errors);
      toast.error('Please fix validation errors in your profile.');
      return;
    }

    setProfileSubmitting(true);
    try {
      const updated = await donorsApi.createProfile({
        name: formData.name,
        bloodGroup: formData.bloodGroup,
        locationArea: formData.locationArea,
        contactNumber: formData.contactNumber,
        latitude: formData.latitude !== '' ? Number(formData.latitude) : null,
        longitude: formData.longitude !== '' ? Number(formData.longitude) : null,
        notificationPrefs: formData.notificationPrefs
      });
      setProfile(updated);
      toast.success('Donor profile updated successfully!');
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error(parsed.message);
      setProfileValidationErrors(parsed.fieldErrors || {});
    } finally {
      setProfileSubmitting(false);
    }
  };

  // Modal response prompt
  const promptResponse = (invitation, action) => {
    setConfirmModal({
      isOpen: true,
      invitation,
      action
    });
  };

  // Submit Response to Server
  const handleConfirmResponse = async () => {
    const { invitation, action } = confirmModal;
    if (!invitation || !action) return;

    setRespondingInvId(invitation.id);
    try {
      await requestsApi.respondToRequest(invitation.requestId, action);

      setInvitations((prev) =>
        prev.map((inv) =>
          inv.id === invitation.id ? { ...inv, status: action } : inv
        )
      );

      toast.success(
        action === 'ACCEPTED'
          ? 'Emergency request accepted! The hospital team has been alerted.'
          : 'Request declined.'
      );
      setConfirmModal({ isOpen: false, invitation: null, action: null });
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error(parsed.message || 'Could not process response.');
      fetchInvitations();
      setConfirmModal({ isOpen: false, invitation: null, action: null });
    } finally {
      setRespondingInvId(null);
    }
  };

  return (
    <div className="container">
      <PageHeader
        title="Donor Discovery Portal"
        subtitle="Manage availability, respond to emergency proximity requests, and keep contact credentials updated."
      />

      {/* Top Status & Availability Card */}
      <div className="card donor-stats-bar">
        <div className="donor-stat-col">
          <span className="stat-label">Eligibility Status</span>
          <span className="stat-val">
            <StatusBadge status={profile?.eligibilityStatus || 'ELIGIBLE'} />
          </span>
        </div>

        <div className="donor-stat-col">
          <span className="stat-label">Blood Group</span>
          <span className="blood-group-pill">
            {profile?.bloodGroup || 'Not set'}
          </span>
        </div>

        <div className="donor-stat-col">
          <span className="stat-label">Verified Donations</span>
          <span className="stat-val">
            {profile?.totalDonations || 0} unit(s)
          </span>
        </div>

        <div className="donor-stat-col">
          <span className="stat-label">Availability Status</span>
          <div
            className="switch-container"
            onClick={handleToggleAvailability}
            role="switch"
            aria-checked={Boolean(profile?.isAvailable)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                handleToggleAvailability();
              }
            }}
          >
            <div className={`switch-track ${profile?.isAvailable ? 'active' : ''}`}>
              <div className="switch-thumb" />
            </div>
            <span className="switch-text" style={{ color: profile?.isAvailable ? 'var(--success-text)' : 'var(--text-muted)' }}>
              {profile?.isAvailable ? '🟢 Available' : '⚪ Unavailable'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid-2col">
        {/* Left Column: Invitations */}
        <section aria-labelledby="invitations-heading">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 id="invitations-heading" className="card-title" style={{ margin: 0 }}>
              🚨 Emergency Invitations ({invitations.filter((i) => i.status === 'PENDING').length} pending)
            </h2>
            <Button variant="secondary" size="sm" onClick={fetchInvitations} loading={invitationsLoading}>
              Refresh
            </Button>
          </div>

          {invitationsError && (
            <ErrorMessage message={invitationsError} onRetry={fetchInvitations} />
          )}

          {invitationsLoading && !invitations.length ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Spinner text="Searching for matching emergency requests..." />
            </div>
          ) : invitations.length === 0 ? (
            <EmptyState
              icon="🕊️"
              title="No active emergency invitations"
              description="You have no pending requests at this moment. When a nearby hospital requires your blood group, you will receive an invitation here."
            />
          ) : (
            <div className="invitations-list">
              {invitations.map((inv) => {
                const urgency = formatUrgency(inv.urgency);
                const isPending = inv.status === 'PENDING';
                const isActionInProgress = respondingInvId === inv.id;

                return (
                  <div key={inv.id} className="card invitation-card">
                    <div className="inv-header-row">
                      <span className={`badge badge-${urgency.variant}`}>
                        {urgency.label} Urgency
                      </span>
                      <StatusBadge status={inv.status} />
                    </div>

                    <div>
                      <h3 className="inv-hospital-name">{inv.hospitalName}</h3>
                      <p className="inv-address">{inv.hospitalAddress}</p>
                    </div>

                    <div className="inv-metrics-box">
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Required:</span>
                        <strong style={{ fontSize: '0.9rem' }}>
                          {inv.unitsNeeded} unit(s) • {inv.bloodGroup} ({inv.bloodComponent || 'Whole Blood'})
                        </strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Estimated Distance:</span>
                        <strong style={{ fontSize: '0.9rem' }}>
                          📍 {formatDistance(inv.distanceKm)} away
                        </strong>
                      </div>
                    </div>

                    {inv.patientRef && (
                      <p style={{ fontSize: '0.85rem', color: '#334155' }}>
                        <strong>Clinical Note: </strong>{inv.patientRef}
                      </p>
                    )}

                    <div className="inv-footer-row">
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        Expires: {formatDate(inv.expiresAt)}
                      </span>

                      {isPending ? (
                        <div className="inv-actions">
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={isActionInProgress}
                            onClick={() => promptResponse(inv, 'DECLINED')}
                          >
                            Decline
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            loading={isActionInProgress}
                            disabled={isActionInProgress}
                            onClick={() => promptResponse(inv, 'ACCEPTED')}
                          >
                            Accept Request
                          </Button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                          Status: <StatusBadge status={inv.status} />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right Column: Donor Profile & Notification Preferences */}
        <div>
          <section className="card" aria-labelledby="profile-heading">
            <h2 id="profile-heading" className="card-title">
              👤 Donor Profile & Location
            </h2>
            <p className="card-subtitle">
              Your exact coordinates are strictly used for server-side proximity calculations and are never exposed publicly.
            </p>

            {profileError && <ErrorMessage message={profileError} onRetry={fetchProfile} />}

            {profileLoading ? (
              <Spinner text="Loading profile details..." />
            ) : (
              <form onSubmit={handleProfileSubmit} noValidate>
                <FormInput
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  required
                  error={profileValidationErrors.name}
                  disabled={profileSubmitting}
                />

                <Select
                  label="Blood Group"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  options={BLOOD_GROUPS}
                  placeholder="Select Blood Group..."
                  required
                  error={profileValidationErrors.bloodGroup}
                  disabled={profileSubmitting}
                />

                <FormInput
                  label="Area / Neighborhood / City"
                  name="locationArea"
                  value={formData.locationArea}
                  onChange={(e) => setFormData({ ...formData, locationArea: e.target.value })}
                  placeholder="e.g. Andheri West, Mumbai"
                  required
                  helperText="General locality shown on hospital coordination dashboard"
                  error={profileValidationErrors.locationArea}
                  disabled={profileSubmitting}
                />

                <FormInput
                  label="Contact Phone Number"
                  name="contactNumber"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  required
                  helperText="Kept confidential; hospital receives access only upon your confirmation"
                  error={profileValidationErrors.contactNumber}
                  disabled={profileSubmitting}
                />

                {/* Geo-Coordinates & Location Button */}
                <div className="geo-location-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Proximity Coordinates (Optional)</span>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleUseLocation}
                      loading={geoLocating}
                    >
                      📍 Use My Location
                    </Button>
                  </div>

                  {geoNotice && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--info-text)', marginBottom: '8px' }}>
                      {geoNotice}
                    </p>
                  )}

                  <div className="grid-2col-compact">
                    <FormInput
                      label="Latitude"
                      name="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      placeholder="-90 to 90"
                      error={profileValidationErrors.latitude}
                      disabled={profileSubmitting}
                    />
                    <FormInput
                      label="Longitude"
                      name="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      placeholder="-180 to 180"
                      error={profileValidationErrors.longitude}
                      disabled={profileSubmitting}
                    />
                  </div>
                </div>

                {/* Notification Preferences (UI only) */}
                <div className="notification-preferences-box">
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>
                    🔔 Emergency Alert Channels
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>
                    Configure how the matching system dispatches proximity alerts.
                  </p>

                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={formData.notificationPrefs.emailAlerts}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          notificationPrefs: {
                            ...formData.notificationPrefs,
                            emailAlerts: e.target.checked
                          }
                        })
                      }
                      disabled={profileSubmitting}
                    />
                    <span>Email Emergency Alerts</span>
                  </label>

                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={formData.notificationPrefs.smsAlerts}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          notificationPrefs: {
                            ...formData.notificationPrefs,
                            smsAlerts: e.target.checked
                          }
                        })
                      }
                      disabled={profileSubmitting}
                    />
                    <span>SMS Urgent Dispatch Notifications</span>
                  </label>

                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={formData.notificationPrefs.emergencyPush}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          notificationPrefs: {
                            ...formData.notificationPrefs,
                            emergencyPush: e.target.checked
                          }
                        })
                      }
                      disabled={profileSubmitting}
                    />
                    <span>Critical Alert Sound (Bypass Silent Mode)</span>
                  </label>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={profileSubmitting}
                  >
                    Save Profile & Preferences
                  </Button>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        title={
          confirmModal.action === 'ACCEPTED'
            ? 'Confirm Donation Acceptance'
            : 'Decline Emergency Request'
        }
        message={
          confirmModal.action === 'ACCEPTED'
            ? `Are you sure you want to ACCEPT the emergency invitation from ${confirmModal.invitation?.hospitalName}? The attending clinical team will be notified of your availability.`
            : `Are you sure you want to DECLINE this request? The system will proceed to match the next closest donor.`
        }
        confirmLabel={
          confirmModal.action === 'ACCEPTED' ? 'Yes, I Will Donate' : 'Yes, Decline'
        }
        confirmVariant={confirmModal.action === 'ACCEPTED' ? 'primary' : 'danger'}
        loading={respondingInvId !== null}
        onConfirm={handleConfirmResponse}
        onCancel={() => setConfirmModal({ isOpen: false, invitation: null, action: null })}
      />
    </div>
  );
};

export default DonorDashboardPage;
