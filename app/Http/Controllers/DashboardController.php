<?php

namespace App\Http\Controllers;

use App\Models\Pig;
use App\Models\Inquiry;
use App\Models\BreedingRecord;
use App\Models\FeedStock;
use App\Models\Sale;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_pigs' => Pig::sum('qty'),
            'for_sale' => Pig::where('status', 'For Sale')->sum('qty'),
            'pending_inquiries' => Inquiry::where('status', 'New')->count(),
            'active_gestations' => BreedingRecord::where('status', 'Active')->count(),
            'due_soon_count' => BreedingRecord::where('status', 'Active')
                ->whereDate('expected_farrowing_date', '<=', now()->addDays(7))
                ->count(),
            'total_revenue' => Sale::sum('total_price'),
            'low_stock_feeds' => FeedStock::whereRaw('qty_sacks <= min_threshold')->count(),
        ]);
    }
}
