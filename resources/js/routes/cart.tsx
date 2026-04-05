import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, updateCartItem, removeCartItem } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { formatCurrency } from '../lib/utils';
import { useAuth } from '../lib/auth';
import {
    ShoppingCartIcon,
    TrashIcon,
    MinusIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';

export const Route = createFileRoute('/cart')({
    component: CartPage,
});

function CartPage() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const queryClient = useQueryClient();

    const { data: cart, isLoading } = useQuery({
        queryKey: ['cart'],
        queryFn: getCart,
        enabled: isAuthenticated,
    });

    const updateMutation = useMutation({
        mutationFn: ({ uuid, quantity }: { uuid: string; quantity: number }) =>
            updateCartItem(uuid, { quantity }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    });

    const removeMutation = useMutation({
        mutationFn: (uuid: string) => removeCartItem(uuid),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    });

    if (authLoading || isLoading) return <LoadingSpinner className="py-32" />;

    if (!isAuthenticated) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-16 text-center">
                <EmptyState
                    icon={<ShoppingCartIcon className="h-12 w-12" />}
                    title="Please sign in to view your cart"
                    action={
                        <Link
                            to="/login"
                            className="rounded-md bg-amber-600 px-6 py-2 text-sm font-medium text-white hover:bg-amber-700"
                        >
                            Sign In
                        </Link>
                    }
                />
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-16 text-center">
                <EmptyState
                    icon={<ShoppingCartIcon className="h-12 w-12" />}
                    title="Your cart is empty"
                    description="Browse our collection and add some roosters to your cart."
                    action={
                        <Link
                            to="/products"
                            search={{ page: 1 }}
                            className="rounded-md bg-amber-600 px-6 py-2 text-sm font-medium text-white hover:bg-amber-700"
                        >
                            Browse Products
                        </Link>
                    }
                />
            </div>
        );
    }

    const shippingFee = 0;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>

            <div className="mt-8 grid gap-8 lg:grid-cols-3">
                {/* Items */}
                <div className="lg:col-span-2">
                    <ul className="divide-y divide-gray-200 border-y border-gray-200">
                        {cart.items.map((item) => (
                            <li key={item.uuid} className="flex gap-4 py-6">
                                <Link
                                    to="/products/$slug"
                                    params={{ slug: item.product.slug }}
                                    className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-gray-100"
                                >
                                    <img
                                        src={
                                            item.product.images[0]?.path ??
                                            '/images/placeholder-rooster.png'
                                        }
                                        alt={item.product.name}
                                        className="h-full w-full object-cover"
                                    />
                                </Link>

                                <div className="flex flex-1 flex-col justify-between">
                                    <div className="flex justify-between">
                                        <div>
                                            <Link
                                                to="/products/$slug"
                                                params={{ slug: item.product.slug }}
                                                className="text-sm font-semibold text-gray-900 hover:text-amber-700"
                                            >
                                                {item.product.name}
                                            </Link>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                {item.product.breed}
                                            </p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatCurrency(item.subtotal)}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center rounded-md border border-gray-300">
                                            <button
                                                onClick={() =>
                                                    updateMutation.mutate({
                                                        uuid: item.uuid,
                                                        quantity: Math.max(1, item.quantity - 1),
                                                    })
                                                }
                                                className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                            >
                                                <MinusIcon className="h-3 w-3" />
                                            </button>
                                            <span className="min-w-[2rem] text-center text-xs font-medium">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    updateMutation.mutate({
                                                        uuid: item.uuid,
                                                        quantity: item.quantity + 1,
                                                    })
                                                }
                                                className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                            >
                                                <PlusIcon className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeMutation.mutate(item.uuid)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Summary */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:self-start">
                    <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                    <dl className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <dt>Subtotal ({cart.items_count} items)</dt>
                            <dd>{formatCurrency(cart.total)}</dd>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <dt>Shipping</dt>
                            <dd>{shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}</dd>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-semibold text-gray-900">
                            <dt>Total</dt>
                            <dd>{formatCurrency(cart.total + shippingFee)}</dd>
                        </div>
                    </dl>
                    <Link
                        to="/checkout"
                        className="mt-6 block w-full rounded-md bg-amber-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-amber-700"
                    >
                        Proceed to Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
}
