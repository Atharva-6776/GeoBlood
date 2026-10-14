import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

/**
 * Standardized Page Header Component
 */
export const PageHeader = ({
  title,
  subtitle,
  backTo,
  backLabel = '← Back',
  actions,
  children
}) => {
  const navigate = useNavigate();

  return (
    <div className="page-header-container">
      <div className="page-header-left">
        {backTo && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => (typeof backTo === 'string' ? navigate(backTo) : navigate(-1))}
            className="btn-back"
          >
            {backLabel}
          </Button>
        )}
        <div>
          <h1 className="page-header-title">{title}</h1>
          {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
        </div>
      </div>

      {(actions || children) && (
        <div className="page-header-actions">
          {actions}
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
