import ServiceCard from "./components/ServiceCard.tsx";
import type { Service } from "./types/service.ts";

const App = () => {

  const service: Service = {
    _id: "service-1",
    title: "AC Repair",
    description: "Professional AC repair and maintenance",
    category: "Home Services",
    price: 1200,
    duration: 60,

    location: {
      city: "Kochi",
    },

    provider: {
      _id: "provider-1",
      name: "John",
      email: "john@example.com",
      phone: "9876543210",
    },

    isActive: true,
  };


  return (
    <>
      <h1 className="text-red-600">Service Market Place frontend</h1>
      <ServiceCard service={service} />
    </>
  )
}

export default App
