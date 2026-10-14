import React from 'react';

/**
 * Accessible Select Dropdown with Label and Error Message
 */
export const Select = ({
  id,
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option...',
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const selectId = id || `select-${name}`;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label htmlFor={selectId}>
          {label}
          {required && <span className="required-indicator" aria-hidden="true"> *</span>}
        </label>
      )}

      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? errorId : helperText ? helperId : undefined
        }
        className={error ? 'input-error' : ''}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const text = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {text}
            </option>
          );
        })}
      </select>

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

export default Select;
