import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import ServiceCard from "@/components/ServiceCard";
import ServiceFilters from "@/components/service/ServiceFilters";

import { getServices } from "@/api/servicesApi";
import type { Service } from "@/types/service";
import ServicePagination from "@/components/service/ServicePagination";

const ServicesPage = () => {
    const [searchParams] = useSearchParams();

    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });

    useEffect(() => {
        const page = Number(
            searchParams.get("page") ?? "1"
        );
        const fetchServices = async () => {
            try {
                setIsLoading(true);
                setError("");
        
                const data = await getServices({
                    search:
                        searchParams.get("search") ?? undefined,
            
                    city:
                        searchParams.get("city") ?? undefined,
            
                    category:
                        searchParams.get("category") ?? undefined,
            
                    minPrice: searchParams.get("minPrice")
                        ? Number(searchParams.get("minPrice"))
                        : undefined,
            
                    maxPrice: searchParams.get("maxPrice")
                        ? Number(searchParams.get("maxPrice"))
                        : undefined,
            
                    sort:
                        (searchParams.get("sort") as
                        | "price_asc"
                        | "price_desc"
                        | null) ?? undefined,
                    page,
                    limit: 9
                });
        
                setServices(data.services);
                setPagination(data.pagination);
            } catch (error) {
                console.error(error);
                setError("Unable to load services.");
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchServices();
    }, [searchParams]);

    return (
        <section className="mx-auto max-w-7xl px-6 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Discover services
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Find trusted services near you.
                </p>
            </div>

            <ServiceFilters />

            <div className="mt-8">
                {isLoading && (
                    <p className="text-muted-foreground">
                        Loading services...
                    </p>
                )}

                {error && (
                    <p className="text-destructive">
                        {error}
                    </p>
                )}

                {!isLoading && !error && services.length === 0 && (
                    <p className="text-muted-foreground">
                        No services found.
                    </p>
                )}

                {!isLoading && !error && services.length > 0 && (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((service) => (
                                <ServiceCard
                                    key={service._id}
                                    service={service}
                                />
                            ))}
                        </div>
                        <ServicePagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                        />
                    </>
                )}
            </div>
        </section>
    );
};

export default ServicesPage;