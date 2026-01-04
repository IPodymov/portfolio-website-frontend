import React, { useState, useEffect } from 'react';
import './CookieConsent.css';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent-container">
      <div className="cookie-consent-content">
        <p>
          Мы используем файлы cookie для улучшения работы сайта и анализа трафика. 
          Продолжая использовать сайт, вы соглашаетесь с нашей{' '}
          <a href="/privacy" className="cookie-link">Политикой конфиденциальности</a>.
        </p>
        <button onClick={handleAccept} className="btn btn-primary cookie-btn">
          Хорошо
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
