<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable(['product_id', 'path', 'alt', 'sort_order'])]
class ProductImage extends Model
{
    use HasFactory;
    protected static function boot(): void
    {
        parent::boot();

        static::creating(fn ($model) => $model->uuid = $model->uuid ?? Str::uuid()->toString());
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
