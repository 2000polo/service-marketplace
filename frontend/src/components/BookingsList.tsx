import type { Booking } from "@/api/bookingApi";

interface ProviderBookingsListProps {
    bookings: Booking[] | undefined;
}

const BookingsList = ({bookings}: ProviderBookingsListProps) => {

    
    const bookingsData = bookings ?? [];
    console.log(bookingsData)

    if (!bookingsData) {
        return (
          <div className="mt-8 rounded-xl border border-white/10 p-8 text-center">
            <p className="text-white/60">No bookings found.</p>
          </div>
        );
    }

    return (
        <div className="mt-8">
            <div className="mb-4">
                <h2 className="text-xl font-semibold">Bookings</h2>
                <p className="mt-1 text-sm text-white/50">
                Manage your service bookings.
                </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full min-w-[1000px] text-sm">
                <thead className="border-b border-white/10 bg-white/5">
                    <tr className="text-left text-white/60">
                        <th className="px-4 py-3 font-medium">Service</th>
                        <th className="px-4 py-3 font-medium">Customer</th>
                        <th className="px-4 py-3 font-medium">Location</th>
                        <th className="px-4 py-3 font-medium">Date & Time</th>
                        <th className="px-4 py-3 font-medium">Duration</th>
                        <th className="px-4 py-3 font-medium">Price</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {bookingsData?.map((booking) => (
                    <tr
                        key={booking?._id}
                        className="border-b border-white/10 last:border-0"
                    >
                        <td className="px-4 py-4">
                        <div>
                            <p className="font-medium">
                            {booking?.service.title}
                            </p>

                            <p className="mt-1 text-xs text-white/40">
                            {booking?.service.category}
                            </p>
                        </div>
                        </td>

                        <td className="px-4 py-4">
                        <div>
                            <p>{booking?.customer.name}</p>
                            <p className="mt-1 text-xs text-white/40">
                            {booking?.customer.phone}
                            </p>
                        </div>
                        </td>

                        <td className="max-w-[220px] px-4 py-4">
                        <p className="truncate" title={booking?.address}>
                            {booking?.address}
                        </p>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                        {new Date(booking?.scheduledAt).toLocaleString()}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                        {booking?.duration} min
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                        ₹{booking?.price}
                        </td>

                        {/* <td className="px-4 py-4">
                        <bookingDataStatus status={bookingData.status} />
                        </td>

                        <td className="px-4 py-4">
                        <BookingActions booking={booking} />
                        </td> */}
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    )
}

export default BookingsList;