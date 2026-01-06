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
    <div className="cookie-consent">
      <div className="cookie-consent__content">
        <p className="cookie-consent__text">
          Мы используем файлы cookie для улучшения работы сайта и анализа трафика. 
          Продолжая использовать сайт, вы соглашаетесь с нашей{' '}
          <a href="/privacy" className="cookie-consent__link">Политикой конфиденциальности</a>.
        </p>
        <button onClick={handleAccept} className="btn btn-primary cookie-consent__button">
          Хорошо
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
