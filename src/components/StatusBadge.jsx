import React from 'react';

/**
 * Visual badge for Request and Response Statuses
 */
export const StatusBadge = ({ status, className = '' }) => {
  if (!status) return null;

  const normalized = status.toUpperCase();

  let badgeClass = 'badge-primary';
  let label = normalized;

  switch (normalized) {
    case 'OPEN':
      badgeClass = 'badge-warning';
      label = 'Open Emergency';
      break;
    case 'FULFILLED':
    case 'ACCEPTED':
    case 'APPROVED':
    case 'ELIGIBLE':
      badgeClass = 'badge-success';
      label = normalized === 'FULFILLED' ? 'Fulfilled' : normalized === 'ACCEPTED' ? 'Accepted' : normalized;
      break;
    case 'PENDING':
      badgeClass = 'badge-primary';
      label = 'Pending';
      break;
    case 'CANCELLED':
    case 'DECLINED':
    case 'REJECTED':
      badgeClass = 'badge-danger';
      label = normalized === 'CANCELLED' ? 'Cancelled' : normalized === 'DECLINED' ? 'Declined' : normalized;
      break;
    case 'EXPIRED':
      badgeClass = 'badge-neutral';
      label = 'Expired';
      break;
    default:
      badgeClass = 'badge-primary';
      label = normalized;
  }

  return <span className={`badge ${badgeClass} ${className}`.trim()}>{label}</span>;
};

export default StatusBadge;
