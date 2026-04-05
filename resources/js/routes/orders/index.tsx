import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { getOrders } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';
import { formatCurrency, statusColor } from '../../lib/utils';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const searchSchema = z.object({
    page: z.number().optional().default(1),
});

export const Route = createFileRoute('/orders/')({
    validateSearch: (search) => searchSchema.parse(search),
    component: OrdersPage,
});

function OrdersPage() {
    const search = Route.useSearch();
    const navigate = useNavigate({ from: Route.fullPath });
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const { data, isLoading } = useQuery({
        queryKey: ['orders', { page: search.page }],
        queryFn: () => getOrders({ page: search.page }),
        enabled: isAuthenticated,
    });

    if (authLoading || isLoading) return <LoadingSpinner className="py-32" />;

    if (!isAuthenticated) {
        navigate({ to: '/login' });
        return null;
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>

            {!data || data.data.length === 0 ? (
                <EmptyState
                    icon={<ClipboardDocumentListIcon className="h-12 w-12" />}
                    title="No orders yet"
                    description="When you place an order, it will appear here."
                    action={
                        <Link
                            to="/products"
                            search={{ page: 1 }}
                            className="rounded-md bg-amber-600 px-6 py-2 text-sm font-medium text-white hover:bg-amber-700"
                        >
                            Start Shopping
                        </Link>
                    }
                />
            ) : (
                <>
                    <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                        Order
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.data.map((order) => (
                                    <tr key={order.uuid} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <Link
                                                to="/orders/$uuid"
                                                params={{ uuid: order.uuid }}
                                                className="text-sm font-medium text-amber-600 hover:text-amber-700"
                                            >
                                                {order.order_number}
                                            </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString('en-PH', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColor(order.status)}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900">
                                            {formatCurrency(order.total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        currentPage={data.meta.current_page}
                        lastPage={data.meta.last_page}
                        onPageChange={(page) => navigate({ search: () => ({ page }) })}
                    />
                </>
            )}
        </div>
    );
}
