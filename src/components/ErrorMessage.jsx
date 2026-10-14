import React from 'react';
import Button from './Button';

/**
 * Standard Error Banner with optional Retry Action
 */
export const ErrorMessage = ({ message, onRetry, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`alert alert-error error-banner ${className}`.trim()} role="alert">
      <div className="error-content">
        <span className="error-icon" aria-hidden="true">⚠️</span>
        <div className="error-text">
          <strong>Error: </strong>
          {message}
        </div>
      </div>
      {onRetry && (
        <div className="error-action">
          <Button variant="secondary" size="sm" onClick={onRetry}>
            🔄 Retry
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;
