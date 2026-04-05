<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'label' => ['nullable', 'string', 'max:50'],
            'address_line_1' => ['required', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:20'],
            'country' => ['string', 'max:2'],
            'phone' => ['nullable', 'string', 'max:20'],
            'is_default' => ['boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if (! $this->has('country')) {
            $this->merge(['country' => 'PH']);
        }
    }
}
