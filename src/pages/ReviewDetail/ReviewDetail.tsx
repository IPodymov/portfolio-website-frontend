import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { reviewsApi } from '../../api/reviews';
import type { Review } from '../../types';
import './ReviewDetail.css';

const ReviewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      reviewsApi
        .getById(Number(id))
        .then((data) => setReview(data))
        .catch((err) => {
          console.error(err);
          setError('Не удалось загрузить отзыв');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="loading-state">Загрузка...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!review) return <div className="error-state">Отзыв не найден</div>;

  return (
    <div className="review-detail-container">
      <Link to="/reviews" className="back-link">
        &larr; Назад к отзывам
      </Link>

      <div className="review-detail-card">
        <div className="review-detail-header">
          <div>
            <div className="review-detail-author">{review.username}</div>
            {review.createdAt && (
              <div className="review-detail-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
          <div className="review-detail-rating">
            {'★'.repeat(review.rating || 0)}
            <span style={{ color: '#e0e0e0' }}>{'★'.repeat(5 - (review.rating || 0))}</span>
          </div>
        </div>

        {review.serviceQuality && (
          <div className="review-detail-meta">
            <span>
              Качество обслуживания: <strong>{review.serviceQuality}</strong>
            </span>
          </div>
        )}

        <div className="review-detail-body">{review.body}</div>

        <div className="review-detail-project">
          <strong>Проект:</strong>
          <a
            href={review.projectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link">
            {review.projectLink}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
