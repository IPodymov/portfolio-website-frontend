import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import type { ProjectStatus, Project, User, UserRole } from '../../types';
import { authStore, adminStore } from '../../stores';
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
import './AdminPanel.css';

const USER_ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'user', label: 'Пользователь' },
  { value: 'moderator', label: 'Модератор' },
  { value: 'admin', label: 'Администратор' },
];

type TabType = 'dashboard' | 'users' | 'projects' | 'reviews';

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
    }
  }, []);

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

  if (authStore.isLoading || authStore.user?.role !== 'admin') return null;

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: <DashboardIcon /> },
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
    </div>
  );
});

export default AdminPanel;
