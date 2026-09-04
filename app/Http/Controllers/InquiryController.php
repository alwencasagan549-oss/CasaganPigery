<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class InquiryController extends Controller
{
    public function index()
    {
        return Inquiry::with('pig')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pig_id' => 'required|exists:pigs,id',
            'fb_id' => 'nullable|string',
            'fb_profile_pic' => 'nullable|string',
            'customer_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'qty' => 'required|integer|min:1',
            'message' => 'nullable|string',
        ]);

        $validated['status'] = 'New';

        // Save/Update Customer record
        Customer::updateOrCreate(
            ['name' => $validated['customer_name']],
            [
                'contact' => $validated['phone'],
                'address' => $validated['address']
            ]
        );

        return Inquiry::create([
            'pig_id' => $validated['pig_id'],
            'fb_id' => $validated['fb_id'],
            'fb_profile_pic' => $validated['fb_profile_pic'],
            'customer_name' => $validated['customer_name'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'qty' => $validated['qty'],
            'message' => $validated['message'],
            'status' => $validated['status'],
        ]);
    }

    public function update(Request $request, Inquiry $inquiry)
    {
        $validated = $request->validate([
            'status' => 'required|in:New,Contacted,Completed,Cancelled',
        ]);

        $inquiry->update($validated);
        return $inquiry;
    }

    public function destroy(Inquiry $inquiry)
    {
        $inquiry->delete();
        return response()->json(['message' => 'Inquiry deleted successfully']);
    }
}
