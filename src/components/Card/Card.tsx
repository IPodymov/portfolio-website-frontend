import React from 'react';
import './Card.css';

export type CardVariant = 'default' | 'bordered' | 'glass';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hover = false,
  padding = 'xl',
  className = '',
  onClick,
}) => {
  const classNames = [
    'card',
    `card--${variant}`,
    `card--padding-${padding}`,
    hover && 'card--hover',
    onClick && 'card--clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} onClick={onClick}>
      {children}
    </div>
  );
};

// Card Header
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`card__header ${className}`}>{children}</div>
);

// Card Body
interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => (
  <div className={`card__body ${className}`}>{children}</div>
);

// Card Footer
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`card__footer ${className}`}>{children}</div>
);

// Card Title
interface CardTitleProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, as: Tag = 'h3', className = '' }) => (
  <Tag className={`card__title ${className}`}>{children}</Tag>
);

export { Card, CardHeader, CardBody, CardFooter, CardTitle };
export default Card;
