import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestsApi } from '../../api/requests';
import { parseApiError } from '../../utils/errorHandler';
import { formatDate, formatUrgency } from '../../utils/formatters';

import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/Button';
import DataTable from '../../components/DataTable';
import ErrorMessage from '../../components/ErrorMessage';

export const HospitalDashboardPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestsApi.getHospitalRequests();
      setRequests(data);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Filtering
  const filteredRequests = requests.filter((req) => {
    if (statusFilter === 'ALL') return true;
    return req.status === statusFilter;
  });

  // Summary Metrics
  const openCount = requests.filter((r) => r.status === 'OPEN').length;
  const fulfilledCount = requests.filter((r) => r.status === 'FULFILLED').length;
  const criticalCount = requests.filter((r) => r.status === 'OPEN' && r.urgency === 'CRITICAL').length;

  const columns = [
    {
      header: 'Request Ref',
      accessor: 'id',
      render: (row) => (
        <div>
          <strong style={{ color: '#0f172a' }}>#{row.id}</strong>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            {row.patientRef || 'Hospital Emergency'}
          </div>
        </div>
      )
    },
    {
      header: 'Requirement',
      accessor: (row) => `${row.bloodGroup} • ${row.unitsNeeded} unit(s)`,
      render: (row) => (
        <div>
          <span className="blood-group-tag">{row.bloodGroup}</span>
          <span style={{ marginLeft: '0.5rem', fontWeight: 600 }}>{row.unitsNeeded} unit(s)</span>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            {row.bloodComponent || 'Whole Blood'}
          </div>
        </div>
      )
    },
    {
      header: 'Urgency',
      accessor: 'urgency',
      render: (row) => {
        const u = formatUrgency(row.urgency);
        return <span className={`badge badge-${u.variant}`}>{u.label}</span>;
      }
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Matches / Accepted',
      accessor: (row) => `${row.acceptedCount} / ${row.unitsNeeded}`,
      render: (row) => (
        <div>
          <span className="accepted-fraction">
            {row.acceptedCount} of {row.unitsNeeded} accepted
          </span>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            {row.matchedCandidatesCount || 0} candidates alerted
          </div>
        </div>
      )
    },
    {
      header: 'Created At',
      accessor: 'createdAt',
      render: (row) => formatDate(row.createdAt)
    },
    {
      header: 'Action',
      accessor: 'id',
      render: (row) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/hospital/requests/${row.id}`)}
        >
          View Matches →
        </Button>
      )
    }
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Emergency Requests Dashboard"
        subtitle="Coordinate hospital blood demands and monitor real-time donor discovery and responses."
        actions={
          <Link to="/hospital/requests/new">
            <Button variant="primary">
              + Create Emergency Request
            </Button>
          </Link>
        }
      />

      {/* Metrics Row */}
      <div className="metrics-cards-grid">
        <div className="metric-box card">
          <span className="metric-box-label">Active Open Emergencies</span>
          <span className="metric-box-val text-danger">{openCount}</span>
          <span className="metric-box-hint">{criticalCount} Critical status</span>
        </div>

        <div className="metric-box card">
          <span className="metric-box-label">Total Fulfilled Requests</span>
          <span className="metric-box-val text-success">{fulfilledCount}</span>
          <span className="metric-box-hint">Patient transfusions enabled</span>
        </div>

        <div className="metric-box card">
          <span className="metric-box-label">Total Requests Logged</span>
          <span className="metric-box-val">{requests.length}</span>
          <span className="metric-box-hint">All time records</span>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchRequests} />}

      {/* Filter Tabs */}
      <div className="filter-tabs-row" role="tablist" aria-label="Filter requests by status">
        {['ALL', 'OPEN', 'FULFILLED', 'CANCELLED', 'EXPIRED'].map((status) => (
          <button
            key={status}
            role="tab"
            aria-selected={statusFilter === status}
            className={`filter-tab ${statusFilter === status ? 'filter-tab-active' : ''}`}
            onClick={() => setStatusFilter(status)}
          >
            {status}
            {status !== 'ALL' && (
              <span className="filter-count">
                {requests.filter((r) => r.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <div className="card" style={{ marginTop: '1rem' }}>
        <DataTable
          columns={columns}
          data={filteredRequests}
          loading={loading}
          emptyTitle="No requests found"
          emptyMessage={`No ${statusFilter === 'ALL' ? '' : statusFilter.toLowerCase()} blood requests found. Click "+ Create Emergency Request" to initiate donor matching.`}
        />
      </div>
    </div>
  );
};

export default HospitalDashboardPage;
