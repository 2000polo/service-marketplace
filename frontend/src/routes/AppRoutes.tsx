import PublicLayout from "@/layouts/PublicLayout"
import CreateBookingPage from "@/pages/customer/CreateBookingPage"
import HomePage from "@/pages/HomePage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import ServiceDetailsPage from "@/pages/ServiceDetailsPage"
import ServicesPage from "@/pages/ServicesPage"
import { createBrowserRouter, RouterProvider } from "react-router"
import ProtectedRoute from "./ProtectedRoutes"
import BookingsPage from "@/pages/customer/BookingsPage"
import CustomerLayout from "@/layouts/CustomerLayout"
import AuthLayout from "@/layouts/AuthLayout"
import ProviderLayout from "@/layouts/ProviderLayout"
import Dashboard from "@/pages/provider/Dashboard"


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
                path: '/services',
                element: <ServicesPage />
            },
            {
                path: "/services/:serviceId",
                element: <ServiceDetailsPage />,
            }
        ]
    },
    {
        element: <AuthLayout />,
        children: [
            {
                path: '/login',
                element: <LoginPage />
            },
            {
                path: '/register',
                element: <RegisterPage />
            }
        ]
    },
    {
        element: <ProtectedRoute allowedRoles={["customer"]} />,
        children: [
            {
                element: <CustomerLayout />,
                children: [
                    {
                        path: "bookings",
                        element: <BookingsPage />,
                    },
                    {
                        path: "/services/:serviceId/book",
                        element: <CreateBookingPage />,
                    }
                ],
            }
            
        ]
    },
    {
        element: <ProtectedRoute allowedRoles={["provider"]} />,
        children: [
            {
                element: <ProviderLayout />,
                children: [
                    {
                        path: "dashboard",
                        element: <Dashboard />,
                    }
                ],
            }
            
        ]
    }
  ])

  return <RouterProvider router={router} />
  
}

export default AppRouter
