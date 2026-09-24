export interface Review {
    _id: string;
  
    customer: {
      _id: string;
      name: string;
    };
  
    provider: string;
    service: string;
    booking: string;
  
    rating: number;
    comment?: string;
  
    createdAt: string;
    updatedAt: string;
}
  
export interface ReviewsResponse {
success: boolean;

summary: {
    averageRating: number;
    totalReviews: number;
};

reviews: Review[];
}


export interface CreateReviewsResponse {
  success: boolean;
  message: string;
  review: Review;
  }