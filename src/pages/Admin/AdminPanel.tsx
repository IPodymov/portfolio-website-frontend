import React, { useEffect, useState, useCallback } from 'react';
import { adminApi } from '../../api/admin';
import { reviewsApi } from '../../api/reviews';
import type { User, Project, Review, AdminStats, ProjectStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { StarRating } from '../../components/StarRating';
import { PROJECT_TYPE_LABELS, PROJECT_STATUS_OPTIONS } from '../../constants';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import FolderIcon from '@mui/icons-material/Folder';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildIcon from '@mui/icons-material/Build';
import DeleteIcon from '@mui/icons-material/Delete';
import './AdminPanel.css';

type TabType = 'dashboard' | 'users' | 'projects' | 'reviews';

const AdminPanel: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [usersData, projectsData, reviewsData] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getProjects(),
        reviewsApi.getAll(),
      ]);
      
      setUsers(usersData);
      setProjects(projectsData);
      setReviews(reviewsData);
      
      const pendingProjects = projectsData.filter(p => p.status === 'pending').length;
      const inProgressProjects = projectsData.filter(p => p.status === 'in_progress').length;
      const completedProjects = projectsData.filter(p => p.status === 'completed').length;
      
      setStats({
        totalUsers: usersData.length,
        totalProjects: projectsData.length,
        totalReviews: reviewsData.length,
        pendingProjects,
        completedProjects,
        inProgressProjects,
      });
    } catch (err) {
      console.error('Failed to load dashboard', err);
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadDashboard();
    }
  }, [user, loadDashboard]);

  const handleStatusChange = async (projectId: number, newStatus: ProjectStatus) => {
    try {
      await adminApi.updateProjectStatus(projectId, newStatus);
      setProjects(prev => 
        prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p)
      );
    } catch (err) {
      console.error('Failed to update status', err);
      setError('Не удалось обновить статус');
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) return;
    
    try {
      await adminApi.deleteReview(reviewId);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (err) {
      console.error('Failed to delete review', err);
      setError('Не удалось удалить отзыв');
    }
  };

  if (isLoading || user?.role !== 'admin') return null;

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
        {error && <div className="form-error">{error}</div>}
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && stats && (
              <div className="admin-dashboard">
                <h1 className="admin-page-title">Dashboard</h1>
                
                <div className="dashboard-stats">
                  <div className="stat-card stat-card--primary">
                    <div className="stat-card__icon"><PeopleIcon /></div>
                    <div className="stat-card__content">
                      <span className="stat-card__value">{stats.totalUsers}</span>
                      <span className="stat-card__label">Пользователей</span>
                    </div>
                  </div>
                  
                  <div className="stat-card stat-card--info">
                    <div className="stat-card__icon"><FolderIcon /></div>
                    <div className="stat-card__content">
                      <span className="stat-card__value">{stats.totalProjects}</span>
                      <span className="stat-card__label">Проектов</span>
                    </div>
                  </div>
                  
                  <div className="stat-card stat-card--warning">
                    <div className="stat-card__icon"><StarIcon /></div>
                    <div className="stat-card__content">
                      <span className="stat-card__value">{stats.totalReviews}</span>
                      <span className="stat-card__label">Отзывов</span>
                    </div>
                  </div>
                  
                  <div className="stat-card stat-card--success">
                    <div className="stat-card__icon"><TrendingUpIcon /></div>
                    <div className="stat-card__content">
                      <span className="stat-card__value">{stats.completedProjects}</span>
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
                        <span className="summary-card__value">{stats.pendingProjects}</span>
                        <span className="summary-card__label">Ожидают</span>
                      </div>
                    </div>
                    <div className="summary-card summary-card--progress">
                      <BuildIcon />
                      <div>
                        <span className="summary-card__value">{stats.inProgressProjects}</span>
                        <span className="summary-card__label">В работе</span>
                      </div>
                    </div>
                    <div className="summary-card summary-card--completed">
                      <CheckCircleIcon />
                      <div>
                        <span className="summary-card__value">{stats.completedProjects}</span>
                        <span className="summary-card__label">Завершены</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dashboard-recent">
                  <div className="dashboard-recent-section">
                    <h3 className="dashboard-section-title">Последние проекты</h3>
                    <div className="recent-list">
                      {projects.slice(0, 5).map(project => (
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
                      {reviews.slice(0, 5).map(review => (
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
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <td>{u.id}</td>
                          <td>{u.email}</td>
                          <td>{u.firstName} {u.lastName}</td>
                          <td><span className={`role-badge role-badge--${u.role}`}>{u.role}</span></td>
                          <td>{u.telegram || '-'}</td>
                          <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('ru-RU') : '-'}</td>
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
                      {projects.map(p => (
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
                            <button className="btn btn-sm btn-outline">Детали</button>
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
                      {reviews.map(r => (
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
    </div>
  );
};

export default AdminPanel;
