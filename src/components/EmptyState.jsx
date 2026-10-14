import React from 'react';
import Button from './Button';

/**
 * EmptyState placeholder when queries return zero records.
 */
export const EmptyState = ({
  icon = '📭',
  title = 'No records found',
  description = 'There is currently no data to display.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`empty-state-card ${className}`.trim()}>
      <div className="empty-state-icon" aria-hidden="true">
        {icon}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
