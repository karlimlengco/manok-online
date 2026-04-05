import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { getProducts, getCategories } from '../../lib/api';
import ProductCard from '../../components/ProductCard';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const searchSchema = z.object({
    page: z.number().optional().default(1),
    category: z.string().optional(),
    breed: z.string().optional(),
    sort: z.string().optional(),
});

type SearchParams = z.infer<typeof searchSchema>;

export const Route = createFileRoute('/products/')({
    validateSearch: (search) => searchSchema.parse(search),
    component: ProductsPage,
});

function ProductsPage() {
    const search = Route.useSearch();
    const navigate = useNavigate({ from: Route.fullPath });

    const params: Record<string, string | number | boolean> = {
        page: search.page,
        include: 'images,category',
    };
    if (search.category) params['filter[category.slug]'] = search.category;
    if (search.breed) params['filter[breed]'] = search.breed;
    if (search.sort) params.sort = search.sort;

    const { data, isLoading } = useQuery({
        queryKey: ['products', params],
        queryFn: () => getProducts(params),
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategories(),
    });

    const setSearch = (updates: Partial<SearchParams>) => {
        navigate({
            search: (prev) => ({
                ...prev,
                ...updates,
                page: updates.page ?? 1,
            }),
        });
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">All Manok</h1>

            <div className="mt-8 flex flex-col gap-8 lg:flex-row">
                {/* Sidebar filters */}
                <aside className="w-full shrink-0 lg:w-56">
                    <div className="space-y-6">
                        {/* Category filter */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Category</h3>
                            <ul className="mt-2 space-y-1">
                                <li>
                                    <button
                                        onClick={() => setSearch({ category: undefined })}
                                        className={`block w-full rounded px-2 py-1 text-left text-sm ${
                                            !search.category
                                                ? 'bg-amber-100 font-medium text-amber-800'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        All Categories
                                    </button>
                                </li>
                                {categories?.map((cat) => (
                                    <li key={cat.uuid}>
                                        <button
                                            onClick={() => setSearch({ category: cat.slug })}
                                            className={`block w-full rounded px-2 py-1 text-left text-sm ${
                                                search.category === cat.slug
                                                    ? 'bg-amber-100 font-medium text-amber-800'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            {cat.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Breed filter */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Breed</h3>
                            <input
                                type="text"
                                placeholder="Filter by breed..."
                                value={search.breed ?? ''}
                                onChange={(e) =>
                                    setSearch({ breed: e.target.value || undefined })
                                }
                                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <div className="flex-1">
                    {/* Sort */}
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            {data?.meta.total ?? 0} products
                        </p>
                        <select
                            value={search.sort ?? ''}
                            onChange={(e) =>
                                setSearch({ sort: e.target.value || undefined })
                            }
                            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        >
                            <option value="">Newest</option>
                            <option value="price">Price: Low to High</option>
                            <option value="-price">Price: High to Low</option>
                        </select>
                    </div>

                    {isLoading ? (
                        <LoadingSpinner className="py-20" />
                    ) : !data || data.data.length === 0 ? (
                        <EmptyState
                            icon={<MagnifyingGlassIcon className="h-12 w-12" />}
                            title="No products found"
                            description="Try adjusting your filters or browse all products."
                        />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {data.data.map((product) => (
                                    <ProductCard key={product.uuid} product={product} />
                                ))}
                            </div>
                            <Pagination
                                currentPage={data.meta.current_page}
                                lastPage={data.meta.last_page}
                                onPageChange={(page) => setSearch({ page })}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
