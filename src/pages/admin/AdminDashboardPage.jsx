import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../api/admin';
import { parseApiError } from '../../utils/errorHandler';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';

import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';

export const AdminDashboardPage = () => {
  const toast = useToast();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgressId, setActionInProgressId] = useState(null);

  const fetchVerifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getPendingVerifications();
      setVerifications(data);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  const handleAction = async (id, action) => {
    setActionInProgressId(id);
    try {
      await adminApi.updateVerification(id, action);
      setVerifications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : item
        )
      );
      toast.success(`Account verification successfully ${action === 'APPROVE' ? 'approved' : 'rejected'}.`);
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error(parsed.message || 'Failed to update verification status.');
    } finally {
      setActionInProgressId(null);
    }
  };

  const columns = [
    {
      header: 'Organization / Name',
      accessor: 'entityName',
      render: (row) => (
        <div>
          <strong>{row.entityName}</strong>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Email: {row.email}
          </div>
        </div>
      )
    },
    {
      header: 'Account Type',
      accessor: 'type',
      render: (row) => <span className="badge badge-primary">{row.type}</span>
    },
    {
      header: 'License / Medical Reg No',
      accessor: 'licenseNumber',
      render: (row) => <code>{row.licenseNumber}</code>
    },
    {
      header: 'Jurisdiction / City',
      accessor: 'city'
    },
    {
      header: 'Submitted At',
      accessor: 'submittedAt',
      render: (row) => formatDate(row.submittedAt)
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Action',
      accessor: 'id',
      render: (row) => {
        const isPending = row.status === 'PENDING';
        const inFlight = actionInProgressId === row.id;

        if (!isPending) {
          return <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Resolved</span>;
        }

        return (
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <Button
              variant="secondary"
              size="sm"
              disabled={inFlight}
              onClick={() => handleAction(row.id, 'REJECT')}
            >
              Reject
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={inFlight}
              disabled={inFlight}
              onClick={() => handleAction(row.id, 'APPROVE')}
            >
              Approve
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Admin Control Panel"
        subtitle="Review and verify hospital clinical credentials and compliance with privacy standards."
        actions={
          <Button variant="secondary" size="sm" onClick={fetchVerifications}>
            🔄 Refresh
          </Button>
        }
      />

      <div className="card" style={{ marginBottom: '1.5rem', background: '#f8fafc' }}>
        <h3>System Governance & Verification</h3>
        <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>
          Hospitals must provide valid medical licenses before broadcasting emergency donor alerts.
          All donor private GPS records remain masked from external query logs.
        </p>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchVerifications} />}

      <div className="card">
        <DataTable
          columns={columns}
          data={verifications}
          loading={loading}
          emptyTitle="No pending verifications"
          emptyMessage="All registered hospital facilities and clinical coordinators have been reviewed."
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
