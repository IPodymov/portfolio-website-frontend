import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import TelegramIcon from '@mui/icons-material/Telegram';
import './Profile.css';

const Profile: React.FC = () => {
  const { user, refreshUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    telegram: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        telegram: user.telegram || ''
      });
    }
  }, [user, isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authApi.updateProfile(formData);
      await refreshUser();
      setSuccess('Профиль успешно обновлен');
      setIsEditing(false);
    } catch {
      setError('Не удалось обновить профиль');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="profile-page">
      <div className="profile">
        <div className="profile__header">
          <div className="profile__avatar">
            <PersonIcon />
          </div>
          <h1 className="profile__name">{user.firstName} {user.lastName}</h1>
          <span className="profile__role">{user.role}</span>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile__form card">
            <div className="form-group">
              <label className="form-label">Имя</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="form-control"
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
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Telegram</label>
              <input
                type="text"
                name="telegram"
                value={formData.telegram}
                onChange={handleChange}
                placeholder="@username"
                className="form-control"
                disabled={loading}
              />
            </div>
            <div className="profile__form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Отмена
              </button>
            </div>
          </form>
        ) : (
          <div className="profile__info card">
            <div className="profile__info-item">
              <EmailIcon />
              <span>{user.email}</span>
            </div>
            {user.telegram && (
              <div className="profile__info-item">
                <TelegramIcon />
                <span>{user.telegram}</span>
              </div>
            )}
            <div className="profile__info-item">
              <span className="profile__info-label">Дата регистрации:</span>
              <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : '-'}</span>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Редактировать профиль
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
