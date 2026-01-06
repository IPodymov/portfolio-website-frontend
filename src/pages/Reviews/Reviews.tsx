import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviewsApi } from '../../api/reviews';
import type { Review, CreateReviewRequest } from '../../types';
import { ServiceQuality } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StarRating } from '../../components/StarRating';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SERVICE_QUALITY_OPTIONS, SERVICE_QUALITY_LABELS } from '../../constants';
import './Reviews.css';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateReviewRequest>({
    body: '',
    projectLink: '',
    rating: 5,
    serviceQuality: ServiceQuality.EXCELLENT
  });
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await reviewsApi.getAll();
      setReviews(data);
    } catch {
      setError('Не удалось загрузить отзывы');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const newReview = await reviewsApi.create(formData);
      setReviews([newReview, ...reviews]);
      setShowForm(false);
      setFormData({
        body: '',
        projectLink: '',
        rating: 5,
        serviceQuality: ServiceQuality.EXCELLENT
      });
    } catch {
      setError('Не удалось отправить отзыв');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container">
      <div className="reviews__header">
        <h1 className="reviews__title">Отзывы клиентов</h1>
        {isAuthenticated && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Отмена' : 'Оставить отзыв'}
          </button>
        )}
      </div>

      {error && <div className="form-error">{error}</div>}

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

          <div className="form-group">
            <label className="form-label">Ссылка на проект (опционально)</label>
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
        {reviews.length === 0 ? (
          <p className="text-center">Отзывов пока нет</p>
        ) : (
          reviews.map((review) => (
            <Link to={`/reviews/${review.id}`} key={review.id} className="reviews__card card">
              <div className="reviews__card-header">
                <div className="reviews__card-author">
                  {review.username || `${review.user?.firstName || ''} ${review.user?.lastName || ''}`.trim() || 'Аноним'}
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="reviews__card-body">{review.body}</p>
              <div className="reviews__card-footer">
                <span className="reviews__card-quality">
                  {SERVICE_QUALITY_LABELS[review.serviceQuality as ServiceQuality] || review.serviceQuality}
                </span>
                <span className="reviews__card-date">
                  {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
