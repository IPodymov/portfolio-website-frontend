import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authStore, projectsStore, contactStore } from '../../stores';
import { PROJECT_TYPE_OPTIONS } from '../../constants';
import { ProjectType } from '../../types';
import './Order.css';

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
        <div className="order-success__card card">
          <h2 className="order-success__title">Заявка успешно отправлена!</h2>
          <p className="order-success__text">Я свяжусь с вами в ближайшее время.</p>
          <button onClick={() => setStatus('idle')} className="btn btn-primary">
            Отправить еще одну
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <h1 className="order-page__title">Заказать разработку ПО</h1>
      <div className="order-page__card card">
        {status === 'error' && error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
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
            className="btn btn-primary btn-block"
            disabled={status === 'loading'}>
            {status === 'loading' ? 'Отправка...' : 'Отправить заявку'}
          </button>
        </form>
      </div>
    </div>
  );
});

export default Order;
