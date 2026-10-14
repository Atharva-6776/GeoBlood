import React from 'react';

/**
 * Reusable Button Component with Built-in Double-Submission Prevention.
 * 
 * Automatically disables itself and displays a spinner when `loading` is true.
 */
export const Button = ({
  children,
  type = 'button',
  variant = 'primary', // 'primary', 'secondary', 'danger', 'outline'
  size = 'md',        // 'sm', 'md', 'lg'
  loading = false,
  disabled = false,
  onClick,
  className = '',
  fullWidth = false,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-large' : '';
  const blockClass = fullWidth ? 'btn-block' : '';

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      onClick={isDisabled ? undefined : onClick}
      className={`btn ${variantClass} ${sizeClass} ${blockClass} ${className}`.trim()}
      {...props}
    >
      {loading ? (
        <span className="btn-loading-content">
          <span className="inline-spinner" aria-hidden="true" />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
