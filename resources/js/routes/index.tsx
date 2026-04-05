import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories } from '../lib/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

export const Route = createFileRoute('/')({
    component: HomePage,
});

function HomePage() {
    const { data: featuredData, isLoading: loadingFeatured } = useQuery({
        queryKey: ['products', 'featured'],
        queryFn: () => getProducts({ 'filter[is_featured]': 1, per_page: 8, include: 'images,category' }),
    });

    const { data: categories, isLoading: loadingCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategories(),
    });

    return (
        <div>
            {/* Hero */}
            <section className="bg-gradient-to-br from-amber-600 to-orange-700 px-4 py-20 text-center text-white sm:py-28">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                    Premium Manok, <br className="hidden sm:block" /> Delivered to You
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-lg text-amber-100">
                    Browse our collection of champion-quality roosters from trusted
                    breeders across the Philippines.
                </p>
                <div className="mt-8 flex items-center justify-center gap-4">
                    <Link
                        to="/products"
                        search={{ page: 1 }}
                        className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-amber-700 shadow hover:bg-gray-100"
                    >
                        Shop Now
                    </Link>
                </div>
            </section>

            {/* Featured Products */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Featured Manok</h2>
                    <Link
                        to="/products"
                        search={{ page: 1 }}
                        className="text-sm font-medium text-amber-600 hover:text-amber-700"
                    >
                        View all &rarr;
                    </Link>
                </div>

                {loadingFeatured ? (
                    <LoadingSpinner className="py-20" />
                ) : (
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {featuredData?.data.map((product) => (
                            <ProductCard key={product.uuid} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* Categories */}
            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <h2 className="text-center text-2xl font-bold text-gray-900">
                        Browse by Category
                    </h2>

                    {loadingCategories ? (
                        <LoadingSpinner className="py-20" />
                    ) : (
                        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {categories?.map((cat) => (
                                <Link
                                    key={cat.uuid}
                                    to="/categories/$slug"
                                    params={{ slug: cat.slug }}
                                    search={{ page: 1 }}
                                    className="group flex flex-col items-center rounded-lg border border-gray-200 bg-gray-50 p-6 text-center transition hover:border-amber-400 hover:shadow"
                                >
                                    {cat.image ? (
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="mb-3 h-16 w-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-2xl">
                                            🐓
                                        </div>
                                    )}
                                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-amber-700">
                                        {cat.name}
                                    </h3>
                                    {cat.products_count !== undefined && (
                                        <span className="mt-1 text-xs text-gray-500">
                                            {cat.products_count} products
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
