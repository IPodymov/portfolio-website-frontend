import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import './StarRating.css';

interface StarRatingProps {
  rating: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  interactive = false, 
  onChange,
  size = 'md'
}) => {
  const handleClick = (star: number) => {
    if (interactive && onChange) {
      onChange(star);
    }
  };

  return (
    <div className={`star-rating star-rating--${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        interactive ? (
          <button
            key={star}
            type="button"
            className="star-rating__btn"
            onClick={() => handleClick(star)}
          >
            {star <= rating ? <StarIcon /> : <StarBorderIcon />}
          </button>
        ) : (
          <span key={star} className="star-rating__star">
            {star <= rating ? <StarIcon /> : <StarBorderIcon />}
          </span>
        )
      ))}
    </div>
  );
};

export default StarRating;
