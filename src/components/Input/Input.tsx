import React from 'react';
import './Input.css';

export type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  size?: InputSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, hint, error, size = 'md', icon, iconPosition = 'left', className = '', id, ...props },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasIcon = !!icon;

    return (
      <div className="input-wrapper">
        {label && (
          <label htmlFor={inputId} className="input__label">
            {label}
            {hint && <span className="input__hint">{hint}</span>}
          </label>
        )}
        <div
          className={['input__container', hasIcon && `input__container--icon-${iconPosition}`]
            .filter(Boolean)
            .join(' ')}>
          {icon && iconPosition === 'left' && (
            <span className="input__icon input__icon--left">{icon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={['input', `input--${size}`, error && 'input--error', className]
              .filter(Boolean)
              .join(' ')}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <span className="input__icon input__icon--right">{icon}</span>
          )}
        </div>
        {error && <span className="input__error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
