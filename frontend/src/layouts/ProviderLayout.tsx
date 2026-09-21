import Navbar from "@/components/layout/Navbar";
import { Outlet } from 'react-router';

const ProviderLayout = () => {
    return (
        <div>
            <Navbar />

            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default ProviderLayout;