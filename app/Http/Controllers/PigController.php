<?php

namespace App\Http\Controllers;

use App\Models\Pig;
use Illuminate\Http\Request;

class PigController extends Controller
{
    public function index()
    {
        return Pig::latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:inahin,platining,biik',
            'name' => 'nullable|string',
            'gender' => 'required|in:Male,Female',
            'price' => 'nullable|numeric',
            'qty' => 'required|integer|min:0',
            'status' => 'required|in:For Sale,Sold',
            'notes' => 'nullable|string',
        ]);

        return Pig::create($validated);
    }

    public function show(Pig $pig)
    {
        return $pig;
    }

    public function update(Request $request, Pig $pig)
    {
        $validated = $request->validate([
            'type' => 'sometimes|required|in:inahin,platining,biik',
            'name' => 'sometimes|nullable|string',
            'gender' => 'sometimes|required|in:Male,Female',
            'price' => 'sometimes|nullable|numeric',
            'qty' => 'sometimes|required|integer|min:0',
            'status' => 'sometimes|required|in:For Sale,Sold',
            'notes' => 'sometimes|nullable|string',
        ]);

        $pig->update($validated);
        return $pig;
    }

    public function destroy(Pig $pig)
    {
        $pig->delete();
        return response()->json(['message' => 'Pig deleted successfully']);
    }
}
