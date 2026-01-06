import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = 'Загрузка...', 
  size = 'md',
  fullPage = false 
}) => {
  return (
    <div className={`loading-spinner ${fullPage ? 'loading-spinner--full' : ''}`}>
      <div className={`loading-spinner__circle loading-spinner__circle--${size}`}></div>
      {text && <span className="loading-spinner__text">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
