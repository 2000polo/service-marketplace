export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface BookingUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface BookingService {
  _id: string;
  title: string;
  category: string;
  price: number;
}

export interface Booking {
  _id: string;
  provider: BookingUser;
  customer: BookingUser;
  service: BookingService;
  price: number;
  scheduledAt: string;
  duration: number;
  endAt: string;
  address: string;
  status: BookingStatus;
}

export interface BookingsResponse {
  success: boolean;
  bookings: Booking[];
}