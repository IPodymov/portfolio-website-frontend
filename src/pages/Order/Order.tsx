import React, { useState } from 'react';
import { ordersApi } from '../../api/orders';

const Order: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    type: 'landing' as const,
  });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ordersApi.create(formData);
      setStatus('success');
      setFormData({ name: '', email: '', description: '', type: 'landing' });
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center" style={{ padding: '2rem' }}>
        <h2 className="form-success">Заявка успешно отправлена!</h2>
        <p>Я свяжусь с вами в ближайшее время.</p>
        <button onClick={() => setStatus('idle')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Отправить еще одну
        </button>
      </div>
    );
  }

  return (
    <div className="container-md">
      <h1 className="mb-2">Заказать разработку ПО</h1>
      <div className="card">
        {status === 'error' && (
          <div className="form-error">Ошибка отправки. Попробуйте позже.</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Ваше имя</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Тип проекта</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="form-control">
              <option value="landing">Лендинг</option>
              <option value="ecommerce">Интернет-магазин</option>
              <option value="webapp">Веб-приложение</option>
              <option value="bot">Бот</option>
              <option value="other">Другое</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Описание задачи</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={5}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Отправить заявку
          </button>
        </form>
      </div>
    </div>
  );
};

export default Order;
