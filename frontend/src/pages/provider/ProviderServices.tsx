import { getProviderService } from '@/api/servicesApi';
import ServiceCard from '@/components/ServiceCard';
import { useAuth } from '@/context/useAuth';
import { useQuery } from '@tanstack/react-query';

const ProviderServices = () => {

    const { token } = useAuth()

    const { data, error, isLoading } = useQuery({
        queryKey: ["provider", "services"],
        queryFn: () => getProviderService(token!),
        enabled: !!token,
    })

    return (
        <div>
            <div className='mb-8'>
                <h1 className="text-2xl font-semibold">
                    Provider Dashboard
                </h1>
            
                <p className="mt-2 text-white/60">
                    Manage your services, bookings, and availability.
                </p>
            </div> 

            {isLoading && (
                <p className="text-muted-foreground">
                    Loading services...
                </p>
            )}

            {error && (
                <p className="text-destructive">
                    {error.message}
                </p>
            )}

            {!isLoading && !error && data?.services.length === 0 && (
                <p className="text-muted-foreground">
                    No services found.
                </p>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data?.services.map((service) => (
                    <ServiceCard
                        key={service._id}
                        service={service}
                    />
                ))}
            </div>
        </div>
    )
}

export default ProviderServices;