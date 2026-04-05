<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->user()->id;

        return [
            'shipping_address_id' => [
                'required',
                'string',
                Rule::exists('addresses', 'uuid')->where('user_id', $userId),
            ],
            'billing_address_id' => [
                'nullable',
                'string',
                Rule::exists('addresses', 'uuid')->where('user_id', $userId),
            ],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
