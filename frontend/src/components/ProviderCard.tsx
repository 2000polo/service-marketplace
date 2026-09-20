import {
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone,
  Star,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { Service } from "@/types/service";

interface ProviderCardProps {
  service: Service;
  averageRating: number;
  totalReviews: number;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const ProviderCard = ({
  service,
  averageRating,
  totalReviews,
}: ProviderCardProps) => {
  const provider = service.provider;

  return (
    <Card className="w-full overflow-hidden rounded-xl shadow-2xl font-sans">
      <CardContent className="space-y-6 p-6 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col justify-start gap-3 border-b border-slate-800/80 pb-6">
          <div className="flex flex-wrap items-center ">
            {/* Profile Avatar */}
            <div className="relative shrink-0">
              <Avatar className="h-16 w-16 border-2 border-sky-500/80 p-0.5">
                <AvatarFallback className="bg-slate-800 text-lg font-semibold text-white">
                  {getInitials(provider.name)}
                </AvatarFallback>
              </Avatar>

              {/* Online indicator */}
              <span className="absolute right-0 bottom-0 h-4 w-4 rounded-full border-2 border-[#0d131d] bg-emerald-500" />
            </div>

            {/* User Info */}
            <div className=" space-y-1 flex-1 ml-3">
              <div className="flex items-center gap-1.5">
                <h2 className="truncate text-xl font-bold tracking-tight text-white">
                  {provider.name}
                </h2>

                <CheckCircle2 className="h-5 w-5 shrink-0 fill-sky-500/20 text-sky-400" />
              </div>

              <p className="text-sm font-medium text-slate-400">
                {service.category} Service Provider
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs font-medium text-slate-400">
                <div className="flex items-center gap-1 font-semibold text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span>{averageRating}</span>
                </div>

                <span>•</span>

                <span>
                  {totalReviews}{" "}
                  {totalReviews === 1 ? "Review" : "Reviews"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-300 mt-4">
                <Mail className="h-4 w-4 text-sky-400" />

                <span className="truncate">
                {provider.email}
                </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300 mt-2">
                <Phone className="h-4 w-4 text-sky-400" />

                {provider.phone ? (
                <span>{provider.phone}</span>
                ) : (
                <span className="text-slate-500">
                    Phone not provided
                </span>
                )}
            </div>
          </div>

          {/* Contact Button */}
          <Button
            variant="outline"
            className="self-start rounded-lg border-slate-700/80 bg-[#0d131d] px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-slate-600 hover:bg-slate-800/60 "
          >
            <MessageSquare className="h-4 w-4 text-sky-400" />
            Contact Provider
          </Button>
        </div>

        {/* Provider Information */}
        <div className="grid grid-cols-1 gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-slate-400">
              Primary Location
            </p>

            <p className="text-lg font-extrabold text-white">
              {service.location.city}
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-slate-400">
              Service Category
            </p>

            <p className="text-lg font-extrabold text-white">
              {service.category}
            </p>
          </div>

          
        </div>

        {/* About Section */}
        <div className="space-y-2.5 pt-1">
          <h3 className="text-base font-bold text-white">
            About the Provider
          </h3>

          <p className="text-sm font-normal leading-relaxed text-slate-300">
            {provider.name} provides{" "}
            <span className="font-medium text-white">
              {service.category.toLowerCase()}
            </span>{" "}
            services in{" "}
            <span className="font-medium text-white">
              {service.location.city}
            </span>
            . Check the service details above for pricing,
            duration, and booking availability.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderCard;