import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from '../../stores';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import EmailIcon from '@mui/icons-material/Email';
import TelegramIcon from '@mui/icons-material/Telegram';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import './Profile.css';

const Profile: React.FC = observer(() => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    telegram: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authStore.isAuthenticated) {
      navigate('/login');
      return;
    }
    if (authStore.user) {
      setFormData({
        firstName: authStore.user.firstName || '',
        lastName: authStore.user.lastName || '',
        telegram: authStore.user.telegram || ''
      });
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await authStore.updateProfile(formData);
    
    if (result) {
      setSuccess('Профиль успешно обновлен');
      setIsEditing(false);
    } else {
      setError('Не удалось обновить профиль');
    }
    
    setLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Новый пароль должен быть не менее 6 символов');
      return;
    }

    setLoading(true);

    const result = await authStore.changePassword(
      passwordData.currentPassword,
      passwordData.newPassword
    );
    
    if (result.success) {
      setSuccess('Пароль успешно изменен');
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setError(result.error || 'Не удалось изменить пароль');
    }
    
    setLoading(false);
  };

  const getInitials = () => {
    const first = authStore.user?.firstName?.[0] || '';
    const last = authStore.user?.lastName?.[0] || '';
    return (first + last).toUpperCase() || '?';
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setIsChangingPassword(false);
    setError('');
    setSuccess('');
  };

  const handleStartPasswordChange = () => {
    setIsChangingPassword(true);
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Разрешены только изображения (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Максимальный размер файла — 5 МБ');
      return;
    }

    setAvatarLoading(true);
    setError('');
    setSuccess('');

    const result = await authStore.uploadAvatar(file);
    
    if (result.success) {
      setSuccess('Аватарка обновлена');
    } else {
      setError(result.error || 'Не удалось загрузить аватарку');
    }
    
    setAvatarLoading(false);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteAvatar = async () => {
    if (!authStore.user?.avatarUrl) return;
    
    if (!confirm('Удалить аватарку?')) return;
    
    setAvatarLoading(true);
    setError('');
    setSuccess('');

    const result = await authStore.deleteAvatar();
    
    if (result.success) {
      setSuccess('Аватарка удалена');
    } else {
      setError(result.error || 'Не удалось удалить аватарку');
    }
    
    setAvatarLoading(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
    setError('');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  if (!authStore.user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Card */}
        <div className="profile-card">
          {/* Header with Avatar */}
          <div className="profile-card__header">
            <div className="profile-avatar-wrapper">
              <div 
                className={`profile-avatar ${avatarLoading ? 'profile-avatar--loading' : ''}`}
                onClick={handleAvatarClick}
              >
                {authStore.user.avatarUrl ? (
                  <img 
                    src={authStore.user.avatarUrl} 
                    alt="Avatar" 
                    className="profile-avatar__image"
                  />
                ) : (
                  <span className="profile-avatar__initials">{getInitials()}</span>
                )}
                <div className="profile-avatar__overlay">
                  <CameraAltIcon />
                </div>
                {avatarLoading && (
                  <div className="profile-avatar__spinner" />
                )}
              </div>
              {authStore.user.avatarUrl && !avatarLoading && (
                <button 
                  className="profile-avatar__delete"
                  onClick={handleDeleteAvatar}
                  title="Удалить аватарку"
                >
                  <DeleteIcon />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleAvatarChange}
                className="profile-avatar__input"
              />
            </div>
            <div className="profile-header__info">
              <h1 className="profile-header__name">
                {authStore.user.firstName} {authStore.user.lastName}
              </h1>
              <span className="profile-header__role">{authStore.user.role}</span>
            </div>
            {!isEditing && !isChangingPassword && (
              <button 
                className="profile-header__edit-btn"
                onClick={handleStartEdit}
                title="Редактировать профиль"
              >
                <EditIcon />
              </button>
            )}
          </div>

          {/* Messages */}
          {error && <div className="profile-alert profile-alert--error">{error}</div>}
          {success && <div className="profile-alert profile-alert--success">{success}</div>}

          {/* Edit Profile Form */}
          {isEditing && (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="profile-form__grid">
                <div className="profile-form__group">
                  <label className="profile-form__label">Имя</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="profile-form__input"
                    disabled={loading}
                  />
                </div>
                <div className="profile-form__group">
                  <label className="profile-form__label">Фамилия</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="profile-form__input"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="profile-form__group">
                <label className="profile-form__label">Telegram</label>
                <input
                  type="text"
                  name="telegram"
                  value={formData.telegram}
                  onChange={handleChange}
                  placeholder="@username"
                  className="profile-form__input"
                  disabled={loading}
                />
              </div>
              <div className="profile-form__actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Отмена
                </button>
              </div>
            </form>
          )}

          {/* Change Password Form */}
          {isChangingPassword && (
            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <div className="profile-form__group">
                <label className="profile-form__label">Текущий пароль</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="profile-form__input"
                  disabled={loading}
                />
              </div>
              <div className="profile-form__group">
                <label className="profile-form__label">Новый пароль</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  className="profile-form__input"
                  disabled={loading}
                />
              </div>
              <div className="profile-form__group">
                <label className="profile-form__label">Подтвердите новый пароль</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="profile-form__input"
                  disabled={loading}
                />
              </div>
              <div className="profile-form__actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Сохранение...' : 'Изменить пароль'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Отмена
                </button>
              </div>
            </form>
          )}

          {/* Info List */}
          {!isEditing && !isChangingPassword && (
            <div className="profile-info">
              <div className="profile-info__item">
                <div className="profile-info__icon">
                  <EmailIcon />
                </div>
                <div className="profile-info__content">
                  <span className="profile-info__label">Email</span>
                  <span className="profile-info__value">{authStore.user.email}</span>
                </div>
              </div>

              <div className="profile-info__item">
                <div className="profile-info__icon">
                  <TelegramIcon />
                </div>
                <div className="profile-info__content">
                  <span className="profile-info__label">Telegram</span>
                  <span className="profile-info__value">
                    {authStore.user.telegram || 'Не указан'}
                  </span>
                </div>
              </div>

              <div className="profile-info__item">
                <div className="profile-info__icon">
                  <CalendarTodayIcon />
                </div>
                <div className="profile-info__content">
                  <span className="profile-info__label">Дата регистрации</span>
                  <span className="profile-info__value">
                    {authStore.user.createdAt 
                      ? new Date(authStore.user.createdAt).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })
                      : '-'}
                  </span>
                </div>
              </div>

              {/* Change Password Button */}
              <div className="profile-info__item profile-info__item--action" onClick={handleStartPasswordChange}>
                <div className="profile-info__icon profile-info__icon--action">
                  <LockIcon />
                </div>
                <div className="profile-info__content">
                  <span className="profile-info__label">Безопасность</span>
                  <span className="profile-info__value profile-info__value--link">Изменить пароль</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Profile;
