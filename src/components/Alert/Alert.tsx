import React from 'react';
import './Alert.css';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  icon,
  onClose,
  className = '',
}) => {
  const classNames = ['alert', `alert--${variant}`, className].filter(Boolean).join(' ');

  return (
    <div className={classNames} role="alert">
      {icon && <span className="alert__icon">{icon}</span>}
      <div className="alert__content">{children}</div>
      {onClose && (
        <button className="alert__close" onClick={onClose} aria-label="Закрыть">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;
