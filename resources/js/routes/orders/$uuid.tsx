import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getOrder } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency, statusColor } from '../../lib/utils';

export const Route = createFileRoute('/orders/$uuid')({
    component: OrderDetailPage,
});

function OrderDetailPage() {
    const { uuid } = Route.useParams();
    const navigate = useNavigate();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const { data: order, isLoading, error } = useQuery({
        queryKey: ['order', uuid],
        queryFn: () => getOrder(uuid),
        enabled: isAuthenticated,
    });

    if (authLoading || isLoading) return <LoadingSpinner className="py-32" />;

    if (!isAuthenticated) {
        navigate({ to: '/login' });
        return null;
    }

    if (error || !order) {
        return (
            <div className="py-32 text-center text-gray-500">Order not found.</div>
        );
    }

    const addr = order.shipping_address;

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <Link
                to="/orders"
                search={{ page: 1 }}
                className="text-sm font-medium text-amber-600 hover:text-amber-700"
            >
                &larr; Back to Orders
            </Link>

            <div className="mt-4 flex flex-wrap items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">
                    Order {order.order_number}
                </h1>
                <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColor(order.status)}`}
                >
                    {order.status}
                </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">
                Placed on{' '}
                {new Date(order.created_at).toLocaleDateString('en-PH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}
            </p>

            <div className="mt-8 grid gap-8 lg:grid-cols-3">
                {/* Items */}
                <div className="lg:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-900">Items</h2>
                    <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                        Product
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">
                                        Qty
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                                        Price
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {order.items?.map((item) => (
                                    <tr key={item.uuid}>
                                        <td className="px-4 py-3">
                                            <Link
                                                to="/products/$slug"
                                                params={{ slug: item.product_slug }}
                                                className="text-sm font-medium text-amber-600 hover:text-amber-700"
                                            >
                                                {item.product_name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-gray-600">
                                            {item.quantity}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm text-gray-600">
                                            {formatCurrency(item.price)}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                            {formatCurrency(item.total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>
                                {order.shipping_fee === 0
                                    ? 'Free'
                                    : formatCurrency(order.shipping_fee)}
                            </span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-semibold text-gray-900">
                            <span>Total</span>
                            <span>{formatCurrency(order.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Shipping address & timeline */}
                <div className="space-y-6">
                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                        <h3 className="text-sm font-semibold text-gray-900">
                            Shipping Address
                        </h3>
                        <div className="mt-3 text-sm text-gray-600">
                            <p>{addr.address_line_1}</p>
                            {addr.address_line_2 && <p>{addr.address_line_2}</p>}
                            <p>
                                {addr.city}, {addr.state} {addr.postal_code}
                            </p>
                            <p>{addr.country}</p>
                            {addr.phone && <p className="mt-1">{addr.phone}</p>}
                        </div>
                    </div>

                    {order.notes && (
                        <div className="rounded-lg border border-gray-200 bg-white p-5">
                            <h3 className="text-sm font-semibold text-gray-900">Notes</h3>
                            <p className="mt-2 text-sm text-gray-600">{order.notes}</p>
                        </div>
                    )}

                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                        <h3 className="text-sm font-semibold text-gray-900">Timeline</h3>
                        <ul className="mt-3 space-y-2 text-sm text-gray-600">
                            <li>
                                Placed:{' '}
                                {new Date(order.created_at).toLocaleString('en-PH')}
                            </li>
                            {order.paid_at && (
                                <li>
                                    Paid:{' '}
                                    {new Date(order.paid_at).toLocaleString('en-PH')}
                                </li>
                            )}
                            {order.shipped_at && (
                                <li>
                                    Shipped:{' '}
                                    {new Date(order.shipped_at).toLocaleString('en-PH')}
                                </li>
                            )}
                            {order.delivered_at && (
                                <li>
                                    Delivered:{' '}
                                    {new Date(order.delivered_at).toLocaleString('en-PH')}
                                </li>
                            )}
                            {order.cancelled_at && (
                                <li className="text-red-600">
                                    Cancelled:{' '}
                                    {new Date(order.cancelled_at).toLocaleString('en-PH')}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
