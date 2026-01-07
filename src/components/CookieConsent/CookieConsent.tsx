import React from 'react';
import { observer } from 'mobx-react-lite';
import { cookieConsentStore } from '../../stores';
import './CookieConsent.css';

const CookieConsent: React.FC = observer(() => {
  if (!cookieConsentStore.isVisible) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-consent__content">
        <p className="cookie-consent__text">
          Мы используем файлы cookie для улучшения работы сайта и анализа трафика. Продолжая
          использовать сайт, вы соглашаетесь с нашей{' '}
          <a href="/privacy">Политикой конфиденциальности</a>.
        </p>
        <div className="cookie-consent__actions">
          <button
            onClick={() => cookieConsentStore.accept()}
            className="btn btn--primary cookie-consent__btn">
            Принять
          </button>
        </div>
      </div>
    </div>
  );
});

export default CookieConsent;
