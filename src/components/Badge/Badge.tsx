import React from 'react';
import './Badge.css';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const classNames = ['badge', `badge--${variant}`, `badge--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return <span className={classNames}>{children}</span>;
};

export default Badge;
