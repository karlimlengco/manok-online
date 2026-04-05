<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedInclude;
use Spatie\QueryBuilder\QueryBuilder;

class ProductController extends Controller
{
    public function index()
    {
        $products = QueryBuilder::for(Product::active())
            ->allowedFilters(
                AllowedFilter::exact('category.slug', 'category.slug'),
                AllowedFilter::exact('breed'),
                AllowedFilter::exact('status'),
                AllowedFilter::exact('is_featured'),
            )
            ->allowedSorts('price', 'created_at', 'name')
            ->allowedIncludes(
                AllowedInclude::relationship('category'),
                AllowedInclude::relationship('images'),
            )
            ->defaultSort('-created_at')
            ->with('images')
            ->paginate(12);

        return ProductResource::collection($products);
    }

    public function show(Product $product): ProductResource
    {
        $product->load(['category', 'images']);

        return new ProductResource($product);
    }
}
