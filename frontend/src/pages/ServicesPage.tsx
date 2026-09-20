import { useEffect, useState } from "react";

import ServiceCard from "@/components/ServiceCard";
import type { Service } from "@/types/service";
import { getService } from "@/api/servicesApi";

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getService();
        setServices(response);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (isLoading) {
    return <p>Loading services...</p>;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">
        Discover services
      </h1>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard
            key={service._id}
            service={service}
          />
        ))}
      </div>
    </section>
  );
};

export default ServicesPage;