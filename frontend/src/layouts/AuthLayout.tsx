import { Outlet } from 'react-router';

const AuthLayout = () => {
    return (
        <div>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default AuthLayout;