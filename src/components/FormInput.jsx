import React from 'react';

/**
 * Accessible Form Input with Label, Helper Text, and Error Message
 */
export const FormInput = ({
  id,
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  min,
  max,
  step,
  ...props
}) => {
  const inputId = id || `input-${name}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId}>
          {label}
          {required && <span className="required-indicator" aria-hidden="true"> *</span>}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? errorId : helperText ? helperId : undefined
        }
        className={error ? 'input-error' : ''}
        {...props}
      />

      {helperText && !error && (
        <span id={helperId} className="field-helper">
          {helperText}
        </span>
      )}

      {error && (
        <span id={errorId} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormInput;
