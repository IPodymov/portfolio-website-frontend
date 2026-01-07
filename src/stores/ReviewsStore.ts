import { makeAutoObservable, runInAction } from 'mobx';
import type { Review, CreateReviewRequest } from '../types';
import api from './api';

class ReviewsStore {
  reviews: Review[] = [];
  currentReview: Review | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadReviews() {
    this.isLoading = true;
    this.error = null;
    
    try {
      const response = await api.get<Review[]>('/reviews');
      runInAction(() => {
        this.reviews = response.data;
      });
    } catch {
      runInAction(() => {
        this.error = 'Не удалось загрузить отзывы';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadReviewById(id: number) {
    this.isLoading = true;
    this.error = null;
    this.currentReview = null;
    
    try {
      const response = await api.get<Review>(`/reviews/${id}`);
      runInAction(() => {
        this.currentReview = response.data;
      });
    } catch {
      runInAction(() => {
        this.error = 'Не удалось загрузить отзыв';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async createReview(data: CreateReviewRequest): Promise<boolean> {
    this.error = null;
    
    try {
      const response = await api.post<Review>('/reviews', data);
      runInAction(() => {
        this.reviews = [response.data, ...this.reviews];
      });
      return true;
    } catch {
      runInAction(() => {
        this.error = 'Не удалось отправить отзыв';
      });
      return false;
    }
  }

  async deleteReview(id: number): Promise<boolean> {
    this.error = null;
    
    try {
      await api.delete(`/reviews/${id}`);
      runInAction(() => {
        this.reviews = this.reviews.filter(r => r.id !== id);
      });
      return true;
    } catch {
      runInAction(() => {
        this.error = 'Не удалось удалить отзыв';
      });
      return false;
    }
  }

  clearError() {
    this.error = null;
  }

  clearCurrentReview() {
    this.currentReview = null;
  }
}

export const reviewsStore = new ReviewsStore();
