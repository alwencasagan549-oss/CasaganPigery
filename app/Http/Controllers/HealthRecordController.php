<?php

namespace App\Http\Controllers;

use App\Models\HealthRecord;
use Illuminate\Http\Request;

class HealthRecordController extends Controller
{
    public function index()
    {
        return HealthRecord::with('pig')->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'pig_id' => 'required|exists:pigs,id',
            'type' => 'required|string',
            'date' => 'required|date',
            'description' => 'required|string',
        ]);

        return HealthRecord::create($request->all());
    }

    public function update(Request $request, HealthRecord $healthRecord)
    {
        $healthRecord->update($request->all());
        return response()->json($healthRecord);
    }

    public function destroy(HealthRecord $healthRecord)
    {
        $healthRecord->delete();
        return response()->json(null, 204);
    }
}
