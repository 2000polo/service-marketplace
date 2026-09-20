import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { getServiceById } from "@/api/servicesApi";
import type { Service } from "@/types/service";
import ServiceReviews from "@/components/service/ServiceReviews";
import ProviderCard from "@/components/ProviderCard";

const ServiceDetailsPage = () => {
  const { serviceId } = useParams();

  const [service, setService] =
    useState<Service | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState<string>("");

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

  console.log("service data", service)

  if (isLoading) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-muted-foreground">
          Loading service...
        </p>
      </section>
    );
  }

  if (error || !service) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-10">
        <Button variant="ghost" asChild>
          <Link to="/services">
            <ArrowLeft />
            Back to services
          </Link>
        </Button>

        <p className="mt-8 text-destructive">
          {error || "Service not found."}
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      {/* Back */}
      {/* <Button variant="ghost" asChild>
        <Link to="/services" className="flex gap-2 items-center justify-center">
          <ArrowLeft />
          Back to services
        </Link>
      </Button> */}

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">

        <ProviderCard service={service} averageRating={4.5} totalReviews={12} />

        {/* Main content */}
        <Card>
            <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                    {service.category}
                </p>

                <div className="flex mt-2 items-center justify-between">
                    <h1 className=" text-3xl font-bold">
                        {service.title}
                    </h1>

                    <Button className="">
                        <Link to={`/services/${service._id}`}>
                            Book Service
                        </Link>
                    </Button>
                </div>

                <div className="mt-2 flex gap-3">
                    <div className="flex items-center gap-3">
                        <MapPin className="size-5 text-muted-foreground" />

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Location : <span className="font-medium">{service.location?.city}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Clock className="size-5 text-muted-foreground" />

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Duration: <span className="font-medium">{service.duration} minutes</span>
                            </p>
                        </div>
                    </div>
                </div>

                <p className="mt-6 leading-7 text-muted-foreground">
                    {service.description}
                </p>

                
            </CardContent>
        </Card>

        <ServiceReviews
            serviceId={service._id}
        />
      </div>
    </section>
  );
};

export default ServiceDetailsPage;