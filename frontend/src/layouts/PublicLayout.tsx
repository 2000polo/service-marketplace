import Navbar from "@/components/layout/Navbar";
import { Outlet } from 'react-router';

const PublicLayout = () => {
    return (
        <div>
            <Navbar />

            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default PublicLayout;