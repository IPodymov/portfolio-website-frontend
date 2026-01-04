import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reviewsApi } from '../../api/reviews';
import type { Review } from '../../types';
import { useAuth } from '../../context/AuthContext';

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
        username: user.username,
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

      {/* Reviews DataGrid (Table) */}
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <div className="reviews-table-container">
          <table className="reviews-table">
            <thead className="reviews-table-header">
              <tr>
                <th className="reviews-th">Имя</th>
                <th className="reviews-th">Оценка</th>
                <th className="reviews-th">Отзыв</th>
                <th className="reviews-th">Проект</th>
                <th className="reviews-th">Действия</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="reviews-tr">
                  <td className="reviews-td">{review.username}</td>
                  <td className="reviews-td" style={{ color: '#FFD700' }}>
                    {'★'.repeat(review.rating || 0)}
                  </td>
                  <td className="reviews-td">
                    {review.body.length > 50 ? `${review.body.substring(0, 50)}...` : review.body}
                  </td>
                  <td className="reviews-td">
                    <a
                      href={review.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-accent">
                      Ссылка
                    </a>
                  </td>
                  <td className="reviews-td">
                    <Link to={`/reviews/${review.id}`} className="link-accent">
                      Подробнее
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reviews.length === 0 && <div className="reviews-empty">Нет отзывов</div>}
        </div>
      )}
    </div>
  );
};

export default Reviews;
