import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { FileText, Loader2, TrendingUp, DollarSign, Package, AlertTriangle, ArrowDown } from "lucide-react";

const Reports = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/reports-data")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setIsLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (isLoading) {
    return (
      <AdminLayout title="System Reports">
        <div className="py-40 text-center">
          <Loader2 className="size-10 animate-spin text-leaf/30 mx-auto" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="System Reports">
      <div className="p-6 lg:p-10 space-y-10 animate-fade-in">
        <header>
          <p className="text-xs font-bold uppercase tracking-widest text-rattan mb-2">Analytics</p>
          <h2 className="font-display text-4xl font-medium text-leaf">Farm Intelligence</h2>
          <p className="mt-2 text-earth/60">Comprehensive overview of revenue, inventory, and alerts.</p>
        </header>

        {/* Financials */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-leaf rounded-3xl p-8 text-sun shadow-leaf relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] opacity-10">
              <DollarSign size={160} />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70">Total Revenue</p>
            <p className="text-5xl font-display font-bold mt-4">₱{Number(data.summary.total_revenue).toLocaleString()}</p>
            <p className="text-sm mt-4 opacity-80 flex items-center gap-2">
              <TrendingUp className="size-4" /> Lifetime earnings
            </p>
          </div>
          <div className="bg-white border border-straw rounded-3xl p-8 shadow-card">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-rattan">Total Sales</p>
            <p className="text-5xl font-display font-bold text-leaf mt-4">{data.summary.total_sales}</p>
            <p className="text-sm mt-4 text-earth/50">Successful transactions</p>
          </div>
          <div className="bg-white border border-straw rounded-3xl p-8 shadow-card">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-rattan">Pending Requests</p>
            <p className="text-5xl font-display font-bold text-leaf mt-4">{data.summary.pending_inquiries}</p>
            <p className="text-sm mt-4 text-earth/50">Active customer inquiries</p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inventory Distribution */}
          <section className="bg-white border border-straw rounded-3xl p-8 shadow-card">
            <h3 className="font-display text-2xl text-leaf font-medium mb-8">Inventory Distribution</h3>
            <div className="space-y-6">
              {[
                { label: "Inahin (Sows)", value: data.inventory.inahin, color: "bg-leaf" },
                { label: "Platining (Growers)", value: data.inventory.platining, color: "bg-rattan" },
                { label: "Biik (Piglets)", value: data.inventory.biik, color: "bg-straw" },
              ].map((item, idx) => {
                const total = data.inventory.inahin + data.inventory.platining + data.inventory.biik || 1;
                const pct = (item.value / total) * 100;
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-sm font-medium text-leaf mb-2">
                      <span>{item.label}</span>
                      <span>{item.value} heads ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-3 rounded-full bg-straw overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recent Performance */}
          <section className="bg-white border border-straw rounded-3xl p-8 shadow-card">
            <h3 className="font-display text-2xl text-leaf font-medium mb-6">Recent Sales</h3>
            <div className="space-y-4">
              {data.recent_sales.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between py-3 border-b border-straw last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-sun flex items-center justify-center text-leaf font-bold">
                      {s.qty}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-leaf">{s.customer?.name || 'Walk-in'}</p>
                      <p className="text-[10px] text-earth/50 uppercase">{new Date(s.sale_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-leaf">₱{Number(s.total_price).toLocaleString()}</p>
                </div>
              ))}
              {data.recent_sales.length === 0 && <p className="text-center py-10 text-earth/40">No recent sales data.</p>}
            </div>
          </section>
        </div>

        {/* Critical Alerts */}
        {data.stock_alerts.length > 0 && (
          <section className="bg-orange-50 border border-orange-200 rounded-3xl p-8">
            <div className="flex items-center gap-2 text-orange-700 mb-6">
              <AlertTriangle className="size-6" />
              <h3 className="font-display text-2xl font-medium">Critical Stock Alerts</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.stock_alerts.map((a: any) => (
                <div key={a.id} className="bg-white rounded-2xl p-4 border border-orange-200 shadow-sm">
                  <p className="text-xs font-bold text-orange-800 uppercase">{a.name}</p>
                  <p className="text-2xl font-display font-bold text-leaf mt-1">{a.qty_sacks} sacks left</p>
                  <p className="text-[10px] text-orange-600 font-medium mt-1">Below threshold of {a.min_threshold}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </AdminLayout>
  );
};

export default Reports;
