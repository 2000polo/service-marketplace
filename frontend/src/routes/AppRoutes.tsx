import PublicLayout from "@/layouts/PublicLayout"
import CreateBookingPage from "@/pages/customer/CreateBookingPage"
import HomePage from "@/pages/HomePage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import ServiceDetailsPage from "@/pages/ServiceDetailsPage"
import ServicesPage from "@/pages/ServicesPage"
import { createBrowserRouter, RouterProvider } from "react-router"


const AppRouter = () => {

  const router = createBrowserRouter([
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: '/login',
                element: <LoginPage />
            },
            {
                path: '/register',
                element: <RegisterPage />
            },
            {
                path: '/services',
                element: <ServicesPage />
            },
            {
                path: "services/:serviceId",
                element: <ServiceDetailsPage />,
            },
            {
                path: "services/:serviceId/book",
                element: <CreateBookingPage />,
            },
        ]
    }
  ])

  return <RouterProvider router={router} />
  
}

export default AppRouter
