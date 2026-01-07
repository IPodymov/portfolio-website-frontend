import React from 'react';
import './Link.css';

export type LinkVariant = 'default' | 'accent' | 'muted';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LinkVariant;
  external?: boolean;
  children: React.ReactNode;
}

const Link: React.FC<LinkProps> = ({
  variant = 'default',
  external = false,
  children,
  className = '',
  ...props
}) => {
  const classNames = ['link', `link--${variant}`, className].filter(Boolean).join(' ');

  const externalProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <a className={classNames} {...externalProps} {...props}>
      {children}
      {external && (
        <svg
          className="link__external-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      )}
    </a>
  );
};

export default Link;
