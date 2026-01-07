import React from 'react';
import './Textarea.css';

export type TextareaSize = 'sm' | 'md' | 'lg';

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  size?: TextareaSize;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, size = 'md', className = '', id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="textarea-wrapper">
        {label && (
          <label htmlFor={textareaId} className="textarea__label">
            {label}
            {hint && <span className="textarea__hint">{hint}</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={['textarea', `textarea--${size}`, error && 'textarea--error', className]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {error && <span className="textarea__error">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
