import React from 'react';

/**
 * Accessible Loading Spinner
 */
export const Spinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClass = size === 'sm' ? 'spinner-sm' : size === 'lg' ? 'spinner-lg' : 'spinner-md';

  return (
    <div className="spinner-wrapper" role="status" aria-live="polite">
      <div className={`spinner-circle ${sizeClass}`} />
      {text && <span className="spinner-text">{text}</span>}
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default Spinner;
