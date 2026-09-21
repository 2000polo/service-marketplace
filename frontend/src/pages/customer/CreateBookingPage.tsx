import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { getServiceById } from "@/api/servicesApi";
import type { Service } from "@/types/service";

const CreateBookingPage = () => {
  const { serviceId } = useParams();

  const [service, setService] =
    useState<Service | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!serviceId) {
      setError("Service ID is missing.");
      setIsLoading(false);
      return;
    }

    const fetchService = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data =
          await getServiceById(serviceId);

        setService(data);
      } catch (error) {
        console.error(error);

        setError("Unable to load service.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-sm text-muted-foreground">
          Loading booking...
        </p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-sm text-destructive">
          {error || "Service not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <Button
        variant="ghost"
        asChild
        className="mb-6"
      >
        <Link to={`/services/${service._id}`}>
          <ArrowLeft />
          Back to Service
        </Link>
      </Button>

      <div className="mb-8">
        <p className="text-sm text-muted-foreground">
          Booking
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Book {service.title}
        </h1>

        <p className="mt-2 text-muted-foreground">
          Choose a date and available time slot.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold">
            {service.title}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {service.duration} minutes · ₹{service.price}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Provider: {service.provider.name}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBookingPage;