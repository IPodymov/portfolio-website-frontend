import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import type { ProjectStatus, Project, User, UserRole, ContactRequest, ContactRequestStatus } from '../../types';
import { authStore, adminStore, contactStore, notificationStore } from '../../stores';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { StarRating } from '../../components/StarRating';
import { PROJECT_TYPE_LABELS, PROJECT_STATUS_OPTIONS } from '../../constants';
import Modal from '../../components/Modal';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import FolderIcon from '@mui/icons-material/Folder';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildIcon from '@mui/icons-material/Build';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PersonIcon from '@mui/icons-material/Person';
import TelegramIcon from '@mui/icons-material/Telegram';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import './AdminPanel.css';

const USER_ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'user', label: 'Пользователь' },
  { value: 'moderator', label: 'Модератор' },
  { value: 'admin', label: 'Администратор' },
];

const CONTACT_STATUS_OPTIONS: { value: ContactRequestStatus; label: string }[] = [
  { value: 'pending', label: 'Ожидает' },
  { value: 'contacted', label: 'Связались' },
  { value: 'closed', label: 'Закрыто' },
];

type TabType = 'dashboard' | 'users' | 'projects' | 'reviews' | 'requests' | 'notifications';

interface EditUserForm {
  email: string;
  firstName: string;
  lastName: string;
  telegram: string;
  role: UserRole;
  password: string;
}

