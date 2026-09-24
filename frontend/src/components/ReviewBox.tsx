
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Review } from "@/types/review";

import {
  Star,
  Check,
  ThumbsUp,
} from "lucide-react";

const getInitials = (name: string) => {
    if(!name) return;
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
};

interface ReviewBoxProps {
    reviewData: Review
}

const ReviewBox = ({
    reviewData,
}: ReviewBoxProps) => {
    return (
        <div
            key={reviewData?._id}
            className="space-y-4 rounded-xl border p-4 "
        >
            {/* Review Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-purple-700/50 bg-purple-900/80 text-purple-200">
                        <AvatarFallback className="bg-purple-900/80 text-sm font-bold">
                        {getInitials(reviewData?.customer?.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center">
                        <h4 className="text-sm font-bold text-white">
                            {reviewData?.customer?.name}
                        </h4>

                        <Badge className="flex items-center gap-1 rounded-full border border-emerald-800/60 bg-emerald-950/80 px-2 py-0.5 text-[10px] font-medium text-emerald-400 hover:bg-emerald-950/80">
                            <Check className="h-3 w-3" />
                            Verified Hire
                        </Badge>
                        </div>

                        <p className="text-xs font-medium text-slate-400">
                        Reviewed{" "}
                        {new Date(
                            reviewData?.createdAt
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
                        star <= reviewData?.rating
                        ? "fill-amber-400 stroke-amber-400"
                        : "fill-transparent stroke-slate-600"
                    }`}
                    />
                ))}
                </div>
            </div>

            {/* Review Text */}
            {reviewData?.comment ? (
                <p className="text-sm leading-relaxed text-slate-300">
                    {reviewData?.comment}
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
    )
}

export default ReviewBox;