import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { requestsApi } from '../../api/requests';
import { donationsApi } from '../../api/donations';
import { parseApiError } from '../../utils/errorHandler';
import { useToast } from '../../context/ToastContext';
import { usePolling } from '../../hooks/usePolling';
import { formatDate, formatDistance, formatUrgency } from '../../utils/formatters';
import { isValidQuantity } from '../../utils/validators';

import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/Button';
import DataTable from '../../components/DataTable';
import FormInput from '../../components/FormInput';
import Spinner from '../../components/Spinner';
import ErrorMessage from '../../components/ErrorMessage';
import ConfirmDialog from '../../components/ConfirmDialog';

export const RequestDetailPage = () => {
  const { id } = useParams();
  const toast = useToast();

  const [requestItem, setRequestItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(() => new Date());

  // Cancel Request State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Record Donation Outcome State
  const [outcomeDonorId, setOutcomeDonorId] = useState('');
  const [outcomeUnits, setOutcomeUnits] = useState('1');
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [outcomeSubmitting, setOutcomeSubmitting] = useState(false);
  const [outcomeError, setOutcomeError] = useState('');

  // Fetch Request & Matches
  const fetchData = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    setError(null);
    try {
      const [reqData, matchesData] = await Promise.all([
        requestsApi.getRequestById(id),
        requestsApi.getRequestMatches(id)
      ]);
      setRequestItem(reqData);
      setMatches(matchesData);
      setLastRefreshed(new Date());

      // If pre-selected donor not set and matches exist, default to accepted candidate
      if (!outcomeDonorId && matchesData && matchesData.length > 0) {
        const acceptedCandidate = matchesData.find((m) => m.responseStatus === 'ACCEPTED');
        if (acceptedCandidate) {
          setOutcomeDonorId(acceptedCandidate.candidateId);
        } else {
          setOutcomeDonorId(matchesData[0].candidateId);
        }
      }
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [id, outcomeDonorId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Polling every 15 seconds while request is OPEN
  const isOpen = requestItem?.status === 'OPEN';
  usePolling(() => {
    fetchData(true);
  }, 15000, isOpen);

  // Cancel Request Action
  const handleCancelRequest = async () => {
    setIsCancelling(true);
    try {
      const res = await requestsApi.cancelRequest(id);
      setRequestItem(res.request || { ...requestItem, status: 'CANCELLED' });
      toast.success('Request has been cancelled.');
      setCancelModalOpen(false);
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error(parsed.message || 'Failed to cancel request.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Record Donation Outcome
  const handleRecordOutcome = async (e) => {
    e.preventDefault();
    setOutcomeError('');

    if (!outcomeDonorId) {
      setOutcomeError('Please select or specify the donor/candidate ID.');
      return;
    }

    if (!isValidQuantity(outcomeUnits)) {
      setOutcomeError('Units donated must be a positive integer.');
      return;
    }

    setOutcomeSubmitting(true);
    try {
      await donationsApi.recordDonation({
        requestId: id,
        donorId: outcomeDonorId,
        unitsDonated: Number(outcomeUnits),
        donatedAt: new Date().toISOString(),
        notes: outcomeNotes
      });

      toast.success('Donation outcome recorded! Request status marked as FULFILLED.');
      // Refresh request data to reflect fulfilled status
      fetchData();
      setOutcomeNotes('');
    } catch (err) {
      const parsed = parseApiError(err);
      setOutcomeError(parsed.message || 'Failed to record donation outcome.');
      toast.error(parsed.message || 'Failed to record donation');
    } finally {
      setOutcomeSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container page-center">
        <Spinner text="Loading emergency blood request and candidate matches..." />
      </div>
    );
  }

  if (error || !requestItem) {
    return (
      <div className="page-container">
        <PageHeader title="Request Details" backTo="/hospital" />
        <ErrorMessage message={error || 'Request not found'} onRetry={() => fetchData()} />
      </div>
    );
  }

  const urgency = formatUrgency(requestItem.urgency);

  const matchColumns = [
    {
      header: 'Rank',
      accessor: 'rank',
      render: (row) => (
        <span className="rank-badge" style={{ fontWeight: 700 }}>
          #{row.rank}
        </span>
      )
    },
    {
      header: 'Blood Group',
      accessor: 'bloodGroup',
      render: (row) => (
        <span className="blood-group-tag">{row.bloodGroup}</span>
      )
    },
    {
      header: 'Proximity Distance',
      accessor: 'distanceKm',
      render: (row) => (
        <div>
          <strong>📍 {formatDistance(row.distanceKm)}</strong>
          {row.approximateArea && (
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Area: {row.approximateArea}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Eligibility',
      accessor: 'eligibility',
      render: (row) => <StatusBadge status={row.eligibility} />
    },
    {
      header: 'Donor Response Status',
      accessor: 'responseStatus',
      render: (row) => (
        <div>
          <StatusBadge status={row.responseStatus} />
          {row.responseTime && (
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
              {formatDate(row.responseTime)}
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="page-container">
      <PageHeader
        title={`Emergency Blood Request #${requestItem.id}`}
        subtitle={`Created ${formatDate(requestItem.createdAt)} by ${requestItem.hospitalName}`}
        backTo="/hospital"
        actions={
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Button variant="secondary" size="sm" onClick={() => fetchData()}>
              🔄 Refresh
            </Button>
            {requestItem.status === 'OPEN' && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setCancelModalOpen(true)}
              >
                Cancel Request
              </Button>
            )}
          </div>
        }
      />

      {/* Mandatory Medical Disclaimer Notice */}
      <div className="disclaimer-callout" role="note" style={{ marginBottom: '1.5rem' }}>
        <strong>⚠️ Clinical Coordination Disclaimer:</strong>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>
          This application coordinates voluntary proximity discovery only. Hospital blood-bank cross-matching
          procedures, screening, and transfusion safety judgment must precede any transfusion.
        </p>
      </div>

      {/* Request Overview Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="request-overview-header">
          <div className="overview-badges">
            <span className={`badge badge-${urgency.variant}`}>{urgency.label} Urgency</span>
            <StatusBadge status={requestItem.status} />
          </div>

          {isOpen && (
            <span className="live-poll-indicator" title="Page is automatically polling for live donor responses">
              <span className="pulse-dot" aria-hidden="true" />
              Live matching active (polling every 15s • last updated {lastRefreshed.toLocaleTimeString()})
            </span>
          )}
        </div>

        <div className="overview-grid">
          <div className="overview-item">
            <span className="overview-label">Requirement</span>
            <span className="overview-val">
              {requestItem.bloodGroup} • {requestItem.bloodComponent}
            </span>
          </div>

          <div className="overview-item">
            <span className="overview-label">Units Needed vs Accepted</span>
            <span className="overview-val text-primary">
              {requestItem.acceptedCount} of {requestItem.unitsNeeded} units accepted
            </span>
          </div>

          <div className="overview-item">
            <span className="overview-label">Receiving Location</span>
            <span className="overview-val">{requestItem.hospitalLocation}</span>
          </div>

          <div className="overview-item">
            <span className="overview-label">Patient / Case Reference</span>
            <span className="overview-val">{requestItem.patientRef || 'N/A'}</span>
          </div>
        </div>

        {requestItem.notes && (
          <div className="overview-notes">
            <strong>Clinical Instructions: </strong>
            <span>{requestItem.notes}</span>
          </div>
        )}
      </div>

      <div className="grid-2col">
        {/* Ranked Matches Table */}
        <section className="card" aria-labelledby="matches-heading">
          <div className="section-header-row">
            <div>
              <h2 id="matches-heading" className="card-title">
                🎯 Ranked Proximity Matches ({matches.length})
              </h2>
              <p className="card-subtitle">
                Filtered and sorted by geographic distance to hospital.
              </p>
            </div>
          </div>

          {/* PRIVACY NOTICE: Do not display precise location or phone numbers */}
          <div className="privacy-pill-notice">
            🔒 <strong>Privacy Enforced:</strong> Exact donor street addresses and phone numbers
            are guarded to protect donor safety. Only approximate neighborhood and calculated distance are shown.
          </div>

          <DataTable
            columns={matchColumns}
            data={matches}
            emptyTitle="No donor candidates matched yet"
            emptyMessage="The matching algorithm has not found eligible nearby donors yet. Nearby eligible donors will appear as soon as invitations are broadcast."
          />
        </section>

        {/* Record Donation Outcome Form */}
        <section className="card" aria-labelledby="outcome-heading">
          <h2 id="outcome-heading" className="card-title">
            💉 Record Donation Outcome
          </h2>
          <p className="card-subtitle">
            After the accepted donor reports to the blood bank and completes the transfusion, record the verified outcome.
          </p>

          {outcomeError && <ErrorMessage message={outcomeError} />}

          {requestItem.status === 'FULFILLED' ? (
            <div className="alert alert-success" style={{ marginTop: '1rem' }}>
              ✓ This emergency blood request has already been recorded as <strong>FULFILLED</strong>.
            </div>
          ) : requestItem.status === 'CANCELLED' ? (
            <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
              ⚠️ This request was cancelled and cannot accept donation outcomes.
            </div>
          ) : (
            <form onSubmit={handleRecordOutcome} style={{ marginTop: '1rem' }} noValidate>
              <div className="form-group">
                <label htmlFor="outcome-donor">Attending Donor / Candidate ID</label>
                <select
                  id="outcome-donor"
                  value={outcomeDonorId}
                  onChange={(e) => setOutcomeDonorId(e.target.value)}
                  disabled={outcomeSubmitting}
                  required
                >
                  <option value="">Select candidate who donated...</option>
                  {matches.map((m) => (
                    <option key={m.candidateId} value={m.candidateId}>
                      Rank #{m.rank} ({m.bloodGroup} • {m.approximateArea || 'Nearby Area'} • {m.responseStatus})
                    </option>
                  ))}
                  <option value="walk-in-donor">Other Verified Donor</option>
                </select>
              </div>

              <FormInput
                label="Units Donated"
                type="number"
                min="1"
                max="10"
                value={outcomeUnits}
                onChange={(e) => setOutcomeUnits(e.target.value)}
                required
                disabled={outcomeSubmitting}
              />

              <div className="form-group">
                <label htmlFor="outcome-notes">Attending Clinician / Blood Bank Notes</label>
                <textarea
                  id="outcome-notes"
                  rows={3}
                  value={outcomeNotes}
                  onChange={(e) => setOutcomeNotes(e.target.value)}
                  placeholder="e.g. Cross-match passed, 1 unit drawn successfully."
                  disabled={outcomeSubmitting}
                />
              </div>

              <Button
                variant="primary"
                type="submit"
                fullWidth
                loading={outcomeSubmitting}
              >
                Confirm & Record Donation Outcome
              </Button>
            </form>
          )}
        </section>
      </div>

      {/* Confirmation Dialog for Request Cancellation */}
      <ConfirmDialog
        isOpen={cancelModalOpen}
        title="Cancel Emergency Request?"
        message="Are you sure you want to cancel this blood request? Any active donor invitations will be expired immediately."
        confirmLabel="Yes, Cancel Request"
        confirmVariant="danger"
        loading={isCancelling}
        onConfirm={handleCancelRequest}
        onCancel={() => setCancelModalOpen(false)}
      />
    </div>
  );
};

export default RequestDetailPage;
