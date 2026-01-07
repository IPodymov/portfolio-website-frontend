import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import EmailIcon from '@mui/icons-material/Email';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';
import { contactStore, authStore } from '../../stores';
import './Contacts.css';

const Contacts: React.FC = observer(() => {
  const [formData, setFormData] = useState({
    name: '',
    telegram: '',
    specLink: '',
    message: '',
  });

  useEffect(() => {
    // Если пользователь авторизован, подтягиваем его данные
    if (authStore.isAuthenticated && authStore.user) {
      const fullName = `${authStore.user.firstName || ''} ${authStore.user.lastName || ''}`.trim();
      setFormData(prev => ({
        ...prev,
        name: fullName || prev.name,
        telegram: authStore.user?.telegram || prev.telegram,
      }));
    }
    
    return () => {
      contactStore.reset();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Формируем сообщение с ТЗ если указано
    const messageWithSpec = formData.specLink 
      ? `${formData.message}\n\n📋 Ссылка на ТЗ: ${formData.specLink}`
      : formData.message;
    
    const success = await contactStore.sendMessage({
      name: formData.name,
      telegram: formData.telegram,
      message: messageWithSpec,
    });
    if (success) {
      setFormData({ name: '', telegram: '', specLink: '', message: '' });
      setTimeout(() => contactStore.reset(), 3000);
    }
  };

  return (
    <div className="contacts-container">
      <div className="contacts-header">
        <h1 className="section-title">Свяжитесь со мной</h1>
        <p className="contacts-subtitle">
          Есть идея проекта или предложение о работе? Напишите мне, и мы обсудим детали. Я всегда
          открыт к новым возможностям и интересному сотрудничеству.
        </p>
      </div>

      <div className="contacts-content">
        <div className="contacts-info">
          <div className="contact-card">
            <div className="contact-icon">
              <EmailIcon fontSize="inherit" />
            </div>
            <h3>Email</h3>
            <p>Пишите в любое время</p>
            <a href="mailto:podymovv55@gmail.com" className="contact-link">
              podymovv55@gmail.com
            </a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">
              <TelegramIcon fontSize="inherit" />
            </div>
            <h3>Telegram</h3>
            <p>Быстрая связь в мессенджере</p>
            <a
              href="https://t.me/ipodymov"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link">
              @ipodymov
            </a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">
              <GitHubIcon fontSize="inherit" />
            </div>
            <h3>GitHub</h3>
            <p>Посмотрите мой код</p>
            <a
              href="https://github.com/IPodymov"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link">
              github.com/IPodymov
            </a>
          </div>
        </div>

        <div className="contacts-form-wrapper">
          <h2>Напишите мне</h2>
          <form className="contacts-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Ваше имя</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Иван Иванов"
                disabled={authStore.isAuthenticated && !!authStore.user?.firstName}
                className={authStore.isAuthenticated && authStore.user?.firstName ? 'input--prefilled' : ''}
              />
            </div>

            <div className="form-group">
              <label htmlFor="telegram">Telegram Username</label>
              <input
                type="text"
                id="telegram"
                name="telegram"
                value={formData.telegram}
                onChange={handleChange}
                required
                placeholder="@username"
                disabled={authStore.isAuthenticated && !!authStore.user?.telegram}
                className={authStore.isAuthenticated && authStore.user?.telegram ? 'input--prefilled' : ''}
              />
            </div>

            <div className="form-group">
              <label htmlFor="specLink">Ссылка на ТЗ (Google Docs)</label>
              <input
                type="url"
                id="specLink"
                name="specLink"
                value={formData.specLink}
                onChange={handleChange}
                placeholder="https://docs.google.com/document/d/..."
              />
              <span className="form-hint">Необязательно. Если у вас есть готовое техническое задание.</span>
            </div>

            <div className="form-group">
              <label htmlFor="message">Сообщение</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Расскажите о вашем проекте..."
                rows={5}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={contactStore.isSubmitting}>
              {contactStore.isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
            </button>

            {contactStore.isSuccess && (
              <div className="success-message">Спасибо! Ваше сообщение отправлено.</div>
            )}

            {contactStore.error && <div className="error-message">{contactStore.error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
});

export default Contacts;
