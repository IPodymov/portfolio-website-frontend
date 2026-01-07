import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authStore, projectsStore, contactStore } from '../../stores';
import { PROJECT_TYPE_OPTIONS } from '../../constants';
import { ProjectType } from '../../types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import './Order.css';

const SUITABLE_FOR = [
  'Не хотите вникать в технические детали',
  'Доверяете эксперту принимать решения',
  'Хотите получить результат, а не процесс',
  'Цените скорость и качество',
];

const NOT_SUITABLE_FOR = [
  'Хотите участвовать в проектировании',
  'Требуете согласования каждого этапа',
  'Хотите контролировать стек и архитектуру',
  'Нужен аутсорс под ваше управление',
];

const PROCESS_STEPS = [
  { num: '01', title: 'Заявка', desc: 'Вы описываете задачу и желаемый результат' },
  { num: '02', title: 'Анализ', desc: 'Я анализирую требования и выбираю оптимальное решение' },
  { num: '03', title: 'Разработка', desc: 'Разрабатываю ПО полностью самостоятельно' },
  { num: '04', title: 'Передача', desc: 'Передаю готовый продукт + документацию' },
];

const DELIVERABLES = [
  { icon: <CodeIcon />, text: 'Готовое ПО и исходный код' },
  { icon: <DescriptionIcon />, text: 'Техническая документация' },
  { icon: <SecurityIcon />, text: 'Гарантия работоспособности' },
  { icon: <SpeedIcon />, text: 'Инструкции по запуску' },
];

const Order: React.FC = observer(() => {
  const [formData, setFormData] = useState({
    name: '',
    telegram: '',
    description: '',
    type: ProjectType.LANDING,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    projectsStore.clearError();
    contactStore.clearError();

    let success = false;

    if (authStore.isAuthenticated) {
      success = await projectsStore.createProject(formData);
    } else {
      success = await contactStore.sendMessage({
        name: formData.name,
        telegram: formData.telegram,
        message: `Тип проекта: ${
          PROJECT_TYPE_OPTIONS.find((o) => o.value === formData.type)?.label
        }\n\nОписание: ${formData.description}`,
      });
    }

    if (success) {
      setStatus('success');
      setFormData({ name: '', telegram: '', description: '', type: ProjectType.LANDING });
    } else {
      setStatus('error');
    }
  };

  const error = projectsStore.error || contactStore.error;

  if (status === 'success') {
    return (
      <div className="order-success">
        <div className="order-success__card">
          <div className="order-success__icon">✓</div>
          <h2 className="order-success__title">Заявка принята!</h2>
          <p className="order-success__text">
            Я изучу вашу задачу и свяжусь с вами в Telegram в течение 24 часов.
          </p>
          <button onClick={() => setStatus('idle')} className="btn btn-primary">
            Отправить ещё одну
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      {/* Hero Section */}
      <section className="order-hero">
        <div className="order-hero__content">
          <span className="order-hero__badge">Авторский формат</span>
          <h1 className="order-hero__title">
            Авторская разработка ПО
            <br />
            <span className="text-muted">без участия заказчика</span>
          </h1>
          <p className="order-hero__subtitle">
            Вы описываете задачу — все технические, архитектурные и UX-решения я принимаю сам.
            Никаких созвонов, согласований и бюрократии. Только результат.
          </p>
        </div>
      </section>

      <div className="order-container">
        {/* Suitability Section */}
        <section className="order-suitability">
          <div className="suitability-card suitability-card--positive">
            <h3 className="suitability-card__title">
              <CheckCircleIcon className="icon-success" />
              Подойдёт, если вы:
            </h3>
            <ul className="suitability-list">
              {SUITABLE_FOR.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="suitability-card suitability-card--negative">
            <h3 className="suitability-card__title">
              <CancelIcon className="icon-danger" />
              Не подойдёт, если вы:
            </h3>
            <ul className="suitability-list">
              {NOT_SUITABLE_FOR.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Process Section */}
        <section className="order-process">
          <h2 className="section-title">Как проходит работа</h2>
          <div className="process-steps">
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="process-step">
                <div className="process-step__num">{step.num}</div>
                <div className="process-step__content">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Deliverables */}
        <section className="order-deliverables">
          <h2 className="section-title">Что вы получаете</h2>
          <div className="deliverables-grid">
            {DELIVERABLES.map((item, i) => (
              <div key={i} className="deliverable-item">
                <div className="deliverable-icon">{item.icon}</div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Why This Format */}
        <section className="order-why">
          <blockquote className="order-quote">
            <p>
              Такой формат позволяет избежать затягивания сроков, спорных решений и лишней
              бюрократии. Проект выполняется быстрее и качественнее, потому что я беру
              ответственность за результат целиком.
            </p>
          </blockquote>
        </section>

        {/* Form Section */}
        <section className="order-form-section">
          <div className="order-form-card">
            <div className="order-form-header">
              <h2>Описать задачу</h2>
              <p>Расскажите, что должно делать ваше ПО</p>
            </div>

            {status === 'error' && error && <div className="form-error">{error}</div>}

            <form className="order-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Ваше имя</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-control"
                  disabled={status === 'loading'}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Telegram для связи</label>
                <input
                  type="text"
                  name="telegram"
                  value={formData.telegram}
                  onChange={handleChange}
                  required
                  placeholder="@username"
                  className="form-control"
                  disabled={status === 'loading'}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Тип проекта</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="form-control"
                  disabled={status === 'loading'}>
                  {PROJECT_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Описание задачи</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="form-control"
                  placeholder="Опишите основные требования и функционал..."
                  disabled={status === 'loading'}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={status === 'loading'}>
                {status === 'loading' ? 'Отправка...' : 'Отправить заявку'}
              </button>
            </form>

            <p className="order-form-legal">
              Все решения принимаются исполнителем. Вмешательство заказчика в процесс разработки не
              предусмотрено.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
});

export default Order;
