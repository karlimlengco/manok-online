<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ProductController extends Controller
{
    public function index()
    {
        $products = QueryBuilder::for(Product::class)
            ->allowedFilters(
                AllowedFilter::exact('status'),
                AllowedFilter::exact('is_featured'),
                AllowedFilter::partial('name'),
                AllowedFilter::exact('breed'),
            )
            ->allowedSorts('price', 'created_at', 'name', 'stock')
            ->defaultSort('-created_at')
            ->with(['category', 'images'])
            ->paginate(15);

        return ProductResource::collection($products);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $data = $request->validated();

        $category = Category::where('uuid', $data['category_uuid'])->firstOrFail();
        unset($data['category_uuid']);
        $data['category_id'] = $category->id;

        $product = Product::create($data);
        $product->load(['category', 'images']);

        return (new ProductResource($product))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Product $product): ProductResource
    {
        $product->load(['category', 'images']);

        return new ProductResource($product);
    }

    public function update(UpdateProductRequest $request, Product $product): ProductResource
    {
        $data = $request->validated();

        if (isset($data['category_uuid'])) {
            $category = Category::where('uuid', $data['category_uuid'])->firstOrFail();
            unset($data['category_uuid']);
            $data['category_id'] = $category->id;
        }

        $product->update($data);
        $product->load(['category', 'images']);

        return new ProductResource($product);
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json(null, 204);
    }
}
