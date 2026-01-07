import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from '../../stores';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import HistoryIcon from '@mui/icons-material/History';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LockIcon from '@mui/icons-material/Lock';
import './Home.css';

const WHY_REGISTER = [
  {
    icon: <VisibilityIcon />,
    title: 'Прозрачность',
    desc: 'Вы видите каждый этап разработки и текущий статус проекта',
  },
  {
    icon: <FactCheckIcon />,
    title: 'Контроль',
    desc: 'Все задачи, сроки и результаты фиксируются в системе',
  },
  {
    icon: <HistoryIcon />,
    title: 'История проекта',
    desc: 'Вся переписка, версии и изменения сохраняются',
  },
  {
    icon: <PhoneDisabledIcon />,
    title: 'Без созвонов',
    desc: 'Нет необходимости уточнять статус — всё видно в кабинете',
  },
];

const PROCESS_STEPS = [
  { num: '01', title: 'Анализ задачи', status: 'completed' },
  { num: '02', title: 'Проектирование', status: 'completed' },
  { num: '03', title: 'Разработка', status: 'in-progress' },
  { num: '04', title: 'Тестирование', status: 'pending' },
  { num: '05', title: 'Готово', status: 'pending' },
];

const HOW_IT_WORKS = [
  'Вы регистрируетесь на платформе',
  'Создаёте запрос или проект',
  'Получаете доступ к этапам разработки',
  'Наблюдаете за прогрессом в реальном времени',
  'Получаете готовый результат',
];

const SUITABLE_FOR = [
  'Тем, кто ценит прозрачность процесса',
  'Тем, кто не хочет постоянных уточнений',
  'Стартапам и бизнесу без in-house IT',
  'Тем, кто доверяет экспертам',
];

const NOT_SUITABLE_FOR = [
  'Тем, кто хочет обсуждать каждый шаг в чатах',
  'Тем, кто не готов делегировать процесс',
];

const Home: React.FC = observer(() => {
  const isLoggedIn = authStore.isAuthenticated;

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="home__hero">
        <div className="home__hero-content">
          <span className="home__hero-badge">Платформа для клиентов</span>
          <h1 className="home__hero-title">
            Прозрачная разработка ПО
            <br />
            <span className="text-accent">с отслеживанием каждого этапа</span>
          </h1>
          <p className="home__hero-subtitle">
            Зарегистрируйтесь на платформе и наблюдайте за процессом разработки в реальном времени —
            от идеи до релиза.
          </p>
          <div className="home__hero-actions">
            {isLoggedIn ? (
              <Link to="/profile" className="btn btn-primary btn-lg">
                Перейти в личный кабинет
              </Link>
            ) : (
              <Link to="/register" className="btn btn-primary btn-lg">
                Зарегистрироваться и отслеживать проект
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Why Register Section */}
      <section className="home__why-register">
        <div className="home__container">
          <h2 className="section-title">Зачем нужна регистрация на платформе?</h2>
          <div className="why-register-grid">
            {WHY_REGISTER.map((item, index) => (
              <div className="why-card" key={index}>
                <div className="why-card__icon">{item.icon}</div>
                <h3 className="why-card__title">{item.title}</h3>
                <p className="why-card__desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Preview Section */}
      <section className="home__preview">
        <div className="home__container">
          <h2 className="section-title">Как выглядит работа внутри платформы</h2>
          <p className="section-subtitle">
            Каждый этап имеет статус и описание, доступное зарегистрированному пользователю
          </p>
          <div className="preview-timeline">
            {PROCESS_STEPS.map((step, index) => (
              <div key={index} className={`timeline-step timeline-step--${step.status}`}>
                <div className="timeline-step__marker">
                  {step.status === 'completed' && <CheckCircleIcon />}
                  {step.status === 'in-progress' && <span className="pulse-dot"></span>}
                  {step.status === 'pending' && <span className="empty-dot"></span>}
                </div>
                <div className="timeline-step__content">
                  <span className="timeline-step__num">{step.num}</span>
                  <span className="timeline-step__title">{step.title}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="preview-note">* Пример отображения этапов проекта в личном кабинете</p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="home__how-it-works">
        <div className="home__container">
          <h2 className="section-title">Как начинается работа</h2>
          <div className="steps-list">
            {HOW_IT_WORKS.map((step, index) => (
              <div key={index} className="step-item">
                <div className="step-item__num">{index + 1}</div>
                <p className="step-item__text">{step}</p>
              </div>
            ))}
          </div>
          <p className="steps-note">Регистрация — это начало пути, а не обязательство платить.</p>
        </div>
      </section>

      {/* Trust Block */}
      <section className="home__trust">
        <div className="home__container">
          <div className="trust-badges">
            <div className="trust-badge">
              <LockIcon />
              <span>Регистрация не обязывает к оплате</span>
            </div>
            <div className="trust-badge">
              <LockIcon />
              <span>Вы можете просто посмотреть, как устроен процесс</span>
            </div>
            <div className="trust-badge">
              <LockIcon />
              <span>Все данные защищены</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mid CTA */}
      <section className="home__mid-cta">
        <div className="home__container">
          <h2>Хотите видеть, как будет вестись ваш проект?</h2>
          {!isLoggedIn && (
            <Link to="/register" className="btn btn-primary btn-lg">
              Создать аккаунт и посмотреть изнутри
            </Link>
          )}
          {isLoggedIn && (
            <Link to="/profile" className="btn btn-primary btn-lg">
              Перейти в личный кабинет
            </Link>
          )}
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="home__suitability">
        <div className="home__container">
          <h2 className="section-title">Кому подойдёт платформа</h2>
          <div className="suitability-grid">
            <div className="suitability-card suitability-card--positive">
              <h3>
                <CheckCircleIcon className="icon-success" />
                Подойдёт
              </h3>
              <ul>
                {SUITABLE_FOR.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="suitability-card suitability-card--negative">
              <h3>
                <CancelIcon className="icon-danger" />
                Не подойдёт
              </h3>
              <ul>
                {NOT_SUITABLE_FOR.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section (Brief) */}
      <section className="home__expertise">
        <div className="home__container">
          <div className="expertise-content">
            <h3>Профессиональная разработка</h3>
            <p>
              Разработка ведётся профессионально, с фиксированными этапами и ответственностью за
              результат. Современный стек: React, Node.js, TypeScript, PostgreSQL.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="home__final-cta">
        <div className="home__container">
          <h2>Начните с регистрации — дальше вы сами решите</h2>
          <p>Посмотрите, как устроена работа, и примите решение без давления</p>
          {!isLoggedIn && (
            <Link to="/register" className="btn btn-primary btn-lg">
              Зарегистрироваться и посмотреть процесс
            </Link>
          )}
          {isLoggedIn && (
            <Link to="/profile" className="btn btn-primary btn-lg">
              Перейти в личный кабинет
            </Link>
          )}
        </div>
      </section>
    </div>
  );
});

export default Home;
