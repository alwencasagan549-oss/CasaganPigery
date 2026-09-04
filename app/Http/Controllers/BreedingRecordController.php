<?php

namespace App\Http\Controllers;

use App\Models\BreedingRecord;
use App\Models\Pig;
use Illuminate\Http\Request;
use Carbon\Carbon;

class BreedingRecordController extends Controller
{
    public function index()
    {
        return BreedingRecord::with('pig')->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'pig_id' => 'required|exists:pigs,id',
            'service_date' => 'required|date',
        ]);

        $serviceDate = Carbon::parse($request->service_date);
        $expectedDate = $serviceDate->copy()->addDays(114);

        $record = BreedingRecord::create([
            'pig_id' => $request->pig_id,
            'service_date' => $request->service_date,
            'expected_farrowing_date' => $expectedDate->toDateString(),
            'status' => 'Active',
        ]);

        return response()->json($record, 201);
    }

    public function update(Request $request, BreedingRecord $breedingRecord)
    {
        $data = $request->all();
        
        if (isset($data['service_date'])) {
            $serviceDate = Carbon::parse($data['service_date']);
            $data['expected_farrowing_date'] = $serviceDate->copy()->addDays(114)->toDateString();
        }

        $oldStatus = $breedingRecord->status;
        $breedingRecord->update($data);

        // Automatically create weaning record if marked as Farrowed
        if ($oldStatus !== 'Farrowed' && $breedingRecord->status === 'Farrowed') {
            \App\Models\WeaningRecord::create([
                'pig_id' => $breedingRecord->pig_id,
                'farrowing_date' => Carbon::now()->toDateString(),
                'expected_weaning_date' => Carbon::now()->addDays(28)->toDateString(),
                'status' => 'Active',
                'litter_size' => $breedingRecord->litter_size,
            ]);
        }

        return response()->json($breedingRecord);
    }

    public function destroy(BreedingRecord $breedingRecord)
    {
        $breedingRecord->delete();
        return response()->json(null, 204);
    }
}
