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

export interface Booking {
    _id: string;
    customer: {
        _id: string;
        name: string;
        email: string;
    };
    service: {
        _id: string;
        title: string;
        category: string;
        price: number;
        duration: number;
    };
    provider: {
        _id: string;
        name: string;
        email: string;
        phone?: string;
    };
    price: number;
    scheduledAt: string;
    duration: number;
    endAt: string;
    address: string;
    status: | "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
    createdAt: string;
    updatedAt: string;
}

export interface GetBookingResponse {
    success: boolean;
    booking: Booking;
}

export interface GetBookingsResponse {
    success: boolean;
    bookings: Booking[];
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

export const getBookingById = async (
    bookingId: string,
    token: string
): Promise<GetBookingResponse> => {
    const response = await fetch(
        `${API_URL}/bookings/${bookingId}`,
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
        throw new Error(
            data.message || "Failed to fetch booking"
        );
    }
  
    return data;
};

export const getBookings = async (
    token: string
): Promise<GetBookingsResponse> => {
    const response = await fetch(
        `${API_URL}/bookings`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to fetch bookings"
        );
    }

    return data;
};

export const cancelBooking = async (
    bookingId: string,
    token: string
): Promise<GetBookingResponse> => {
    if(!bookingId){
        throw new Error("invalid booking id");
    }

    const response = await fetch(
        `${API_URL}/bookings/${bookingId}/cancel`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if(!response.ok){
        throw new Error(
            data.message || "Failed to cancel booking"
        );
    }

    return data;
}