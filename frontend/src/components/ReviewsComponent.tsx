import { useEffect, useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Star,
  Check,
  ThumbsUp,
} from "lucide-react";

import type { Review } from "@/types/review";
import { getServiceReviews } from "@/api/reviewApi";

interface ReviewsComponentProps {
  serviceId: string;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const ReviewsComponent = ({
  serviceId,
}: ReviewsComponentProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const [averageRating, setAverageRating] = useState(0);

  const [totalReviews, setTotalReviews] = useState(0);

  const [activeTab, setActiveTab] = useState("all");

  const [sortBy, setSortBy] = useState("most-recent");

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getServiceReviews(serviceId);

        setReviews(data.reviews);
        setAverageRating(data.summary.averageRating);
        setTotalReviews(data.summary.totalReviews);
      } catch (error) {
        console.error(error);

        setError("Unable to load reviews.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [serviceId]);

  /*
   * Calculate how many reviews belong to each
   * star rating.
   */
  const ratingCounts = useMemo(() => {
    return {
      5: reviews.filter((review) => review.rating === 5).length,
      4: reviews.filter((review) => review.rating === 4).length,
      3: reviews.filter((review) => review.rating === 3).length,
      2: reviews.filter((review) => review.rating === 2).length,
      1: reviews.filter((review) => review.rating === 1).length,
    };
  }, [reviews]);

  /*
   * Convert rating counts into percentages.
   */
  const ratingBreakdown = useMemo(() => {
    return [5, 4, 3, 2, 1].map((stars) => {
      const count =
        ratingCounts[stars as keyof typeof ratingCounts];

      const percentage =
        totalReviews > 0
          ? Math.round((count / totalReviews) * 100)
          : 0;

      return {
        stars: `${stars} Star`,
        count,
        percentage,
      };
    });
  }, [ratingCounts, totalReviews]);

  /*
   * Filter and sort reviews on the client.
   */
  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    if (activeTab === "5star") {
      result = result.filter(
        (review) => review.rating === 5
      );
    }

    if (sortBy === "highest") {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (sortBy === "lowest") {
      result.sort((a, b) => a.rating - b.rating);
    }

    if (sortBy === "most-recent") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [reviews, activeTab, sortBy]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl rounded-xl shadow-2xl">
        <CardContent className="p-6 md:p-8">
          <p className="text-sm text-slate-400">
            Loading reviews...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl rounded-xl border-slate-800/80 bg-[#0b1019] text-slate-200 shadow-2xl">
        <CardContent className="p-6 md:p-8">
          <p className="text-sm text-red-400">
            {error}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl rounded-xl ">
      <CardContent className="space-y-6">

        {/* Section Title */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight text-white">
            Service Reviews & Ratings
          </h2>

          <span className="text-sm font-medium text-slate-400">
            {totalReviews}{" "}
            {totalReviews === 1
              ? "Verified Buyer"
              : "Verified Buyers"}
          </span>
        </div>

        {/* Rating Breakdown */}
        <div className="grid grid-cols-1 items-center gap-6 rounded-xl border p-6 md:grid-cols-12">

          {/* Overall Rating */}
          <div className="flex flex-col items-center justify-center space-y-1.5 md:col-span-4 md:border-r md:border-slate-800/80 md:pr-6">
            <span className="text-5xl font-extrabold tracking-tight text-white">
              {averageRating.toFixed(1)}
            </span>

            <div className="flex gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? "fill-amber-400 stroke-amber-400"
                      : "fill-amber-400/30 stroke-amber-400"
                  }`}
                />
              ))}
            </div>

            <p className="pt-1 text-xs font-medium text-slate-400">
              Overall Rating Score
            </p>
          </div>

          {/* Rating Percentage Bars */}
          <div className="space-y-2.5 md:col-span-8">
            {ratingBreakdown.map((row) => (
              <div
                key={row.stars}
                className="flex items-center gap-3 text-xs font-medium"
              >
                <span className="w-12 text-slate-400">
                  {row.stars}
                </span>

                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-300"
                    style={{
                      width: `${row.percentage}%`,
                    }}
                  />
                </div>

                <span className="w-8 text-right text-slate-300">
                  {row.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Available Metrics */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-1 rounded-xl border p-4 text-center">
            <p className="text-xs font-medium text-slate-400">
              Total Reviews
            </p>

            <p className="text-lg font-bold text-white">
              {totalReviews}
            </p>
          </div>

          <div className="space-y-1 rounded-xl border p-4 text-center">
            <p className="text-xs font-medium text-slate-400">
              5 Star Reviews
            </p>

            <p className="flex items-center justify-center gap-1 text-lg font-bold text-white">
              {ratingCounts[5]}
              <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
            </p>
          </div>

          <div className="space-y-1 rounded-xl border p-4 text-center">
            <p className="text-xs font-medium text-slate-400">
              Rating Score
            </p>

            <p className="text-lg font-bold text-white">
              {averageRating.toFixed(1)} / 5
            </p>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col items-stretch justify-between gap-4 pt-2 sm:flex-row sm:items-center">

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Button
              onClick={() => setActiveTab("all")}
              className={`h-9 rounded-lg px-4 py-2 text-xs font-semibold ${
                activeTab === "all"
                  ? "bg-primary text-white hover:shadow-xl"
                  : "border border-slate-800 bg-[#0e1626]/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              All Reviews ({totalReviews})
            </Button>

            <Button
              onClick={() => setActiveTab("5star")}
              className={`h-9 rounded-lg px-4 py-2 text-xs font-semibold ${
                activeTab === "5star"
                  ? "bg-primary text-white hover:shadow-xl"
                  : "border border-slate-800 bg-[#0e1626]/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              5 Stars ({ratingCounts[5]})
            </Button>
          </div>

          {/* Sort Dropdown */}
          <Select
            value={sortBy}
            onValueChange={setSortBy}
          >
            <SelectTrigger className="h-9 w-full rounded-lg text-xs text-slate-300 sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>

            <SelectContent className="text-slate-300">
              <SelectItem value="most-recent">
                Sort by: Most Recent
              </SelectItem>

              <SelectItem value="highest">
                Highest Rating
              </SelectItem>

              <SelectItem value="lowest">
                Lowest Rating
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reviews */}
        {filteredReviews.length === 0 ? (
          <div className="rounded-xl border border-slate-800/80 bg-[#0e1626]/50 p-8 text-center">
            <p className="text-sm text-slate-400">
              No reviews found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review._id}
                className="space-y-4 rounded-xl border p-4"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-purple-700/50 bg-purple-900/80 text-purple-200">
                      <AvatarFallback className="bg-purple-900/80 text-sm font-bold">
                        {getInitials(review.customer.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-white">
                          {review.customer.name}
                        </h4>

                        <Badge className="flex items-center gap-1 rounded-full border border-emerald-800/60 bg-emerald-950/80 px-2 py-0.5 text-[10px] font-medium text-emerald-400 hover:bg-emerald-950/80">
                          <Check className="h-3 w-3" />
                          Verified Hire
                        </Badge>
                      </div>

                      <p className="text-xs font-medium text-slate-400">
                        Reviewed{" "}
                        {new Date(
                          review.createdAt
                        ).toLocaleDateString()}
                        {" "}• Completed Service
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex shrink-0 gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "fill-amber-400 stroke-amber-400"
                            : "fill-transparent stroke-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                {review.comment ? (
                  <p className="text-sm leading-relaxed text-slate-300">
                    {review.comment}
                  </p>
                ) : (
                  <p className="text-sm italic text-slate-500">
                    This customer left a rating without a comment.
                  </p>
                )}

                {/* Helpful Feedback */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-medium text-slate-400">
                    Verified review from a completed booking
                  </span>

                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-slate-200"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>Helpful</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewsComponent;