import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import type { ServiceQuality, ProjectStatus, ProjectType } from '../../types';
import { reviewsStore } from '../../stores';
import { StarRating } from '../../components/StarRating';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SERVICE_QUALITY_LABELS, PROJECT_TYPE_LABELS, PROJECT_STATUS_LABELS } from '../../constants';
import './ReviewDetail.css';

interface AccordionProps {
  title: string;
  icon: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  badge?: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, icon, defaultOpen = false, children, badge }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`accordion ${isOpen ? 'accordion--open' : ''}`}>
      <button 
        className="accordion__header" 
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <div className="accordion__title">
          <span className="accordion__icon">{icon}</span>
          <span>{title}</span>
          {badge}
        </div>
        <span className={`accordion__arrow ${isOpen ? 'accordion__arrow--open' : ''}`}>
          ▼
        </span>
      </button>
      <div className={`accordion__content ${isOpen ? 'accordion__content--open' : ''}`}>
        <div className="accordion__body">
          {children}
        </div>
      </div>
    </div>
  );
};

const ReviewDetail: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      reviewsStore.loadReviewById(Number(id));
    }
    return () => {
      reviewsStore.clearCurrentReview();
    };
  }, [id]);

  if (reviewsStore.isLoading) return <LoadingSpinner />;
  if (reviewsStore.error) return <div className="error-state">{reviewsStore.error}</div>;
  if (!reviewsStore.currentReview) return <div className="error-state">Отзыв не найден</div>;

  const review = reviewsStore.currentReview;
  const project = review.project;
  const githubCommits = review.githubCommits || [];
  
  const authorName = review.username || 
    `${review.user?.firstName || ''} ${review.user?.lastName || ''}`.trim() || 
    'Аноним';

  const getStatusClass = (status: ProjectStatus) => {
    switch (status) {
      case 'completed': return 'review-detail__status--completed';
      case 'in_progress': return 'review-detail__status--progress';
      case 'pending': return 'review-detail__status--pending';
      case 'cancelled': return 'review-detail__status--cancelled';
      default: return '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCommitDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="review-detail">
      <div className="review-detail__container">
        <Link to="/reviews" className="review-detail__back">
          ← Назад к отзывам
        </Link>

        <div className="review-detail__layout">
          {/* Левая колонка - Отзыв */}
          <div className="review-detail__left">
            <div className="review-detail__card">
              <div className="review-detail__header">
                <div className="review-detail__author">
                  <div className="review-detail__avatar">
                    {authorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="review-detail__author-info">
                    <span className="review-detail__name">{authorName}</span>
                    <span className="review-detail__date">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
                <StarRating rating={review.rating} size="lg" />
              </div>

              {review.serviceQuality && (
                <div className="review-detail__meta">
                  <span className="review-detail__quality-badge">
                    {SERVICE_QUALITY_LABELS[review.serviceQuality as ServiceQuality] || review.serviceQuality}
                  </span>
                </div>
              )}

              <div className="review-detail__content">{review.body}</div>

              {review.projectLink && (
                <div className="review-detail__link-section">
                  <span className="review-detail__link-label">Ссылка на результат:</span>
                  <a
                    href={review.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="review-detail__link"
                  >
                    {review.projectLink}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Правая колонка - Информация о проекте */}
          <div className="review-detail__right">
            {project ? (
              <div className="review-detail__accordions">
                {/* Основная информация */}
                <Accordion 
                  title="Информация о проекте" 
                  icon="📁" 
                  defaultOpen={true}
                  badge={
                    <span className={`review-detail__status ${getStatusClass(project.status)}`}>
                      {PROJECT_STATUS_LABELS[project.status]}
                    </span>
                  }
                >
                  <div className="accordion__project-info">
                    <div className="accordion__project-name">
                      {project.title || project.clientName}
                    </div>
                    
                    <div className="accordion__info-row">
                      <span className="accordion__info-label">Тип проекта</span>
                      <span className="accordion__info-value">
                        {PROJECT_TYPE_LABELS[project.type as ProjectType]}
                      </span>
                    </div>

                    {project.description && (
                      <div className="accordion__info-row accordion__info-row--column">
                        <span className="accordion__info-label">Описание</span>
                        <p className="accordion__description">{project.description}</p>
                      </div>
                    )}
                  </div>
                </Accordion>

                {/* Ссылки */}
                {(project.specLink || project.githubRepoLink) && (
                  <Accordion title="Материалы проекта" icon="🔗" defaultOpen={true}>
                    <div className="accordion__links">
                      {project.specLink && (
                        <a
                          href={project.specLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="accordion__link-item"
                        >
                          <span className="accordion__link-icon">📄</span>
                          <span className="accordion__link-text">Техническое задание</span>
                        </a>
                      )}
                      {project.githubRepoLink && (
                        <a
                          href={project.githubRepoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="accordion__link-item"
                        >
                          <span className="accordion__link-icon">💻</span>
                          <span className="accordion__link-text">GitHub репозиторий</span>
                        </a>
                      )}
                    </div>
                  </Accordion>
                )}

                {/* История изменений */}
                {project.history && project.history.length > 0 && (
                  <Accordion 
                    title="История разработки" 
                    icon="📜"
                    badge={<span className="accordion__count">{project.history.length}</span>}
                  >
                    <div className="accordion__timeline">
                      {[...project.history]
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((item) => {
                          const commitMatch = item.description.match(/^(.+?)\s*\(([a-f0-9]{7,})\)$/);
                          const isCommit = !!commitMatch;
                          
                          return (
                            <div key={item.id} className="accordion__timeline-item">
                              <div className={`accordion__timeline-dot ${isCommit ? 'accordion__timeline-dot--commit' : ''}`} />
                              <div className="accordion__timeline-content">
                                {isCommit && project.githubRepoLink ? (
                                  <a
                                    href={`${project.githubRepoLink}/commit/${commitMatch[2]}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="accordion__commit-link"
                                  >
                                    {commitMatch[1]}
                                    <span className="accordion__commit-sha">{commitMatch[2]}</span>
                                  </a>
                                ) : (
                                  <span className="accordion__timeline-text">{item.description}</span>
                                )}
                                <span className="accordion__timeline-date">
                                  {formatDate(item.createdAt)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </Accordion>
                )}

                {/* GitHub коммиты */}
                {githubCommits.length > 0 && (
                  <Accordion 
                    title="Последние коммиты" 
                    icon="💻"
                    badge={<span className="accordion__count">{githubCommits.length}</span>}
                  >
                    <div className="accordion__commits">
                      {githubCommits.slice(0, 10).map((commit) => (
                        <a
                          key={commit.sha}
                          href={commit.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="accordion__commit-item"
                        >
                          <div className="accordion__commit-main">
                            <span className="accordion__commit-message">{commit.message}</span>
                            <span className="accordion__commit-author">{commit.author}</span>
                          </div>
                          <div className="accordion__commit-meta">
                            <span className="accordion__commit-sha">{commit.sha.substring(0, 7)}</span>
                            <span className="accordion__commit-date">{formatCommitDate(commit.date)}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </Accordion>
                )}
              </div>
            ) : (
              <div className="review-detail__no-project">
                <div className="review-detail__no-project-card">
                  <span className="review-detail__no-project-icon">📋</span>
                  <p className="review-detail__no-project-text">
                    К этому отзыву не привязан проект
                  </p>
                  <span className="review-detail__no-project-hint">
                    Информация о проекте и история разработки отображаются только если автор выбрал проект при создании отзыва
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ReviewDetail;
