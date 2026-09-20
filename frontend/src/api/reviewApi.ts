import type { ReviewsResponse } from "@/types/review";

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