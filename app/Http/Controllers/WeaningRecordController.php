<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

class WeaningRecordController extends Controller
{
    public function index()
    {
        try {
            return \App\Models\WeaningRecord::with('pig')->latest()->get();
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $farrowingDate = Carbon::parse($request->farrowing_date);
            $expectedDate = $farrowingDate->copy()->addDays(28);

            $record = \App\Models\WeaningRecord::create([
                'pig_id' => $request->pig_id,
                'farrowing_date' => $request->farrowing_date,
                'expected_weaning_date' => $expectedDate->toDateString(),
                'status' => 'Active',
                'litter_size' => $request->litter_size,
            ]);

            return response()->json($record, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $weaningRecord = \App\Models\WeaningRecord::findOrFail($id);
            $data = $request->all();
            
            if (isset($data['farrowing_date'])) {
                $farrowingDate = Carbon::parse($data['farrowing_date']);
                $data['expected_weaning_date'] = $farrowingDate->copy()->addDays(28)->toDateString();
            }

            $weaningRecord->update($data);
            return response()->json($weaningRecord);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $weaningRecord = \App\Models\WeaningRecord::findOrFail($id);
            $weaningRecord->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
