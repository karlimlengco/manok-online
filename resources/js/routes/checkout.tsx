import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
    getCart,
    getAddresses,
    createAddress,
    createOrder,
} from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../lib/utils';
import { useAuth } from '../lib/auth';

export const Route = createFileRoute('/checkout')({
    component: CheckoutPage,
});

function CheckoutPage() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [selectedAddress, setSelectedAddress] = useState<string>('');
    const [notes, setNotes] = useState('');
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        label: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'Philippines',
        phone: '',
    });
    const [error, setError] = useState('');

    const { data: cart, isLoading: loadingCart } = useQuery({
        queryKey: ['cart'],
        queryFn: getCart,
        enabled: isAuthenticated,
    });

    const { data: addresses, isLoading: loadingAddresses } = useQuery({
        queryKey: ['addresses'],
        queryFn: getAddresses,
        enabled: isAuthenticated,
    });

    const addAddressMutation = useMutation({
        mutationFn: () =>
            createAddress({
                label: newAddress.label || null,
                address_line_1: newAddress.address_line_1,
                address_line_2: newAddress.address_line_2 || null,
                city: newAddress.city,
                state: newAddress.state,
                postal_code: newAddress.postal_code,
                country: newAddress.country,
                phone: newAddress.phone || null,
            }),
        onSuccess: (addr) => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            setSelectedAddress(addr.uuid);
            setShowAddressForm(false);
        },
    });

    const orderMutation = useMutation({
        mutationFn: () =>
            createOrder({
                shipping_address_id: selectedAddress,
                notes: notes || undefined,
            }),
        onSuccess: (order) => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            navigate({ to: '/orders/$uuid', params: { uuid: order.uuid } });
        },
        onError: (err: any) => {
            setError(
                err?.response?.data?.message ?? 'Failed to place order. Please try again.',
            );
        },
    });

    if (authLoading || loadingCart || loadingAddresses)
        return <LoadingSpinner className="py-32" />;

    if (!isAuthenticated) {
        navigate({ to: '/login' });
        return null;
    }

    if (!cart || cart.items.length === 0) {
        navigate({ to: '/cart' });
        return null;
    }

    const shippingFee = 0;

    const handlePlaceOrder = () => {
        setError('');
        if (!selectedAddress) {
            setError('Please select a shipping address.');
            return;
        }
        orderMutation.mutate();
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>

            {error && (
                <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="mt-8 grid gap-8 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                    {/* Shipping address */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Shipping Address
                        </h2>

                        {addresses && addresses.length > 0 && (
                            <div className="mt-4 space-y-3">
                                {addresses.map((addr) => (
                                    <label
                                        key={addr.uuid}
                                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
                                            selectedAddress === addr.uuid
                                                ? 'border-amber-500 bg-amber-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="address"
                                            value={addr.uuid}
                                            checked={selectedAddress === addr.uuid}
                                            onChange={() => setSelectedAddress(addr.uuid)}
                                            className="mt-1 accent-amber-600"
                                        />
                                        <div className="text-sm">
                                            {addr.label && (
                                                <span className="font-semibold text-gray-900">
                                                    {addr.label}
                                                </span>
                                            )}
                                            <p className="text-gray-600">
                                                {addr.address_line_1}
                                                {addr.address_line_2 && `, ${addr.address_line_2}`}
                                            </p>
                                            <p className="text-gray-600">
                                                {addr.city}, {addr.state} {addr.postal_code}
                                            </p>
                                            <p className="text-gray-600">{addr.country}</p>
                                            {addr.phone && (
                                                <p className="text-gray-500">{addr.phone}</p>
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}

                        {!showAddressForm ? (
                            <button
                                onClick={() => setShowAddressForm(true)}
                                className="mt-4 text-sm font-medium text-amber-600 hover:text-amber-700"
                            >
                                + Add new address
                            </button>
                        ) : (
                            <div className="mt-4 rounded-lg border border-gray-200 p-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-medium text-gray-700">Label (optional)</label>
                                        <input
                                            value={newAddress.label}
                                            onChange={(e) => setNewAddress((p) => ({ ...p, label: e.target.value }))}
                                            placeholder="e.g. Home, Office"
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-medium text-gray-700">Address Line 1</label>
                                        <input
                                            value={newAddress.address_line_1}
                                            onChange={(e) => setNewAddress((p) => ({ ...p, address_line_1: e.target.value }))}
                                            required
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-medium text-gray-700">Address Line 2 (optional)</label>
                                        <input
                                            value={newAddress.address_line_2}
                                            onChange={(e) => setNewAddress((p) => ({ ...p, address_line_2: e.target.value }))}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">City</label>
                                        <input
                                            value={newAddress.city}
                                            onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))}
                                            required
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">State / Province</label>
                                        <input
                                            value={newAddress.state}
                                            onChange={(e) => setNewAddress((p) => ({ ...p, state: e.target.value }))}
                                            required
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Postal Code</label>
                                        <input
                                            value={newAddress.postal_code}
                                            onChange={(e) => setNewAddress((p) => ({ ...p, postal_code: e.target.value }))}
                                            required
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Phone (optional)</label>
                                        <input
                                            value={newAddress.phone}
                                            onChange={(e) => setNewAddress((p) => ({ ...p, phone: e.target.value }))}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-3">
                                    <button
                                        onClick={() => addAddressMutation.mutate()}
                                        disabled={addAddressMutation.isPending}
                                        className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
                                    >
                                        {addAddressMutation.isPending ? 'Saving...' : 'Save Address'}
                                    </button>
                                    <button
                                        onClick={() => setShowAddressForm(false)}
                                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Notes */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Order Notes (optional)
                        </h2>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder="Special instructions for your order..."
                            className="mt-3 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                    </section>
                </div>

                {/* Order summary */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:self-start">
                    <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                    <ul className="mt-4 divide-y divide-gray-100 text-sm">
                        {cart.items.map((item) => (
                            <li key={item.uuid} className="flex justify-between py-2">
                                <span className="text-gray-600">
                                    {item.product.name} x{item.quantity}
                                </span>
                                <span className="font-medium text-gray-900">
                                    {formatCurrency(item.subtotal)}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <dl className="mt-4 space-y-2 border-t border-gray-200 pt-4 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <dt>Subtotal</dt>
                            <dd>{formatCurrency(cart.total)}</dd>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <dt>Shipping</dt>
                            <dd>{shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}</dd>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-semibold text-gray-900">
                            <dt>Total</dt>
                            <dd>{formatCurrency(cart.total + shippingFee)}</dd>
                        </div>
                    </dl>
                    <button
                        onClick={handlePlaceOrder}
                        disabled={orderMutation.isPending || !selectedAddress}
                        className="mt-6 w-full rounded-md bg-amber-600 px-4 py-3 text-sm font-medium text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {orderMutation.isPending ? 'Placing Order...' : 'Place Order'}
                    </button>
                </div>
            </div>
        </div>
    );
}
