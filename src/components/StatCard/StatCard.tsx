import React from 'react';
import './StatCard.css';

export type StatCardVariant = 'primary' | 'info' | 'warning' | 'success' | 'error';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  variant?: StatCardVariant;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  variant = 'primary',
  className = '',
}) => {
  const classNames = ['stat-card', `stat-card--${variant}`, className].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__content">
        <span className="stat-card__value">{value}</span>
        <span className="stat-card__label">{label}</span>
      </div>
    </div>
  );
};

export default StatCard;
