const API_URL = import.meta.env.VITE_API_URL;

export interface CreateBookingData {
  service: string;
  scheduledAt: string;
  address: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  booking: {
    _id: string;
    customer: string;
    service: string;
    provider: string;
    price: number;
    scheduledAt: string;
    duration: number;
    endAt: string;
    address: string;
    status: string;
  };
}

export const createBooking = async (
  bookingData: CreateBookingData,
  token: string
): Promise<BookingResponse> => {
  const response = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookingData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create booking"
    );
  }

  return data;
};