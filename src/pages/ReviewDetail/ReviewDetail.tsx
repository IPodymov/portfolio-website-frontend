import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { reviewsApi } from '../../api/reviews';
import type { Review } from '../../types';

const ReviewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      reviewsApi.getById(Number(id))
        .then(data => setReview(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div>Загрузка...</div>;
  if (!review) return <div>Отзыв не найден</div>;

  return (
    <div className="container-sm">
      <Link to="/reviews" className="link-accent">
        &larr; Назад к отзывам
      </Link>
      <div className="card mt-2">
        <h1 className="mb-2">Отзыв от {review.username}</h1>
        <div className="mb-2">
          {review.body}
        </div>
        <div>
          <strong>Выполненный проект: </strong>
          <a href={review.projectLink} target="_blank" rel="noopener noreferrer" className="link-accent">
            {review.projectLink}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
