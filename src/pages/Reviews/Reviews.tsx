import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reviewsApi } from '../../api/reviews';
import type { Review } from '../../types';
import { useAuth } from '../../context/AuthContext';
import './Reviews.css';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  // Form state
  const [newReview, setNewReview] = useState({
    body: '',
    projectLink: '',
    rating: 5,
    serviceQuality: 'Отлично',
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await reviewsApi.getAll();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await reviewsApi.create({
        username: user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email,
        body: newReview.body,
        projectLink: newReview.projectLink,
        rating: newReview.rating,
        serviceQuality: newReview.serviceQuality,
      });
      setSubmitStatus('success');
      setNewReview({ body: '', projectLink: '', rating: 5, serviceQuality: 'Отлично' });
      fetchReviews(); // Refresh list
    } catch {
      setSubmitStatus('error');
    }
  };

  return (
    <div>
      <h1 className="mb-2">Отзывы</h1>

      {/* Add Review Form */}
      {isAuthenticated ? (
        <div className="card mb-3">
          <h3>Оставить отзыв</h3>
          {submitStatus === 'success' && <div className="form-success">Отзыв добавлен!</div>}
          {submitStatus === 'error' && <div className="form-error">Ошибка добавления.</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Оценка</label>
              <div
                style={{ display: 'flex', gap: '0.5rem', fontSize: '1.5rem', cursor: 'pointer' }}
                onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    onMouseEnter={() => setHoverRating(star)}
                    style={{
                      color: star <= (hoverRating || newReview.rating) ? '#FFD700' : '#ccc',
                      transition: 'color 0.2s',
                    }}>
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Качество обслуживания</label>
              <select
                value={newReview.serviceQuality}
                onChange={(e) => setNewReview({ ...newReview, serviceQuality: e.target.value })}
                className="form-control">
                <option value="Отлично">Отлично</option>
                <option value="Хорошо">Хорошо</option>
                <option value="Нормально">Нормально</option>
                <option value="Плохо">Плохо</option>
                <option value="Ужасно">Ужасно</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Отзыв</label>
              <textarea
                value={newReview.body}
                onChange={(e) => setNewReview({ ...newReview, body: e.target.value })}
                required
                rows={3}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Ссылка на проект</label>
              <input
                type="url"
                value={newReview.projectLink}
                onChange={(e) => setNewReview({ ...newReview, projectLink: e.target.value })}
                required
                placeholder="https://example.com"
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Отправить
            </button>
          </form>
        </div>
      ) : (
        <div
          className="mb-2"
          style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <Link to="/login" className="link-accent">
            Войдите
          </Link>
          , чтобы оставить отзыв.
        </div>
      )}
      {/* Reviews Grid */}
      {loading ? (
        <div className="text-center py-5">Загрузка...</div>
      ) : (
        <>
          {reviews.length === 0 ? (
            <div className="reviews-empty">Нет отзывов</div>
          ) : (
            <div className="reviews-container">
              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <span className="review-author">{review.username}</span>
                    {review.createdAt && (
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="review-rating">
                    {'★'.repeat(review.rating || 0)}
                    <span style={{ color: '#e0e0e0' }}>{'★'.repeat(5 - (review.rating || 0))}</span>
                  </div>

                  {review.serviceQuality && (
                    <div className="review-quality">Качество: {review.serviceQuality}</div>
                  )}

                  <div className="review-body">
                    {review.body.length > 150 ? `${review.body.substring(0, 150)}...` : review.body}
                  </div>

                  <div className="review-footer">
                    <a
                      href={review.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="review-project-link">
                      🔗 Проект
                    </a>
                    <Link to={`/reviews/${review.id}`} className="review-more-link">
                      Подробнее
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reviews;
