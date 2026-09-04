import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Wheat, Plus, AlertTriangle, Loader2, Package, ShoppingBag, TrendingDown } from "lucide-react";

interface FeedStock {
  id: number;
  name: string;
  qty_sacks: number;
  min_threshold: number;
  last_delivery?: string;
  price_per_sack?: number;
}

const Feed = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<FeedStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state - using strings for numeric fields to fix deletion bug
  const [formData, setFormData] = useState({
    name: "Hog Starter",
    qty_sacks: "0",
    min_threshold: "10",
    price_per_sack: "0",
    last_delivery: new Date().toISOString().split("T")[0],
  });

  const fetchData = async () => {
    try {
      const res = await fetch("/feed-stocks");
      if (res.ok) setItems(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNumericInput = (val: string, key: string) => {
    const clean = val.replace(/[^0-9]/g, "");
    setFormData(prev => ({ ...prev, [key]: clean }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/feed-stocks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
        body: JSON.stringify({
          ...formData,
          qty_sacks: parseInt(formData.qty_sacks) || 0,
          min_threshold: parseInt(formData.min_threshold) || 0,
          price_per_sack: parseInt(formData.price_per_sack) || 0,
        }),
      });

      if (res.ok) {
        fetchData();
        setShowForm(false);
        toast({ title: "Feed added", description: "Inventory record created." });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save feed data." });
    }
  };

  const updateStock = async (id: number, current: number, change: number) => {
    try {
      const res = await fetch(`/feed-stocks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
        body: JSON.stringify({ qty_sacks: Math.max(0, current + change) }),
      });

      if (res.ok) {
        setItems(items.map(i => i.id === id ? { ...i, qty_sacks: Math.max(0, current + change) } : i));
        toast({ title: "Stock updated", description: "Quantity adjusted." });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Update failed." });
    }
  };

  return (
    <AdminLayout title="Feed & Nutrition">
      <div className="p-6 lg:p-10 space-y-8 animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-rattan mb-2">Inventory Control</p>
            <h2 className="font-display text-4xl font-medium text-leaf">Feed & Nutrition</h2>
            <p className="mt-2 text-earth/60">Manage feed types, stock levels, and reorder thresholds.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 rounded-full bg-leaf px-6 py-3 text-sm font-medium text-sun hover:bg-leaf-deep transition-all shadow-soft self-start"
          >
            <Plus className="size-4" /> Add Feed Type
          </button>
        </header>

        {showForm && (
          <section className="rounded-3xl bg-white border border-straw shadow-card p-7 animate-fade-in">
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Feed Name *</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Hog Grower"
                  className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Initial Stock (Sacks)</label>
                <input
                  type="text"
                  value={formData.qty_sacks}
                  onChange={(e) => handleNumericInput(e.target.value, "qty_sacks")}
                  placeholder="0"
                  className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Min Threshold</label>
                <input
                  type="text"
                  value={formData.min_threshold}
                  onChange={(e) => handleNumericInput(e.target.value, "min_threshold")}
                  placeholder="0"
                  className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Price / Sack</label>
                <input
                  type="text"
                  value={formData.price_per_sack}
                  onChange={(e) => handleNumericInput(e.target.value, "price_per_sack")}
                  placeholder="0"
                  className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 rounded-2xl bg-leaf px-7 py-3 text-sm font-semibold text-sun hover:bg-leaf-deep transition-all shadow-soft">
                  Save Feed
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="rounded-2xl border border-straw px-5 py-3 text-sm font-medium text-earth/60 hover:bg-sun transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {isLoading ? (
          <div className="py-20 text-center">
            <Loader2 className="size-10 animate-spin text-leaf/30 mx-auto" />
            <p className="text-earth/50 mt-4">Loading nutrition data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-straw">
                <p className="text-earth/50">No feed inventory registered.</p>
              </div>
            ) : (
              items.map((i) => {
                const isLow = i.qty_sacks <= i.min_threshold;
                return (
                  <article key={i.id} className={`rounded-3xl p-6 border transition-all ${
                    isLow ? 'bg-orange-50 border-orange-200' : 'bg-white border-straw shadow-card'
                  }`}>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`size-12 rounded-2xl flex items-center justify-center ${
                          isLow ? 'bg-orange-200 text-orange-700' : 'bg-straw text-leaf'
                        }`}>
                          <Wheat className="size-6" />
                        </div>
                        <div>
                          <h4 className="font-display text-xl font-medium text-leaf">{i.name}</h4>
                          <p className="text-xs text-earth/50">Threshold: {i.min_threshold} sacks</p>
                        </div>
                      </div>
                      {isLow && (
                        <div className="flex items-center gap-1.5 text-orange-700 bg-orange-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
                          <AlertTriangle className="size-3" /> Low Stock
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-sun/40 rounded-2xl p-4">
                        <p className="text-[10px] uppercase tracking-wider text-earth/40">Current Stock</p>
                        <p className="text-3xl font-display font-semibold text-leaf tabular-nums mt-1">{i.qty_sacks} <span className="text-xs font-normal text-earth/50">sacks</span></p>
                      </div>
                      <div className="bg-sun/40 rounded-2xl p-4">
                        <p className="text-[10px] uppercase tracking-wider text-earth/40">Value / Sack</p>
                        <p className="text-xl font-display font-medium text-leaf tabular-nums mt-2">₱{Number(i.price_per_sack || 0).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateStock(i.id, i.qty_sacks, 1)}
                        className="flex-1 rounded-xl bg-leaf text-sun py-2.5 text-xs font-bold hover:bg-leaf-deep transition-all shadow-soft flex items-center justify-center gap-2"
                      >
                        <Package className="size-3.5" /> +1 Sack
                      </button>
                      <button 
                        onClick={() => updateStock(i.id, i.qty_sacks, -1)}
                        className="flex-1 rounded-xl bg-white border border-straw text-earth/70 py-2.5 text-xs font-bold hover:bg-sun transition-all flex items-center justify-center gap-2"
                      >
                        <TrendingDown className="size-3.5" /> -1 Sack
                      </button>
                      <button className="size-10 rounded-xl border border-straw flex items-center justify-center text-earth/40 hover:bg-sun">
                        <ShoppingBag className="size-4" />
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Feed;
