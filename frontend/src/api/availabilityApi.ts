const API_URL = import.meta.env.VITE_API_URL;

export interface AvailabilitySlot {
  start: string;
  end: string;
}

export interface AvailabilityResponse {
  success: boolean;
  slots: AvailabilitySlot[];
}

export const getAvailableSlots = async (
  providerId: string,
  serviceId: string,
  date: string
): Promise<AvailabilityResponse> => {
  const params = new URLSearchParams({
    date,
    serviceId,
  });

  const response = await fetch(
    `${API_URL}/availability/${providerId}/slots?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch available slots");
  }

  const data: AvailabilityResponse =
    await response.json();

  return data;
};