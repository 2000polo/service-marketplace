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
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { getServiceById } from "@/api/servicesApi";
import type { Service } from "@/types/service";
import ServiceReviews from "@/components/service/ServiceReviews";
import ProviderCard from "@/components/ProviderCard";
import ReviewsComponent from "@/components/ReviewsComponent";

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

      <div className="grid gap-8 grid-cols-12">

        <ProviderCard service={service} averageRating={4.5} totalReviews={12} />

        <div className="col-span-12 md:col-span-8 gap-8 grid">
            {/* Main content */}
            <Card>
                <CardContent className="">
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

                <CardFooter className="mt-auto">
                    <div className="flex justify-between w-full items-center ">
                        <div className="price-col">
                            <span className="text-xs font-medium text-slate-400">Total service fee</span>
                            <div className="text-3xl font-bold">₹ {service.price} <span className="text-xs font-medium text-slate-400">/all inclusive</span></div>
                        </div>
                        <Button className=" ">
                            <Link  to={`/services/${service._id}/book`}>
                                Book Service
                            </Link>
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            <ReviewsComponent serviceId={service._id} />
        </div>
      </div>
    </section>
  );
};

export default ServiceDetailsPage;