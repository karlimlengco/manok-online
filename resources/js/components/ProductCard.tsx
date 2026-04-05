import { Link } from '@tanstack/react-router';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToCart } from '../lib/api';
import type { Product } from '../types/models';
import { formatCurrency } from '../lib/utils';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const queryClient = useQueryClient();

    const addMutation = useMutation({
        mutationFn: () => addToCart({ product_uuid: product.uuid, quantity: 1 }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const imageSrc =
        product.images.length > 0
            ? product.images[0].path
            : '/images/placeholder-rooster.png';

    const stockLabel =
        product.stock === 0
            ? { text: 'Sold Out', color: 'text-red-600' }
            : product.stock <= 5
              ? { text: 'Low Stock', color: 'text-amber-600' }
              : { text: 'In Stock', color: 'text-green-600' };

    const isAvailable = product.stock > 0 && product.status === 'active';

    return (
        <div className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
            <Link
                to="/products/$slug"
                params={{ slug: product.slug }}
                className="relative aspect-square overflow-hidden bg-gray-100"
            >
                <img
                    src={imageSrc}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                {product.is_featured && (
                    <span className="absolute left-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
                        Featured
                    </span>
                )}
            </Link>

            <div className="flex flex-1 flex-col p-4">
                <p className="text-xs font-medium text-amber-600">{product.breed}</p>
                <Link
                    to="/products/$slug"
                    params={{ slug: product.slug }}
                    className="mt-1 text-sm font-semibold text-gray-900 hover:text-amber-700"
                >
                    {product.name}
                </Link>

                <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(product.price)}
                    </span>
                    {product.compare_price && (
                        <span className="text-sm text-gray-400 line-through">
                            {formatCurrency(product.compare_price)}
                        </span>
                    )}
                </div>

                <p className={`mt-1 text-xs font-medium ${stockLabel.color}`}>
                    {stockLabel.text}
                </p>

                <div className="mt-auto pt-3">
                    <button
                        onClick={() => addMutation.mutate()}
                        disabled={!isAvailable || addMutation.isPending}
                        className="flex w-full items-center justify-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ShoppingCartIcon className="h-4 w-4" />
                        {addMutation.isPending ? 'Adding...' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}
