import React from 'react';
import './Contacts.css';

const Contacts: React.FC = () => {
  return (
    <div className="contacts-container">
      <h1 className="contacts-title">Контакты</h1>
      <div className="contacts-card">
        <p className="contacts-description">
          Свяжитесь со мной для обсуждения вашего проекта.
        </p>
        <ul className="contacts-list">
          <li className="contacts-item">
            <strong>Email:</strong> <a href="mailto:podymovv55@gmail.com" className="contacts-link">contact@ipodymov.com</a>
          </li>
          <li className="contacts-item">
            <strong>GitHub:</strong> <a href="https://github.com/IPodymov" target="_blank" rel="noopener noreferrer" className="contacts-link">github.com/IPodymov</a>
          </li>
          <li className="contacts-item">
            <strong>Telegram:</strong> <a href="https://t.me/ipodymov" target="_blank" rel="noopener noreferrer" className="contacts-link">@IPodymov</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Contacts;
