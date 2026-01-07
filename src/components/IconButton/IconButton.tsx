import React from 'react';
import './IconButton.css';

export type IconButtonVariant = 'default' | 'primary' | 'ghost' | 'danger';
export type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  label: string; // for accessibility
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'default',
  size = 'md',
  label,
  className = '',
  ...props
}) => {
  const classNames = ['icon-btn', `icon-btn--${variant}`, `icon-btn--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classNames} aria-label={label} title={label} {...props}>
      {icon}
    </button>
  );
};

export default IconButton;
