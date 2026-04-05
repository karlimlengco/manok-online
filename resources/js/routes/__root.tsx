import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { AuthProvider } from '../lib/auth';
import Navbar from '../components/Navbar';

interface RouterContext {
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootLayout,
});

function RootLayout() {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <Outlet />
            </div>
        </AuthProvider>
    );
}
