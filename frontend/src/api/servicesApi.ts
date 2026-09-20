import type { Service } from "@/types/service";

interface GetServiceResponse {
    success: boolean,
    count: number,
    pagination: {
        totalPages: number,
        totalServices: number,
        page: number,
        limit: number
    },
    services: Service[] 
}

const BASE_URL = import.meta.env.VITE_API_URL;

export const getService = async (): Promise<Service[]> => {
    const response = await fetch(`${BASE_URL}/service`);

    if(!response.ok){
        throw new Error("failed to fetch services");
    }

    const data:GetServiceResponse = await response.json()

    return data.services;
}