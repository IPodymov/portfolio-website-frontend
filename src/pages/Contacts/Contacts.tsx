import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import EmailIcon from '@mui/icons-material/Email';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { contactStore, authStore } from '../../stores';
import './Contacts.css';

const BENEFITS = [
  'Разработка строго по ТЗ и в срок',
  'Помощь с составлением технического задания',
  'Чистый код и современный стек (React, Node.js)',
  'Поддержка и консультации после запуска',
];

const FAQS = [
  {
    q: 'Сколько стоит разработка?',
    a: 'Стоимость зависит от сложности проекта. После анализа вашего ТЗ я подготовлю подробную смету.',
  },
  {
    q: 'Что если у меня нет готового ТЗ?',
    a: 'Не проблема! Напишите свои идеи в поле "Сообщение", и мы вместе составим структуру проекта.',
  },
  {
    q: 'Как быстро вы отвечаете?',
    a: 'Обычно я отвечаю в течение 2-4 часов в рабочее время.',
  },
];

const Contacts: React.FC = observer(() => {
  const [formData, setFormData] = useState({
    name: '',
    telegram: '',
    specLink: '',
    message: '',
  });

  useEffect(() => {
    if (authStore.isAuthenticated && authStore.user) {
      const fullName = `${authStore.user.firstName || ''} ${authStore.user.lastName || ''}`.trim();
      setFormData((prev) => ({
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
    <div className="contacts-page">
      <div className="contacts-container">
        <div className="contacts-grid">
          {/* Left Column: Value Proposition & Info */}
          <div className="contacts-left">
            <header className="contacts-hero">
              <h1 className="contacts-title">Закажите разработку сайта под ваш ТЗ</h1>
              <p className="contacts-subtitle">
                Бесплатно проконсультирую и оценю стоимость проекта. Оставьте заявку, и мы превратим
                вашу идею в работающий бизнес-инструмент.
              </p>
            </header>

            <section className="contacts-benefits">
              <h3 className="section-label">Почему стоит работать со мной</h3>
              <ul className="benefits-list">
                {BENEFITS.map((benefit, index) => (
                  <li key={index} className="benefit-item">
                    <CheckCircleOutlineIcon className="benefit-icon" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="contacts-faq">
              <h3 className="section-label">Частые вопросы</h3>
              <div className="faq-list">
                {FAQS.map((item, index) => (
                  <div key={index} className="faq-item">
                    <div className="faq-question">
                      <HelpOutlineIcon fontSize="small" className="faq-icon" />
                      {item.q}
                    </div>
                    <p className="faq-answer">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="contacts-socials">
              <h3 className="section-label">Другие способы связи</h3>
              <div className="social-links">
                <a
                  href="https://t.me/ipodymov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link">
                  <TelegramIcon />
                  <span>Telegram</span>
                </a>
                <a href="mailto:podymovv55@gmail.com" className="social-link">
                  <EmailIcon />
                  <span>Email</span>
                </a>
                <a
                  href="https://github.com/IPodymov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link">
                  <GitHubIcon />
                  <span>GitHub</span>
                </a>
              </div>
            </section>
          </div>

          {/* Right Column: Key Action Form */}
          <div className="contacts-right">
            <div className="contacts-form-card">
              <div className="form-header">
                <h2>Оставить запрос</h2>
                <p>Заполните форму, чтобы получить смету</p>
              </div>

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
                    placeholder="Как к вам обращаться?"
                    disabled={authStore.isAuthenticated && !!authStore.user?.firstName}
                    className={
                      authStore.isAuthenticated && authStore.user?.firstName
                        ? 'input--prefilled'
                        : ''
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telegram">Telegram для связи</label>
                  <input
                    type="text"
                    id="telegram"
                    name="telegram"
                    value={formData.telegram}
                    onChange={handleChange}
                    required
                    placeholder="@username"
                    disabled={authStore.isAuthenticated && !!authStore.user?.telegram}
                    className={
                      authStore.isAuthenticated && authStore.user?.telegram
                        ? 'input--prefilled'
                        : ''
                    }
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
                    placeholder="https://docs.google.com/..."
                  />
                  <span className="form-hint">Если есть готовое задание</span>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Описание задачи</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Опишите суть проекта, функционал и цели..."
                    rows={6}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg"
                  disabled={contactStore.isSubmitting}>
                  {contactStore.isSubmitting ? 'Отправка...' : 'Получить консультацию'}
                </button>

                {contactStore.isSuccess && (
                  <div className="success-message">
                    <strong>Заявка принята!</strong> Скоро я напишу вам в Telegram.
                  </div>
                )}

                {contactStore.error && <div className="error-message">{contactStore.error}</div>}

                <p className="form-privacy">
                  Нажимая кнопку, вы соглашаетесь с политкой конфиденциальности. Ваши данные
                  защищены.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Contacts;
