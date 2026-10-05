import { getBookings } from "@/api/bookingApi";
import { getProviderService } from "@/api/servicesApi";
import BookingsList from "@/components/BookingsList";
import { useAuth } from "@/context/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

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

    const { data: bookingsData, 
        // error: bookingsError, isLoading: bookingLoading 
    } = useQuery({
        queryKey: ["provider", "bookings"],
        queryFn: () => getBookings(token!),
        enabled: !!token,
    })

    
    const statistics = useMemo(() => {
        const bookings = bookingsData?.bookings ?? [];

        if(!bookings) return;

        return {
          total: bookings.length,
          pending: bookings.filter(
            (booking) => booking.status === "pending"
          ).length,
          confirmed: bookings.filter(
            (booking) => booking.status === "accepted"
          ).length,
          completed: bookings.filter(
            (booking) => booking.status === "completed"
          ).length,
          cancelled: bookings.filter(
            (booking) => booking.status === "cancelled"
          ).length,
        };
    }, [bookingsData]);

    
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

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-white/10 p-5">
                    <p className="text-sm text-white/50">Total Bookings</p>
                    <p className="mt-2 text-3xl font-semibold">
                        {statistics?.total}
                    </p>
                </div>
                <div className="rounded-xl border border-white/10 p-5">
                    <p className="text-sm text-white/50">Pending</p>
                    <p className="mt-2 text-3xl font-semibold">
                        {statistics?.pending}
                    </p>
                </div>

                <div className="rounded-xl border border-white/10 p-5">
                    <p className="text-sm text-white/50">Confirmed</p>
                    <p className="mt-2 text-3xl font-semibold">
                        {statistics?.confirmed}
                    </p>
                </div>

                <div className="rounded-xl border border-white/10 p-5">
                    <p className="text-sm text-white/50">Completed</p>
                    <p className="mt-2 text-3xl font-semibold">
                        {statistics?.completed}
                    </p>
                </div>
            </div>


            <div className="">
                <BookingsList bookings={bookingsData?.bookings} />
            </div>
        </div>
    );
    
}

export default ProviderDashboard;