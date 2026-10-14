import React, { useState, useEffect, useCallback } from 'react';
import { donorsApi } from '../../api/donors';
import { parseApiError } from '../../utils/errorHandler';
import { formatDate } from '../../utils/formatters';

import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import ErrorMessage from '../../components/ErrorMessage';

export const DonorHistoryPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await donorsApi.getDonations();
      setDonations(data);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const columns = [
    {
      header: 'Hospital / Facility',
      accessor: 'hospitalName',
      render: (row) => (
        <div>
          <strong>{row.hospitalName}</strong>
          {row.certificateId && (
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Ref: {row.certificateId}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Blood Group / Type',
      accessor: (row) => `${row.bloodGroup} (${row.bloodComponent || 'Whole Blood'})`
    },
    {
      header: 'Units',
      accessor: 'unitsDonated',
      render: (row) => <span className="badge badge-success">{row.unitsDonated} Unit(s)</span>
    },
    {
      header: 'Date & Time',
      accessor: 'donatedAt',
      render: (row) => formatDate(row.donatedAt)
    },
    {
      header: 'Clinical Verification Notes',
      accessor: 'notes'
    }
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="My Donation History"
        subtitle="Permanent verified record of your voluntary blood donations."
        backTo="/donor"
      />

      {error && <ErrorMessage message={error} onRetry={fetchHistory} />}

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <DataTable
          columns={columns}
          data={donations}
          loading={loading}
          emptyTitle="No past donations recorded yet"
          emptyMessage="Once you accept an emergency request and complete the donation at the hospital, your record will be credited here."
        />
      </div>
    </div>
  );
};

export default DonorHistoryPage;
