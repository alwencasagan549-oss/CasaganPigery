<?php

namespace App\Http\Controllers;

use App\Models\FeedStock;
use Illuminate\Http\Request;

class FeedStockController extends Controller
{
    public function index()
    {
        return FeedStock::all();
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string']);
        return FeedStock::create($request->all());
    }

    public function update(Request $request, FeedStock $feedStock)
    {
        $feedStock->update($request->all());
        return response()->json($feedStock);
    }

    public function destroy(FeedStock $feedStock)
    {
        $feedStock->delete();
        return response()->json(null, 204);
    }
}