const AdminPanel: React.FC = observer(() => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [requestNotes, setRequestNotes] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState<ContactRequestStatus | ''>('');
  const [editUserForm, setEditUserForm] = useState<EditUserForm>({
    email: '',
    firstName: '',
    lastName: '',
    telegram: '',
    role: 'user',
    password: '',
  });
  const [isSavingUser, setIsSavingUser] = useState(false);

  useEffect(() => {
    if (!authStore.isLoading && authStore.user?.role !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (authStore.user?.role === 'admin') {
      adminStore.loadDashboard();
      contactStore.loadRequests();
      contactStore.loadStats();
      notificationStore.loadNotifications();
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'requests' && authStore.user?.role === 'admin') {
      contactStore.loadRequests(requestStatusFilter || undefined);
    }
  }, [activeTab, requestStatusFilter]);

  const handleStatusChange = async (projectId: number, newStatus: ProjectStatus) => {
    await adminStore.updateProjectStatus(projectId, newStatus);
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) return;
    await adminStore.deleteReview(reviewId);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUserForm({
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      telegram: user.telegram || '',
      role: user.role,
      password: '',
    });
  };

  const handleCloseUserModal = () => {
    setSelectedUser(null);
    setEditUserForm({
      email: '',
      firstName: '',
      lastName: '',
      telegram: '',
      role: 'user',
      password: '',
    });
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    
    setIsSavingUser(true);
    
    // Собираем только измененные поля
    const updateData: Record<string, string> = {};
    
    if (editUserForm.email !== selectedUser.email) {
      updateData.email = editUserForm.email;
    }
    if (editUserForm.firstName !== (selectedUser.firstName || '')) {
      updateData.firstName = editUserForm.firstName;
    }
    if (editUserForm.lastName !== (selectedUser.lastName || '')) {
      updateData.lastName = editUserForm.lastName;
    }
    if (editUserForm.telegram !== (selectedUser.telegram || '')) {
      updateData.telegram = editUserForm.telegram;
    }
    if (editUserForm.role !== selectedUser.role) {
      updateData.role = editUserForm.role;
    }
    // Пароль отправляем только если он заполнен (бэкенд захэширует)
    if (editUserForm.password.trim()) {
      updateData.password = editUserForm.password;
    }

    const success = await adminStore.updateUser(selectedUser.id, updateData);
    
    setIsSavingUser(false);
    
    if (success) {
      handleCloseUserModal();
    }
  };

  const handleOpenRequest = (request: ContactRequest) => {
    setSelectedRequest(request);
    setRequestNotes(request.adminNotes || '');
  };

  const handleCloseRequest = () => {
    setSelectedRequest(null);
    setRequestNotes('');
  };

  const handleRequestStatusChange = async (requestId: number, newStatus: ContactRequestStatus) => {
    await contactStore.updateRequestStatus(requestId, newStatus, requestNotes);
    // Обновляем selectedRequest если он открыт
    if (selectedRequest?.id === requestId) {
      setSelectedRequest(prev => prev ? { ...prev, status: newStatus, adminNotes: requestNotes } : null);
    }
    contactStore.loadStats();
  };

  const handleSaveRequestNotes = async () => {
    if (!selectedRequest) return;
    await contactStore.updateRequestStatus(selectedRequest.id, selectedRequest.status, requestNotes);
    setSelectedRequest(prev => prev ? { ...prev, adminNotes: requestNotes } : null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeClass = (status: ContactRequestStatus) => {
    switch (status) {
      case 'pending': return 'status-badge--pending';
      case 'contacted': return 'status-badge--in-progress';
      case 'closed': return 'status-badge--completed';
      default: return '';
    }
  };

  if (authStore.isLoading || authStore.user?.role !== 'admin') return null;

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'notifications' as TabType, label: 'Уведомления', icon: <NotificationsIcon />, badge: notificationStore.unreadCount || undefined },
    { id: 'requests' as TabType, label: 'Заявки', icon: <ContactMailIcon />, badge: contactStore.pendingCount },
    { id: 'users' as TabType, label: 'Пользователи', icon: <PeopleIcon /> },
    { id: 'projects' as TabType, label: 'Проекты', icon: <FolderIcon /> },
    { id: 'reviews' as TabType, label: 'Отзывы', icon: <StarIcon /> },
  ];

  return (
    <div className="admin-panel">
      {/* Mobile Tabs */}
      <div className="admin-mobile-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`admin-mobile-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge ? <span className="tab-badge">{tab.badge}</span> : null}
          </button>
        ))}
      </div>

      {/* Desktop Sidebar */}
      <div className="admin-sidebar">
        <h2 className="admin-sidebar__title">Админ панель</h2>
        <nav className="admin-sidebar__nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`admin-sidebar__link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge ? <span className="tab-badge">{tab.badge}</span> : null}
            </button>
          ))}
        </nav>
      </div>

      <div className="admin-main">
        {adminStore.error && <div className="form-error">{adminStore.error}</div>}
        
        {adminStore.isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && adminStore.stats && (
              <div className="admin-dashboard">
                <h1 className="admin-page-title">Dashboard</h1>
                
                <div className="dashboard-stats">
                  <div className="stat-card stat-card--primary">
                    <div className="stat-card__icon"><PeopleIcon /></div>
                    <div className="stat-card__content">
                      <span className="stat-card__value">{adminStore.stats.totalUsers}</span>
                      <span className="stat-card__label">Пользователей</span>
                    </div>
                  </div>
                  
                  <div className="stat-card stat-card--info">
                    <div className="stat-card__icon"><FolderIcon /></div>
                    <div className="stat-card__content">
                      <span className="stat-card__value">{adminStore.stats.totalProjects}</span>
                      <span className="stat-card__label">Проектов</span>
                    </div>
                  </div>
                  
                  <div className="stat-card stat-card--warning">
                    <div className="stat-card__icon"><StarIcon /></div>
                    <div className="stat-card__content">
                      <span className="stat-card__value">{adminStore.stats.totalReviews}</span>
                      <span className="stat-card__label">Отзывов</span>
                    </div>
                  </div>
                  
                  <div className="stat-card stat-card--success">
                    <div className="stat-card__icon"><TrendingUpIcon /></div>
                    <div className="stat-card__content">
                      <span className="stat-card__value">{adminStore.stats.completedProjects}</span>
                      <span className="stat-card__label">Завершено</span>
                    </div>
                  </div>
                </div>

                <div className="dashboard-projects-summary">
                  <h2 className="dashboard-section-title">Статус проектов</h2>
                  <div className="projects-summary-cards">
                    <div className="summary-card summary-card--pending">
                      <PendingIcon />
                      <div>
                        <span className="summary-card__value">{adminStore.stats.pendingProjects}</span>
                        <span className="summary-card__label">Ожидают</span>
                      </div>
                    </div>
                    <div className="summary-card summary-card--progress">
                      <BuildIcon />
                      <div>
                        <span className="summary-card__value">{adminStore.stats.inProgressProjects}</span>
                        <span className="summary-card__label">В работе</span>
                      </div>
                    </div>
                    <div className="summary-card summary-card--completed">
                      <CheckCircleIcon />
                      <div>
                        <span className="summary-card__value">{adminStore.stats.completedProjects}</span>
                        <span className="summary-card__label">Завершены</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dashboard-recent">
                  <div className="dashboard-recent-section">
                    <h3 className="dashboard-section-title">Последние проекты</h3>
                    <div className="recent-list">
                      {adminStore.projects.slice(0, 5).map(project => (
                        <div key={project.id} className="recent-item">
                          <div className="recent-item__info">
                            <span className="recent-item__name">{project.clientName}</span>
                            <span className="recent-item__type">{PROJECT_TYPE_LABELS[project.type]}</span>
                          </div>
                          <StatusBadge status={project.status} size="sm" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="dashboard-recent-section">
                    <h3 className="dashboard-section-title">Последние отзывы</h3>
                    <div className="recent-list">
                      {adminStore.reviews.slice(0, 5).map(review => (
                        <div key={review.id} className="recent-item">
                          <div className="recent-item__info">
                            <span className="recent-item__name">
                              {review.username || `${review.user?.firstName || ''} ${review.user?.lastName || ''}`.trim()}
                            </span>
                            <StarRating rating={review.rating} size="sm" />
                          </div>
                          <span className="recent-item__date">
                            {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="admin-content">
                <h1 className="admin-page-title">Пользователи</h1>
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Имя</th>
                        <th>Роль</th>
                        <th>Telegram</th>
                        <th>Дата регистрации</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminStore.users.map(u => (
                        <tr key={u.id}>
                          <td>{u.id}</td>
                          <td>{u.email}</td>
                          <td>{u.firstName} {u.lastName}</td>
                          <td><span className={`role-badge role-badge--${u.role}`}>{u.role}</span></td>
                          <td>{u.telegram || '-'}</td>
                          <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('ru-RU') : '-'}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline"
                              onClick={() => handleEditUser(u)}
                            >
                              <EditIcon fontSize="small" />
                              Редактировать
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="admin-content">
                <h1 className="admin-page-title">Проекты</h1>
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Клиент</th>
                        <th>Тип</th>
                        <th>Статус</th>
                        <th>Telegram</th>
                        <th>Дата</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminStore.projects.map(p => (
                        <tr key={p.id}>
                          <td>{p.id}</td>
                          <td>{p.clientName}</td>
                          <td>{PROJECT_TYPE_LABELS[p.type]}</td>
                          <td>
                            <select
                              value={p.status}
                              onChange={(e) => handleStatusChange(p.id, e.target.value as ProjectStatus)}
                              className="status-select"
                            >
                              {PROJECT_STATUS_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </td>
                          <td>{p.telegram}</td>
                          <td>{new Date(p.createdAt).toLocaleDateString('ru-RU')}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline"
                              onClick={() => setSelectedProject(p)}
                            >
                              Детали
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="admin-content">
                <h1 className="admin-page-title">Отзывы</h1>
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Автор</th>
                        <th>Рейтинг</th>
                        <th>Текст</th>
                        <th>Дата</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminStore.reviews.map(r => (
                        <tr key={r.id}>
                          <td>{r.id}</td>
                          <td>{r.username || `${r.user?.firstName || ''} ${r.user?.lastName || ''}`.trim()}</td>
                          <td><StarRating rating={r.rating} size="sm" /></td>
                          <td className="review-body-cell">{r.body.substring(0, 100)}...</td>
                          <td>{new Date(r.createdAt).toLocaleDateString('ru-RU')}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteReview(r.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Contact Requests Tab */}
            {activeTab === 'requests' && (
              <div className="admin-content">
                <h1 className="admin-page-title">Заявки на связь</h1>
                
                {/* Статистика заявок */}
                {contactStore.stats && (
                  <div className="dashboard-stats dashboard-stats--compact">
                    <div className="stat-card stat-card--small">
                      <div className="stat-card__content">
                        <span className="stat-card__value">{contactStore.stats.total}</span>
                        <span className="stat-card__label">Всего</span>
                      </div>
                    </div>
                    <div className="stat-card stat-card--small stat-card--warning">
                      <div className="stat-card__content">
                        <span className="stat-card__value">{contactStore.stats.pending}</span>
                        <span className="stat-card__label">Ожидают</span>
                      </div>
                    </div>
                    <div className="stat-card stat-card--small stat-card--info">
                      <div className="stat-card__content">
                        <span className="stat-card__value">{contactStore.stats.contacted}</span>
                        <span className="stat-card__label">Связались</span>
                      </div>
                    </div>
                    <div className="stat-card stat-card--small stat-card--success">
                      <div className="stat-card__content">
                        <span className="stat-card__value">{contactStore.stats.closed}</span>
                        <span className="stat-card__label">Закрыто</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Фильтр по статусу */}
                <div className="admin-filters">
                  <label className="admin-filter">
                    <span>Фильтр по статусу:</span>
                    <select
                      value={requestStatusFilter}
                      onChange={(e) => setRequestStatusFilter(e.target.value as ContactRequestStatus | '')}
                      className="form-select"
                    >
                      <option value="">Все заявки</option>
                      {CONTACT_STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </label>
                </div>

                {contactStore.isLoadingRequests ? (
                  <LoadingSpinner />
                ) : contactStore.requestsError ? (
                  <div className="form-error">{contactStore.requestsError}</div>
                ) : (
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Имя</th>
                          <th>Telegram</th>
                          <th>Сообщение</th>
                          <th>Статус</th>
                          <th>Пользователь</th>
                          <th>Дата</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contactStore.requests.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="admin-table__empty">
                              Заявок не найдено
                            </td>
                          </tr>
                        ) : (
                          contactStore.requests.map(request => (
                            <tr key={request.id} className={request.status === 'pending' ? 'row-highlight' : ''}>
                              <td>{request.id}</td>
                              <td>{request.name}</td>
                              <td>
                                <a 
                                  href={`https://t.me/${request.telegram.replace('@', '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="telegram-link"
                                >
                                  <TelegramIcon fontSize="small" />
                                  {request.telegram}
                                </a>
                              </td>
                              <td className="message-cell" title={request.message}>
                                {request.message.length > 50 
                                  ? request.message.substring(0, 50) + '...' 
                                  : request.message}
                              </td>
                              <td>
                                <select
                                  value={request.status}
                                  onChange={(e) => handleRequestStatusChange(request.id, e.target.value as ContactRequestStatus)}
                                  className={`status-select ${getStatusBadgeClass(request.status)}`}
                                >
                                  {CONTACT_STATUS_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                {request.user ? (
                                  <span className="user-badge">
                                    <PersonIcon fontSize="small" />
                                    {request.user.firstName || request.user.email}
                                  </span>
                                ) : (
                                  <span className="guest-badge">Гость</span>
                                )}
                              </td>
                              <td>{formatDate(request.createdAt)}</td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleOpenRequest(request)}
                                  title="Подробнее"
                                >
                                  <EditIcon fontSize="small" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="admin-content">
                <div className="admin-page-header">
                  <h1 className="admin-page-title">Уведомления</h1>
                  {notificationStore.unreadCount > 0 && (
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => notificationStore.markAllAsRead()}
                    >
                      <MarkEmailReadIcon fontSize="small" />
                      Прочитать все
                    </button>
                  )}
                </div>

                {notificationStore.isLoading ? (
                  <LoadingSpinner />
                ) : notificationStore.error ? (
                  <div className="form-error">{notificationStore.error}</div>
                ) : notificationStore.notifications.length === 0 ? (
                  <div className="admin-empty-state">
                    <NotificationsIcon className="admin-empty-state__icon" />
                    <p>Уведомлений пока нет</p>
                  </div>
                ) : (
                  <div className="notifications-list">
                    {notificationStore.notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${!notification.isRead ? 'notification-item--unread' : ''}`}
                      >
                        <div className="notification-item__content">
                          <div className="notification-item__icon">
                            <NotificationsIcon fontSize="small" />
                          </div>
                          <div className="notification-item__body">
                            <p className="notification-item__message">{notification.message}</p>
                            <span className="notification-item__date">
                              {formatDate(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                        {!notification.isRead && (
                          <button
                            className="btn btn-sm btn-ghost notification-item__action"
                            onClick={() => notificationStore.markAsRead(notification.id)}
                            title="Отметить как прочитанное"
                          >
                            <MarkEmailReadIcon fontSize="small" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Project Details Modal */}
      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={selectedProject ? `Детали проекта #${selectedProject.id}` : ''}
        footer={
          <button 
            className="btn btn-secondary"
            onClick={() => setSelectedProject(null)}
          >
            Закрыть
          </button>
        }
      >
        {selectedProject && (
          <div className="project-details">
            <div className="project-details__row">
              <span className="project-details__label">Клиент:</span>
              <span className="project-details__value">{selectedProject.clientName}</span>
            </div>
            <div className="project-details__row">
              <span className="project-details__label">Telegram:</span>
              <a 
                href={`https://t.me/${selectedProject.telegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="project-details__link"
              >
                {selectedProject.telegram}
              </a>
            </div>
            <div className="project-details__row">
              <span className="project-details__label">Тип проекта:</span>
              <span className="project-details__value">{PROJECT_TYPE_LABELS[selectedProject.type]}</span>
            </div>
            <div className="project-details__row">
              <span className="project-details__label">Статус:</span>
              <StatusBadge status={selectedProject.status} />
            </div>
            <div className="project-details__row">
              <span className="project-details__label">Дата создания:</span>
              <span className="project-details__value">
                {new Date(selectedProject.createdAt).toLocaleString('ru-RU')}
              </span>
            </div>
            {selectedProject.updatedAt && (
              <div className="project-details__row">
                <span className="project-details__label">Обновлён:</span>
                <span className="project-details__value">
                  {new Date(selectedProject.updatedAt).toLocaleString('ru-RU')}
                </span>
              </div>
            )}
            {selectedProject.githubRepoLink && (
              <div className="project-details__row">
                <span className="project-details__label">GitHub:</span>
                <a 
                  href={selectedProject.githubRepoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-details__link"
                >
                  {selectedProject.githubRepoLink}
                </a>
              </div>
            )}
            {selectedProject.specLink && (
              <div className="project-details__row">
                <span className="project-details__label">Спецификация:</span>
                <a 
                  href={selectedProject.specLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-details__link"
                >
                  {selectedProject.specLink}
                </a>
              </div>
            )}
            <div className="project-details__description">
              <span className="project-details__label">Описание:</span>
              <p className="project-details__text">{selectedProject.description || 'Описание отсутствует'}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={handleCloseUserModal}
        title={selectedUser ? `Редактирование пользователя #${selectedUser.id}` : ''}
        footer={
          <>
            <button 
              className="btn btn-secondary"
              onClick={handleCloseUserModal}
              disabled={isSavingUser}
            >
              Отмена
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleSaveUser}
              disabled={isSavingUser}
            >
              {isSavingUser ? 'Сохранение...' : 'Сохранить'}
            </button>
          </>
        }
      >
        {selectedUser && (
          <div className="edit-user-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={editUserForm.email}
                onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Имя</label>
                <input
                  type="text"
                  className="form-input"
                  value={editUserForm.firstName}
                  onChange={(e) => setEditUserForm({ ...editUserForm, firstName: e.target.value })}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Фамилия</label>
                <input
                  type="text"
                  className="form-input"
                  value={editUserForm.lastName}
                  onChange={(e) => setEditUserForm({ ...editUserForm, lastName: e.target.value })}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Telegram</label>
              <input
                type="text"
                className="form-input"
                value={editUserForm.telegram}
                onChange={(e) => setEditUserForm({ ...editUserForm, telegram: e.target.value })}
                placeholder="@username"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Роль</label>
              <select
                className="form-select"
                value={editUserForm.role}
                onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value as UserRole })}
              >
                {USER_ROLE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Новый пароль</label>
              <input
                type="password"
                className="form-input"
                value={editUserForm.password}
                onChange={(e) => setEditUserForm({ ...editUserForm, password: e.target.value })}
                placeholder="Оставьте пустым, чтобы не менять"
              />
              <span className="form-hint">Пароль будет захэширован на сервере</span>
            </div>

            {adminStore.error && (
              <div className="form-error">{adminStore.error}</div>
            )}
          </div>
        )}
      </Modal>

      {/* Contact Request Details Modal */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={handleCloseRequest}
        title={selectedRequest ? `Заявка #${selectedRequest.id}` : ''}
        footer={
          <>
            <button 
              className="btn btn-secondary"
              onClick={handleCloseRequest}
            >
              Закрыть
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleSaveRequestNotes}
            >
              Сохранить заметки
            </button>
          </>
        }
      >
        {selectedRequest && (
          <div className="request-details">
            <div className="request-details__header">
              <span className={`status-badge ${getStatusBadgeClass(selectedRequest.status)}`}>
                {CONTACT_STATUS_OPTIONS.find(o => o.value === selectedRequest.status)?.label}
              </span>
              <span className="request-details__date">{formatDate(selectedRequest.createdAt)}</span>
            </div>

            <div className="request-details__row">
              <span className="request-details__label">Имя:</span>
              <span className="request-details__value">{selectedRequest.name}</span>
            </div>

            <div className="request-details__row">
              <span className="request-details__label">Telegram:</span>
              <a 
                href={`https://t.me/${selectedRequest.telegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="request-details__link telegram-link"
              >
                <TelegramIcon fontSize="small" />
                {selectedRequest.telegram}
              </a>
            </div>

            {selectedRequest.user && (
              <div className="request-details__row">
                <span className="request-details__label">Пользователь:</span>
                <span className="request-details__value user-badge">
                  <PersonIcon fontSize="small" />
                  {selectedRequest.user.firstName} {selectedRequest.user.lastName}
                  {selectedRequest.user.email && <span className="user-email">({selectedRequest.user.email})</span>}
                </span>
              </div>
            )}

            <div className="request-details__message">
              <span className="request-details__label">Сообщение:</span>
              <div className="request-details__text">{selectedRequest.message}</div>
            </div>

            <div className="request-details__status">
              <span className="request-details__label">Изменить статус:</span>
              <select
                value={selectedRequest.status}
                onChange={(e) => handleRequestStatusChange(selectedRequest.id, e.target.value as ContactRequestStatus)}
                className={`form-select ${getStatusBadgeClass(selectedRequest.status)}`}
              >
                {CONTACT_STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {selectedRequest.handledBy && (
              <div className="request-details__row">
                <span className="request-details__label">Обработал:</span>
                <span className="request-details__value">
                  {selectedRequest.handledBy.firstName} {selectedRequest.handledBy.lastName}
                </span>
              </div>
            )}

            <div className="request-details__notes">
              <label className="request-details__label">Заметки администратора:</label>
              <textarea
                className="form-textarea"
                value={requestNotes}
                onChange={(e) => setRequestNotes(e.target.value)}
                placeholder="Добавьте заметки о взаимодействии с клиентом..."
                rows={4}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
});

export default AdminPanel;
