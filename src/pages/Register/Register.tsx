import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from '../../stores';
import './Register.css';

const Register: React.FC = observer(() => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    telegram: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    authStore.clearError();
    setLoading(true);
    
    const success = await authStore.registerUser(formData);
    
    if (success) {
      navigate('/');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__header">
          <h2 className="auth__title">Регистрация</h2>
          <p className="auth__subtitle">Создайте аккаунт для доступа к функциям</p>
        </div>
        {authStore.error && <div className="form-error">{authStore.error}</div>}
        <form onSubmit={handleSubmit} className="auth__form">
          <div className="auth__form-row">
            <div className="form-group">
              <label className="form-label">Имя</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="form-control"
                placeholder="Иван"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Фамилия</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="form-control"
                placeholder="Иванов"
                disabled={loading}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="example@mail.com"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Telegram
              <span className="form-hint"> (обязательно для отслеживания вашего проекта)</span>
            </label>
            <input
              type="text"
              name="telegram"
              value={formData.telegram}
              onChange={handleChange}
              placeholder="@username"
              className="form-control"
              disabled={loading}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Пароль</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        <div className="auth__footer">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </div>
    </div>
  );
});

export default Register;
