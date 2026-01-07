import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import type { ServiceQuality } from '../../types';
import { reviewsStore } from '../../stores';
import { StarRating } from '../../components/StarRating';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SERVICE_QUALITY_LABELS } from '../../constants';
import './ReviewDetail.css';

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
});

export default ReviewDetail;
