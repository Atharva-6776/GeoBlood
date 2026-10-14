/**
 * UI Formatting Utilities
 */

export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

export function formatDistance(distanceKm) {
  if (distanceKm === undefined || distanceKm === null) return '—';
  const num = Number(distanceKm);
  if (isNaN(num)) return '—';
  return `${num.toFixed(1)} km`;
}

export function formatUrgency(urgency) {
  switch (urgency) {
    case 'CRITICAL':
      return { label: 'Critical', variant: 'danger' };
    case 'HIGH':
      return { label: 'High Priority', variant: 'warning' };
    case 'NORMAL':
    default:
      return { label: 'Standard', variant: 'primary' };
  }
}
