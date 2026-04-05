import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { getCategory, getProducts } from '../../lib/api';
import ProductCard from '../../components/ProductCard';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const searchSchema = z.object({
    page: z.number().optional().default(1),
});

export const Route = createFileRoute('/categories/$slug')({
    validateSearch: (search) => searchSchema.parse(search),
    component: CategoryPage,
});

function CategoryPage() {
    const { slug } = Route.useParams();
    const search = Route.useSearch();
    const navigate = useNavigate({ from: Route.fullPath });

    const { data: category, isLoading: loadingCat } = useQuery({
        queryKey: ['category', slug],
        queryFn: () => getCategory(slug),
    });

    const { data: productsData, isLoading: loadingProducts } = useQuery({
        queryKey: ['products', { category: slug, page: search.page }],
        queryFn: () =>
            getProducts({
                'filter[category.slug]': slug,
                page: search.page,
                include: 'images,category',
            }),
    });

    if (loadingCat) return <LoadingSpinner className="py-32" />;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Category header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{category?.name}</h1>
                {category?.description && (
                    <p className="mt-2 text-gray-600">{category.description}</p>
                )}
            </div>

            {loadingProducts ? (
                <LoadingSpinner className="py-20" />
            ) : !productsData || productsData.data.length === 0 ? (
                <EmptyState
                    icon={<ShoppingBagIcon className="h-12 w-12" />}
                    title="No products in this category"
                    description="Check back later for new arrivals."
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {productsData.data.map((product) => (
                            <ProductCard key={product.uuid} product={product} />
                        ))}
                    </div>
                    <Pagination
                        currentPage={productsData.meta.current_page}
                        lastPage={productsData.meta.last_page}
                        onPageChange={(page) =>
                            navigate({ search: () => ({ page }) })
                        }
                    />
                </>
            )}
        </div>
    );
}
