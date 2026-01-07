import React from 'react';
import './Select.css';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  size?: SelectSize;
  options: SelectOption[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, hint, error, size = 'md', options, placeholder, className = '', id, ...props },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="select-wrapper">
        {label && (
          <label htmlFor={selectId} className="select__label">
            {label}
            {hint && <span className="select__hint">{hint}</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={['select', `select--${size}`, error && 'select--error', className]
            .filter(Boolean)
            .join(' ')}
          {...props}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="select__error">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
