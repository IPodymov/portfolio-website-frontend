import React from 'react';
import './Avatar.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const Avatar: React.FC<AvatarProps> = ({ src, alt, name, size = 'md', className = '' }) => {
  const classNames = ['avatar', `avatar--${size}`, className].filter(Boolean).join(' ');

  if (src) {
    return <img src={src} alt={alt || name || 'Avatar'} className={classNames} />;
  }

  if (name) {
    return (
      <div className={classNames}>
        <span className="avatar__initials">{getInitials(name)}</span>
      </div>
    );
  }

  return (
    <div className={classNames}>
      <svg
        className="avatar__placeholder"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );
};

export default Avatar;
