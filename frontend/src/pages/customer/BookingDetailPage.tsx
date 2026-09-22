import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import {
  getBookingById,
  type Booking,
} from "@/api/bookingApi";

import { useAuth } from "@/context/useAuth";
import { istTimeToUTCDate } from "@/utils/dateUtil";

const BookingDetailPage = () => {

    const { id } = useParams();
    const { token } = useAuth();
    
    const [booking, setBooking] = useState<Booking | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchBooking = async () => {
            if (!id || !token) return;
      
            try {
                setIsLoading(true);
                setError(null);
        
                const data = await getBookingById(
                    id,
                    token
                );
        
                setBooking(data.booking);
            } catch (error) {
                setError(
                    error instanceof Error
                    ? error.message
                    : "Failed to load booking"
                );
            } finally {
                setIsLoading(false);
            }
        };
      
        fetchBooking();

    }, [id, token]);

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-muted-foreground">
                    Loading booking...
                </p>
            </div>
        );
    }
    
    if (error || !booking) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <h2 className="text-lg font-semibold">
                        Unable to load booking
                    </h2>
            
                    <p className="mt-2 text-sm text-muted-foreground">
                        {error || "Booking not found"}
                    </p>
            
                    <Link
                        to="/bookings"
                        className="mt-4 inline-block text-sm underline"
                    >
                        Back to bookings
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl px-6 py-10">
            <div className="mb-8">
                <Link
                    to="/bookings"
                    className="text-sm text-muted-foreground hover:underline"
                >
                    ← Back to bookings
                </Link>

                <h1 className="mt-4 text-2xl font-semibold">
                    Booking Details
                </h1>
            </div>

            <div className="space-y-6 rounded-xl border p-6">
                <div>
                    <p className="text-sm text-muted-foreground">
                        Service
                    </p>

                    <h2 className="mt-1 text-lg font-semibold">
                        {booking.service.title}
                    </h2>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Provider
                    </p>

                    <p className="mt-1 font-medium">
                        {booking.provider.name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        {booking.provider.email}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Date & Time
                    </p>

                    <p className="mt-1 font-medium">
                        {new Date(
                        booking.scheduledAt
                        ).toUTCString()}
                        {/* {
                            istTimeToUTCDate(new Date( booking.scheduledAt ).getDate(), new Date( booking.scheduledAt ).getTime())
                        } */}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Duration
                    </p>

                    <p className="mt-1 font-medium">
                        {booking.duration} minutes
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Address
                    </p>

                    <p className="mt-1">
                        {booking.address}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Price
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                        ₹{booking.price}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Status
                    </p>

                    <p className="mt-1 font-medium capitalize">
                        {booking.status.replace("_", " ")}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default BookingDetailPage;