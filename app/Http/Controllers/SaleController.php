<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Pig;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function index()
    {
        return Sale::with(['customer', 'pig'])->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'pig_id' => 'required|exists:pigs,id',
            'qty' => 'required|integer|min:1',
            'total_price' => 'required|numeric',
            'sale_date' => 'required|date',
        ]);

        return DB::transaction(function () use ($request) {
            $pig = Pig::findOrFail($request->pig_id);
            
            if ($pig->qty < $request->qty) {
                return response()->json(['message' => 'Insufficient stock'], 422);
            }

            // Create or update customer if info provided
            $customer = null;
            if ($request->customer_name) {
                $customer = Customer::firstOrCreate(
                    ['name' => $request->customer_name],
                    ['contact' => $request->customer_contact, 'address' => $request->customer_address]
                );
                $customer->increment('total_purchases');
            }

            $sale = Sale::create([
                'customer_id' => $customer?->id,
                'pig_id' => $request->pig_id,
                'qty' => $request->qty,
                'total_price' => $request->total_price,
                'sale_date' => $request->sale_date,
                'payment_method' => $request->payment_method ?? 'Cash',
            ]);

            // Deduct from pig inventory
            $pig->decrement('qty', $request->qty);
            if ($pig->qty <= 0) {
                $pig->update(['status' => 'Sold']);
            }

            return response()->json($sale, 201);
        });
    }

    public function destroy(Sale $sale)
    {
        $sale->delete();
        return response()->json(null, 204);
    }
}
