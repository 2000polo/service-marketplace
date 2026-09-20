export interface Service {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    duration: number;
  
    location: {
      city: string;
    };
  
    provider: {
      _id: string;
      name: string;
      email: string;
      phone?: string;
    };
  
    isActive: boolean;
}