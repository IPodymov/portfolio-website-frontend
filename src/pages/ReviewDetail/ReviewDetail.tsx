import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { reviewsApi } from '../../api/reviews';
import type { Review, ServiceQuality } from '../../types';
import { StarRating } from '../../components/StarRating';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SERVICE_QUALITY_LABELS } from '../../constants';
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

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-state">{error}</div>;
  if (!review) return <div className="error-state">Отзыв не найден</div>;

  const authorName = review.username || 
    `${review.user?.firstName || ''} ${review.user?.lastName || ''}`.trim() || 
    'Аноним';

  return (
    <div className="review-detail-container">
      <Link to="/reviews" className="back-link">
        &larr; Назад к отзывам
      </Link>

      <div className="review-detail-card">
        <div className="review-detail-header">
          <div>
            <div className="review-detail-author">{authorName}</div>
            {review.createdAt && (
              <div className="review-detail-date">
                {new Date(review.createdAt).toLocaleDateString('ru-RU')}
              </div>
            )}
          </div>
          <StarRating rating={review.rating} size="lg" />
        </div>

        {review.serviceQuality && (
          <div className="review-detail-meta">
            <span>
              Качество обслуживания: <strong>{SERVICE_QUALITY_LABELS[review.serviceQuality as ServiceQuality] || review.serviceQuality}</strong>
            </span>
          </div>
        )}

        <div className="review-detail-body">{review.body}</div>

        {review.projectLink && (
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
        )}
      </div>
    </div>
  );
};

export default ReviewDetail;
