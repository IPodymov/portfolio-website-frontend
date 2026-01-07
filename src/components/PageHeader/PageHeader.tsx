import React from 'react';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  centered?: boolean;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  centered = false,
  className = '',
}) => {
  const classNames = ['page-header', centered && 'page-header--centered', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames}>
      <div className="page-header__content">
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {action && <div className="page-header__action">{action}</div>}
    </div>
  );
};

export default PageHeader;
