<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Pig;
use App\Models\Inquiry;
use App\Models\BreedingRecord;
use App\Models\HealthRecord;
use App\Models\FeedStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index()
    {
        return response()->json([
            'summary' => [
                'total_revenue' => Sale::sum('total_price'),
                'total_sales' => Sale::count(),
                'pending_inquiries' => Inquiry::where('status', 'New')->count(),
                'active_gestations' => BreedingRecord::where('status', 'Active')->count(),
            ],
            'inventory' => [
                'inahin' => Pig::where('type', 'inahin')->sum('qty'),
                'platining' => Pig::where('type', 'platining')->sum('qty'),
                'biik' => Pig::where('type', 'biik')->sum('qty'),
            ],
            'recent_sales' => Sale::with(['customer', 'pig'])->latest()->limit(5)->get(),
            'stock_alerts' => FeedStock::whereRaw('qty_sacks <= min_threshold')->get(),
        ]);
    }
}
