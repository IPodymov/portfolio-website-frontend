import React from 'react';
import './Divider.css';

interface DividerProps {
  children?: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const Divider: React.FC<DividerProps> = ({
  children,
  orientation = 'horizontal',
  className = '',
}) => {
  const classNames = [
    'divider',
    `divider--${orientation}`,
    children && 'divider--with-text',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (children) {
    return (
      <div className={classNames}>
        <span className="divider__text">{children}</span>
      </div>
    );
  }

  return <div className={classNames} />;
};

export default Divider;
