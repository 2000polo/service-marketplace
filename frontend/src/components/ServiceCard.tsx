import { Clock, MapPin, Star } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { Button } from "./ui/button";

import type { Service } from "../types/service";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {service.category}
            </p>

            <CardTitle className="mt-1">
              {service.title}
            </CardTitle>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <Star className="size-4 fill-current" />
            <span>4.8</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {service.description}
        </p>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="size-4" />
            {service.location.city}
          </div>

          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            {service.duration} min
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Starting from
          </p>

          <p className="text-2xl font-semibold">
            ₹{service.price}
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full">
          View Service
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;