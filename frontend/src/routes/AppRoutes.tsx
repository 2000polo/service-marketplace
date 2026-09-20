import PublicLayout from "@/layouts/PublicLayout"
import HomePage from "@/pages/HomePage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
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
            }
        ]
    }
  ])

  return <RouterProvider router={router} />
  
}

export default AppRouter
