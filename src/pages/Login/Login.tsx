import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from '../../stores';
import './Login.css';

const Login: React.FC = observer(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    authStore.clearError();
    setLoading(true);
    
    const success = await authStore.loginUser({ email, password });
    
    if (success) {
      navigate('/');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__header">
          <h2 className="auth__title">Вход</h2>
          <p className="auth__subtitle">Войдите в свой аккаунт</p>
        </div>
        {authStore.error && <div className="form-error">{authStore.error}</div>}
        <form onSubmit={handleSubmit} className="auth__form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
              placeholder="example@mail.com"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <div className="auth__footer">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
});

export default Login;
