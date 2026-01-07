import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore, projectsStore } from '../../stores';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { StatusBadge } from '../../components/StatusBadge';
import { PROJECT_TYPE_LABELS } from '../../constants';
import EmailIcon from '@mui/icons-material/Email';
import TelegramIcon from '@mui/icons-material/Telegram';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import GitHubIcon from '@mui/icons-material/GitHub';
import DescriptionIcon from '@mui/icons-material/Description';
import HistoryIcon from '@mui/icons-material/History';
import './Profile.css';

const Profile: React.FC = observer(() => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
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
    // Ждём окончания проверки авторизации
    if (authStore.isLoading) return;
    
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
    // Загружаем проекты пользователя
    projectsStore.loadMyProjects();
  }, [navigate, authStore.isLoading, authStore.isAuthenticated]);

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

  if (authStore.isLoading || !authStore.user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Left Column - Profile Card */}
        <div className="profile-column profile-column--left">
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

        {/* Right Column - Projects */}
        <div className="profile-column profile-column--right">
          <div className="profile-projects">
          <div className="profile-projects__header">
            <FolderIcon className="profile-projects__icon" />
            <h2 className="profile-projects__title">Мои проекты</h2>
            <span className="profile-projects__count">{projectsStore.myProjects.length}</span>
          </div>

          {projectsStore.isLoading ? (
            <div className="profile-projects__loading">
              <LoadingSpinner />
            </div>
          ) : projectsStore.myProjects.length === 0 ? (
            <div className="profile-projects__empty">
              <p>У вас пока нет проектов</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/order')}
              >
                Заказать проект
              </button>
            </div>
          ) : (
            <div className="profile-projects__list">
              {projectsStore.myProjects.map(project => (
                <div key={project.id} className="profile-project">
                  <div 
                    className="profile-project__header"
                    onClick={() => setExpandedProjectId(
                      expandedProjectId === project.id ? null : project.id
                    )}
                  >
                    <div className="profile-project__main">
                      <span className="profile-project__type">
                        {PROJECT_TYPE_LABELS[project.type]}
                      </span>
                      <StatusBadge status={project.status} size="sm" />
                    </div>
                    <div className="profile-project__toggle">
                      {expandedProjectId === project.id ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </div>
                  </div>

                  {expandedProjectId === project.id && (
                    <div className="profile-project__details">
                      <div className="profile-project__info">
                        <div className="profile-project__row">
                          <span className="profile-project__label">Дата создания:</span>
                          <span className="profile-project__value">
                            {new Date(project.createdAt).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        {project.description && (
                          <div className="profile-project__row profile-project__row--full">
                            <span className="profile-project__label">Описание:</span>
                            <p className="profile-project__description">{project.description}</p>
                          </div>
                        )}

                        {/* Links */}
                        {(project.githubRepoLink || project.specLink) && (
                          <div className="profile-project__links">
                            {project.githubRepoLink && (
                              <a 
                                href={project.githubRepoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="profile-project__link"
                              >
                                <GitHubIcon />
                                <span>GitHub</span>
                              </a>
                            )}
                            {project.specLink && (
                              <a 
                                href={project.specLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="profile-project__link"
                              >
                                <DescriptionIcon />
                                <span>Спецификация</span>
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      {/* History Timeline */}
                      {project.history && project.history.length > 0 && (
                        <div className="profile-project__history">
                          <div className="profile-project__history-title">
                            <HistoryIcon />
                            <span>История проекта</span>
                          </div>
                          <div className="profile-project__timeline">
                            {[...project.history].sort((a, b) => 
                              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                            ).map((entry, index, sortedHistory) => {
                              // Проверяем, есть ли SHA коммита в описании (формат: "текст (abc1234)")
                              const commitMatch = entry.description.match(/^(.+?)\s*\(([a-f0-9]{7})\)$/);
                              const isCommit = commitMatch && project.githubRepoLink;
                              
                              return (
                                <div key={entry.id} className="profile-project__timeline-item">
                                  <div className={`profile-project__timeline-dot ${isCommit ? 'profile-project__timeline-dot--commit' : ''}`} />
                                  {index < sortedHistory.length - 1 && (
                                    <div className="profile-project__timeline-line" />
                                  )}
                                  <div className="profile-project__timeline-content">
                                    <span className="profile-project__timeline-date">
                                      {new Date(entry.createdAt).toLocaleDateString('ru-RU', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                    {isCommit && commitMatch ? (
                                      <p className="profile-project__timeline-text">
                                        {commitMatch[1]}{' '}
                                        <a 
                                          href={`${project.githubRepoLink}/commit/${commitMatch[2]}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="profile-project__commit-link"
                                        >
                                          ({commitMatch[2]})
                                        </a>
                                      </p>
                                    ) : (
                                      <p className="profile-project__timeline-text">{entry.description}</p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Profile;
