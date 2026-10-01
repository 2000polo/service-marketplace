import { getProviderService } from "@/api/servicesApi";
import { useAuth } from "@/context/useAuth";
import { useQuery } from "@tanstack/react-query";

const ProviderDashboard = () => {

    const { token, user } = useAuth()

    const { data, isLoading, isError } = useQuery({
        queryKey: ["provider", "services"],
        queryFn: () => getProviderService(token!),
        enabled: !!token,
    })

    const services = data?.services ?? [];

    const totalServices = services.length;

    const activeServices = services.filter(
        (service) => service.isActive
    ).length;

    if (isLoading) {
        return <div>Loading dashboard...</div>;
    }

    if (isError) {
        return <div>Failed to load dashboard data.</div>;
    }


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">
                Welcome back, {user?.name}
                </h1>

                <p className="text-muted-foreground">
                Here's what's happening with your services.
                </p>
            </div>

            <div>
                <p>Total services: {totalServices}</p>
                <p>Active services: {activeServices}</p>
            </div>
        </div>
    );
    
}

export default ProviderDashboard;