<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\UpdateAddressRequest;
use App\Http\Resources\AddressResource;
use App\Models\Address;
use Illuminate\Http\JsonResponse;

class AddressController extends Controller
{
    public function index()
    {
        $addresses = auth()->user()->addresses()->latest()->paginate(20);

        return AddressResource::collection($addresses);
    }

    public function store(StoreAddressRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        if (! empty($data['is_default'])) {
            $user->addresses()->update(['is_default' => false]);
        }

        $address = $user->addresses()->create($data);

        return (new AddressResource($address))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateAddressRequest $request, Address $address): AddressResource
    {
        abort_unless($address->user_id === auth()->id(), 403, 'This address does not belong to you.');

        $data = $request->validated();

        if (! empty($data['is_default'])) {
            auth()->user()->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
        }

        $address->update($data);

        return new AddressResource($address);
    }

    public function destroy(Address $address): JsonResponse
    {
        abort_unless($address->user_id === auth()->id(), 403, 'This address does not belong to you.');

        $address->delete();

        return response()->json(null, 204);
    }
}
