import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import type { Review } from "@/types/review";
import { getServiceReviews } from "@/api/reviewApi";

interface ServiceReviewsProps {
  serviceId: string;
}

const ServiceReviews = ({
  serviceId,
}: ServiceReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const [averageRating, setAverageRating] =
    useState(0);

  const [totalReviews, setTotalReviews] =
    useState(0);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data =
          await getServiceReviews(serviceId);

        setReviews(data.reviews);
        setAverageRating(
          data.summary.averageRating
        );
        setTotalReviews(
          data.summary.totalReviews
        );
      } catch (error) {
        console.error(error);
        setError("Unable to load reviews.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [serviceId]);

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading reviews...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">
        {error}
      </p>
    );
  }

  return (
    <section className="mt-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Reviews
        </h2>

        <div className="mt-2 flex items-center gap-2">
          <Star className="size-5 fill-current" />

          <span className="font-semibold">
            {averageRating}
          </span>

          <span className="text-sm text-muted-foreground">
            ({totalReviews}{" "}
            {totalReviews === 1
              ? "review"
              : "reviews"})
          </span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="text-muted-foreground">
          No reviews yet.
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-xl border p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">
                    {review.customer.name}
                  </p>

                  <div className="mt-1 flex items-center gap-1">
                    <Star className="size-4 fill-current" />

                    <span className="text-sm">
                      {review.rating}/5
                    </span>
                  </div>
                </div>

                <span className="text-xs text-muted-foreground">
                  {new Date(
                    review.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>

              {review.comment && (
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ServiceReviews;