import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Plus, Loader2, Calendar, DollarSign, User, Tag, ArrowUpRight } from "lucide-react";

interface Sale {
  id: number;
  customer?: { name: string };
  pig: { type: string; id: number };
  qty: number;
  total_price: number;
  sale_date: string;
  payment_method: string;
}

const Sales = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Sale[]>([]);
  const [pigs, setPigs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state - using strings for numeric inputs to fix deletion bug
  const [formData, setFormData] = useState({
    pig_id: "",
    qty: "1",
    total_price: "0",
    sale_date: new Date().toISOString().split("T")[0],
    customer_name: "",
    customer_contact: "",
    customer_address: "",
    payment_method: "Cash",
  });

  const fetchData = async () => {
    try {
      const [resS, resP] = await Promise.all([
        fetch("/sales"),
        fetch("/pigs"),
      ]);
      if (resS.ok) {
        const data = await resS.json();
        setItems(data);
      }
      if (resP.ok) {
        const pData = await resP.json();
        setPigs(pData.filter((p: any) => p.status === "For Sale" && p.qty > 0));
      }
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
    const updated = { ...formData, [key]: clean };
    
    // Auto-calculate price if pig is selected and qty changed
    if (key === "qty" && formData.pig_id) {
      const pig = pigs.find(p => p.id == formData.pig_id);
      if (pig) {
        const q = parseInt(clean) || 0;
        updated.total_price = String(pig.price * q);
      }
    }
    setFormData(updated);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
        body: JSON.stringify({
          ...formData,
          qty: parseInt(formData.qty) || 0,
          total_price: parseInt(formData.total_price) || 0
        }),
      });

      if (res.ok) {
        fetchData();
        setShowForm(false);
        toast({ title: "Sale recorded", description: "Inventory updated automatically." });
      } else {
        const data = await res.json();
        toast({ variant: "destructive", title: "Error", description: data.message || "Failed to record sale." });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Server error." });
    }
  };

  const TYPE_LABEL: any = { inahin: "Sow", platining: "Grower", biik: "Piglet" };

  return (
    <AdminLayout title="Sales & Orders">
      <div className="p-6 lg:p-10 space-y-8 animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-rattan mb-2">Revenue</p>
            <h2 className="font-display text-4xl font-medium text-leaf">Sales Orders</h2>
            <p className="mt-2 text-earth/60">Manage direct sales and record transactions.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 rounded-full bg-leaf px-6 py-3 text-sm font-medium text-sun hover:bg-leaf-deep transition-all shadow-soft self-start"
          >
            <Plus className="size-4" /> New Sale Entry
          </button>
        </header>

        {showForm && (
          <section className="rounded-3xl bg-white border border-straw shadow-card p-7 animate-fade-in">
            <h3 className="font-display text-2xl text-leaf font-medium mb-6">Record New Transaction</h3>
            <form onSubmit={submit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Select Pig *</label>
                  <select
                    value={formData.pig_id}
                    onChange={(e) => {
                      const pig = pigs.find(p => p.id == e.target.value);
                      const q = parseInt(formData.qty) || 0;
                      setFormData({ 
                        ...formData, 
                        pig_id: e.target.value, 
                        total_price: pig ? String(pig.price * q) : "0" 
                      });
                    }}
                    className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20"
                    required
                  >
                    <option value="">-- Choose available pig --</option>
                    {pigs.map(p => (
                      <option key={p.id} value={p.id}>CS-{String(p.id).padStart(3, '0')} ({TYPE_LABEL[p.type]}) - ₱{p.price}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Quantity *</label>
                  <input
                    type="text"
                    value={formData.qty}
                    onChange={(e) => handleNumericInput(e.target.value, "qty")}
                    placeholder="0"
                    className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Total Price (₱)</label>
                  <input
                    type="text"
                    value={formData.total_price}
                    onChange={(e) => handleNumericInput(e.target.value, "total_price")}
                    placeholder="0"
                    className="w-full rounded-2xl border border-straw bg-leaf/5 px-4 py-3 font-bold text-leaf focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Customer Name</label>
                  <input
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Contact info</label>
                  <input
                    value={formData.customer_contact}
                    onChange={(e) => setFormData({ ...formData, customer_contact: e.target.value })}
                    placeholder="Phone / Social"
                    className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Payment Method</label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none"
                  >
                    <option>Cash</option>
                    <option>GCash</option>
                    <option>Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="rounded-2xl bg-leaf px-8 py-4 text-sm font-semibold text-sun hover:bg-leaf-deep transition-all shadow-leaf">
                  Finalize Sale
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="rounded-2xl border border-straw px-6 py-4 text-sm font-medium text-earth/60 hover:bg-sun">
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {isLoading ? (
          <div className="py-20 text-center">
            <Loader2 className="size-10 animate-spin text-leaf/30 mx-auto" />
            <p className="text-earth/50 mt-4">Loading sales history...</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl bg-white border border-straw shadow-card">
            <table className="w-full text-left">
              <thead className="bg-sun/60 text-[10px] uppercase tracking-widest text-earth/50 font-bold">
                <tr>
                  <th className="px-6 py-4">Sale ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Buyer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-straw/70">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center text-earth/50 text-sm">
                      No sales recorded yet.
                    </td>
                  </tr>
                ) : (
                  items.map((i) => (
                    <tr key={i.id} className="hover:bg-sun/40 transition-colors">
                      <td className="px-6 py-5 text-sm font-mono text-earth/60">SAL-{String(i.id).padStart(4, '0')}</td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-leaf font-medium">{new Date(i.sale_date).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <User className="size-3.5 text-rattan" />
                          <span className="text-sm text-earth/80 font-medium">{i.customer?.name || 'Walk-in Buyer'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Tag className="size-3.5 text-leaf/40" />
                          <span className="text-sm text-earth/70">{i.qty}× {TYPE_LABEL[i.pig.type]} (CS-{String(i.pig.id).padStart(3, '0')})</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-display font-bold text-leaf">
                        ₱{Number(i.total_price).toLocaleString()}
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[10px] font-bold uppercase bg-straw px-2 py-1 rounded-md text-rattan">
                          {i.payment_method}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <button className="size-8 rounded-lg hover:bg-straw flex items-center justify-center text-earth/40">
                          <ArrowUpRight className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Sales;
