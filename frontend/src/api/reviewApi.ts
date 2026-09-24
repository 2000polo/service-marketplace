import type { CreateReviewsResponse, Review, ReviewsResponse } from "@/types/review";

interface ServiceReview {
  bookingId: string;
  rating: number;
  comment: string;
}

interface BookingReview {
  success: true,
  review: Review
}

const API_URL = import.meta.env.VITE_API_URL;

export const getServiceReviews = async (
  serviceId: string
): Promise<ReviewsResponse> => {
  const response = await fetch(
    `${API_URL}/reviews/service/${serviceId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  const data: ReviewsResponse =
    await response.json();

  return data;
};

export const createServiceReview = async (
  reviewData: ServiceReview,
  token: string
): Promise<CreateReviewsResponse> => {
  const response = await fetch(
    `${API_URL}/reviews`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      method: 'POST',
      body: JSON.stringify(reviewData),
    }
  );

  const data: CreateReviewsResponse = await response.json();

  console.log("data", data)

  if (!response.ok) {
    console.log(response)
    throw new Error(data.message);
  }

  return data;
};

// Get booking reviews---
export const getBookingReview = async (
  bookingId: string,
  token: string,
): Promise<BookingReview> => {

  const response = await fetch(`${API_URL}/reviews/booking/${bookingId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
        data.message || "Registration failed"
    );
  }

  return data;
}