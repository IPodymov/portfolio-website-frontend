import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import type { CreateReviewRequest } from '../../types';
import { ServiceQuality } from '../../types';
import { authStore, reviewsStore, projectsStore } from '../../stores';
import { StarRating } from '../../components/StarRating';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SERVICE_QUALITY_OPTIONS, SERVICE_QUALITY_LABELS } from '../../constants';
import './Reviews.css';

const Reviews: React.FC = observer(() => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateReviewRequest>({
    body: '',
    projectLink: '',
    projectId: undefined,
    rating: 5,
    serviceQuality: ServiceQuality.EXCELLENT
  });
  const [submitting, setSubmitting] = useState(false);

  // Загружаем проекты пользователя для выбора в форме
  const completedProjects = projectsStore.myProjects.filter(p => p.status === 'completed');

  useEffect(() => {
    reviewsStore.loadReviews();
    if (authStore.isAuthenticated) {
      projectsStore.loadMyProjects();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const success = await reviewsStore.createReview(formData);
    
    if (success) {
      setShowForm(false);
      setFormData({
        body: '',
        projectLink: '',
        projectId: undefined,
        rating: 5,
        serviceQuality: ServiceQuality.EXCELLENT
      });
    }
    
    setSubmitting(false);
  };

  if (reviewsStore.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container">
      <div className="reviews__header">
        <h1 className="reviews__title">Отзывы клиентов</h1>
        {authStore.isAuthenticated && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Отмена' : 'Оставить отзыв'}
          </button>
        )}
      </div>

      {reviewsStore.error && <div className="form-error">{reviewsStore.error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="reviews__form card">
          <div className="form-group">
            <label className="form-label">Ваша оценка</label>
            <StarRating 
              rating={formData.rating} 
              interactive 
              onChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
              size="lg"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Качество обслуживания</label>
            <select
              value={formData.serviceQuality}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                serviceQuality: e.target.value as ServiceQuality
              }))}
              className="form-control"
            >
              {SERVICE_QUALITY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {completedProjects.length > 0 && (
            <div className="form-group">
              <label className="form-label">Выберите проект (опционально)</label>
              <select
                value={formData.projectId || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  projectId: e.target.value ? Number(e.target.value) : undefined
                }))}
                className="form-control"
              >
                <option value="">Без привязки к проекту</option>
                {completedProjects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.title || project.clientName} ({project.type})
                  </option>
                ))}
              </select>
              <span className="form-hint">Выбрав проект, вы покажете историю его разработки</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Ссылка на результат (опционально)</label>
            <input
              type="url"
              value={formData.projectLink}
              onChange={(e) => setFormData(prev => ({ ...prev, projectLink: e.target.value }))}
              className="form-control"
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ваш отзыв</label>
            <textarea
              value={formData.body}
              onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
              required
              className="form-control"
              rows={4}
              placeholder="Расскажите о вашем опыте..."
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Отправка...' : 'Отправить отзыв'}
          </button>
        </form>
      )}

      <div className="reviews__list">
        {reviewsStore.reviews.length === 0 ? (
          <p className="text-center">Отзывов пока нет</p>
        ) : (
          reviewsStore.reviews.map((review) => (
            <Link to={`/reviews/${review.id}`} key={review.id} className="review-card card">
              <div className="review-card__header">
                <div className="review-card__author">
                  {review.username || `${review.user?.firstName || ''} ${review.user?.lastName || ''}`.trim() || 'Аноним'}
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="review-card__content">{review.body}</p>
              <div className="review-card__footer">
                <span className="review-card__quality">
                  {SERVICE_QUALITY_LABELS[review.serviceQuality as ServiceQuality] || review.serviceQuality}
                </span>
                <span className="review-card__date">
                  {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
});

export default Reviews;
