import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import DOMPurify from 'dompurify';
import { getProduct, addToCart } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { setPendingCartItem } from '../../lib/pending-cart';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency } from '../../lib/utils';
import { ShoppingCartIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

export const Route = createFileRoute('/products/$slug')({
    component: ProductDetailPage,
});

function ProductDetailPage() {
    const { slug } = Route.useParams();
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', slug],
        queryFn: () => getProduct(slug),
    });

    const addMutation = useMutation({
        mutationFn: () =>
            addToCart({ product_uuid: product!.uuid, quantity }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    if (isLoading) return <LoadingSpinner className="py-32" />;
    if (error || !product) {
        return (
            <div className="py-32 text-center text-gray-500">
                Product not found.
            </div>
        );
    }

    const images = product.images.length > 0 ? product.images : null;
    const mainImage = images
        ? images[selectedImage]?.path
        : '/images/placeholder-rooster.png';

    const isAvailable = product.stock > 0 && product.status === 'active';

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-gray-500">
                <Link to="/" className="hover:text-amber-600">Home</Link>
                <span className="mx-2">/</span>
                <Link to="/products" search={{ page: 1 }} className="hover:text-amber-600">Products</Link>
                {product.category && (
                    <>
                        <span className="mx-2">/</span>
                        <Link
                            to="/categories/$slug"
                            params={{ slug: product.category.slug }}
                            search={{ page: 1 }}
                            className="hover:text-amber-600"
                        >
                            {product.category.name}
                        </Link>
                    </>
                )}
                <span className="mx-2">/</span>
                <span className="text-gray-900">{product.name}</span>
            </nav>

            <div className="grid gap-10 lg:grid-cols-2">
                {/* Image gallery */}
                <div>
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                        <img
                            src={mainImage}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    {images && images.length > 1 && (
                        <div className="mt-4 flex gap-3 overflow-x-auto">
                            {images.map((img, idx) => (
                                <button
                                    key={img.uuid}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 ${
                                        idx === selectedImage
                                            ? 'border-amber-500'
                                            : 'border-transparent'
                                    }`}
                                >
                                    <img
                                        src={img.path}
                                        alt={img.alt ?? product.name}
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product info */}
                <div>
                    <p className="text-sm font-medium text-amber-600">{product.breed}</p>
                    <h1 className="mt-1 text-3xl font-bold text-gray-900">{product.name}</h1>

                    <div className="mt-4 flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-gray-900">
                            {formatCurrency(product.price)}
                        </span>
                        {product.compare_price && (
                            <span className="text-lg text-gray-400 line-through">
                                {formatCurrency(product.compare_price)}
                            </span>
                        )}
                    </div>

                    {/* Attributes */}
                    <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                        {product.age_months != null && (
                            <div>
                                <dt className="font-medium text-gray-500">Age</dt>
                                <dd className="mt-1 text-gray-900">{product.age_months} months</dd>
                            </div>
                        )}
                        {product.weight_kg != null && (
                            <div>
                                <dt className="font-medium text-gray-500">Weight</dt>
                                <dd className="mt-1 text-gray-900">{product.weight_kg} kg</dd>
                            </div>
                        )}
                        {product.color && (
                            <div>
                                <dt className="font-medium text-gray-500">Color</dt>
                                <dd className="mt-1 text-gray-900">{product.color}</dd>
                            </div>
                        )}
                        <div>
                            <dt className="font-medium text-gray-500">Stock</dt>
                            <dd className={`mt-1 font-medium ${product.stock === 0 ? 'text-red-600' : product.stock <= 5 ? 'text-amber-600' : 'text-green-600'}`}>
                                {product.stock === 0 ? 'Sold Out' : `${product.stock} available`}
                            </dd>
                        </div>
                    </dl>

                    {/* Quantity + Add to Cart */}
                    {isAvailable && (
                        <div className="mt-8 flex items-center gap-4">
                            <div className="flex items-center rounded-md border border-gray-300">
                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                                >
                                    <MinusIcon className="h-4 w-4" />
                                </button>
                                <span className="min-w-[2.5rem] text-center text-sm font-medium">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                                >
                                    <PlusIcon className="h-4 w-4" />
                                </button>
                            </div>

                            <button
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        setPendingCartItem({ product_uuid: product.uuid, quantity });
                                        navigate({ to: '/login' });
                                        return;
                                    }
                                    addMutation.mutate();
                                }}
                                disabled={addMutation.isPending}
                                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-amber-600 px-6 py-3 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
                            >
                                <ShoppingCartIcon className="h-5 w-5" />
                                {addMutation.isPending ? 'Adding...' : 'Add to Cart'}
                            </button>
                        </div>
                    )}

                    {addMutation.isSuccess && (
                        <p className="mt-3 text-sm text-green-600">Added to cart!</p>
                    )}

                    {/* Description */}
                    <div className="mt-8 border-t border-gray-200 pt-6">
                        <h2 className="text-lg font-semibold text-gray-900">Description</h2>
                        <div
                            className="prose prose-sm mt-3 max-w-none text-gray-600"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
