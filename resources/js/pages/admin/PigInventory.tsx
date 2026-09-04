import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Trash2, Loader2 } from "lucide-react";

type PigType = "inahin" | "platining" | "biik";
type Gender = "Male" | "Female";
type Status = "For Sale" | "Sold";

interface PigRow {
  id: number;
  type: PigType;
  name?: string;
  gender: Gender;
  price: number;
  qty: number;
  status: Status;
}

const TYPE_LABEL: Record<PigType, string> = {
  inahin: "Inahin (Sow)",
  platining: "Platining (Grower)",
  biik: "Biik (Piglet)",
};

const PigInventory = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<PigRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [type, setType] = useState<PigType>("biik");
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("Female");
  const [price, setPrice] = useState<string>("4500");
  const [qty, setQty] = useState<string>("1");

  const fetchPigs = async () => {
    try {
      const res = await fetch("/pigs");
      if (res.ok) {
        const data = await res.json();
        setRows(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPigs();
  }, []);

  const handleNumericInput = (val: string, setter: (v: string) => void) => {
    const clean = val.replace(/[^0-9]/g, "");
    setter(clean);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For Sows, we default values that are hidden
    const payload = {
      type,
      name: type === "inahin" ? name : null,
      gender: type === "inahin" ? "Female" : gender,
      price: type === "inahin" ? 0 : (parseInt(price) || 0),
      qty: type === "inahin" ? 1 : (parseInt(qty) || 0),
      status: type === "inahin" ? "Sold" : "For Sale"
    };

    try {
      const res = await fetch("/pigs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchPigs();
        setShowForm(false);
        setName("");
        toast({ title: "Pig registered", description: `${TYPE_LABEL[type]} added to inventory.` });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save pig record." });
    }
  };

  const toggleStatus = async (id: number) => {
    const pig = rows.find(r => r.id === id);
    if (!pig) return;

    const newStatus = pig.status === "For Sale" ? "Sold" : "For Sale";
    
    try {
      const res = await fetch(`/pigs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setRows(rows.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
        toast({ title: "Status updated", description: `Record updated to ${newStatus}.` });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update status." });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this record? This cannot be undone.")) return;

    try {
      const res = await fetch(`/pigs/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
      });

      if (res.ok) {
        setRows(rows.filter((r) => r.id !== id));
        toast({ title: "Record deleted", description: "The pig record has been removed." });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete record." });
    }
  };

  return (
    <AdminLayout title="Pig Inventory">
      <div className="p-6 lg:p-10 space-y-8 animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-rattan mb-2">
              Inventory
            </p>
            <h2 className="font-display text-4xl font-medium text-leaf">Pig Records</h2>
            <p className="mt-2 text-earth/60">Manage your farm livestock registry.</p>
          </div>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="inline-flex items-center gap-2 rounded-full bg-leaf px-6 py-3 text-sm font-medium text-sun hover:bg-leaf-deep transition-all shadow-soft self-start"
          >
            <Plus className="size-4" />
            Register New Pig
          </button>
        </header>

        {/* Registration Form */}
        {showForm && (
          <section className="rounded-3xl bg-white border border-straw shadow-card p-7 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <h3 className="font-display text-2xl text-leaf font-medium">Quick Registration</h3>
                <p className="text-sm text-earth/60 mt-2 leading-relaxed">
                  {type === "inahin" 
                    ? "For Sows, we only track the individual name. Gender is set to Female automatically."
                    : "Register batches of pigs by type and gender for the marketplace."}
                </p>
              </div>

              <form onSubmit={submit} className="lg:col-span-2 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">
                      Pig Type *
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as PigType)}
                      className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20"
                    >
                      <option value="biik">Biik (Piglet)</option>
                      <option value="platining">Platining (Grower)</option>
                      <option value="inahin">Inahin (Sow)</option>
                    </select>
                  </div>

                  {type === "inahin" ? (
                    <div className="space-y-1.5 animate-fade-in">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">
                        Name of the Pig *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Bessie"
                        className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20"
                        required
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5 animate-fade-in">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">
                        Gender *
                      </label>
                      <div className="flex gap-2">
                        {(["Male", "Female"] as Gender[]).map((g) => (
                          <button
                            type="button"
                            key={g}
                            onClick={() => setGender(g)}
                            className={`flex-1 rounded-2xl py-3 text-sm font-medium transition-all ${
                              gender === g
                                ? "bg-leaf text-sun shadow-soft"
                                : "bg-sun/40 border border-straw text-earth/60 hover:border-leaf/30"
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {type !== "inahin" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">
                        Price (₱)
                      </label>
                      <input
                        type="text"
                        value={price}
                        onChange={(e) => handleNumericInput(e.target.value, setPrice)}
                        placeholder="0"
                        className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20 tabular-nums"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">
                        Quantity Available
                      </label>
                      <input
                        type="text"
                        value={qty}
                        onChange={(e) => handleNumericInput(e.target.value, setQty)}
                        placeholder="0"
                        className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20 tabular-nums"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="rounded-2xl bg-leaf px-7 py-3 text-sm font-semibold text-sun hover:bg-leaf-deep transition-all shadow-soft"
                  >
                    Save to Inventory
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-2xl border border-straw bg-white px-7 py-3 text-sm font-medium text-earth/60 hover:bg-sun transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* Table */}
        <section className="rounded-3xl bg-white border border-straw shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-straw flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-medium text-leaf">All Pigs</h3>
              <p className="text-xs text-earth/50">{rows.length} records</p>
            </div>
            <div className="relative md:w-72">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-earth/40" />
              <input
                placeholder="Search records..."
                className="w-full rounded-full bg-sun border border-straw pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-leaf/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-sun/60 text-[10px] uppercase tracking-widest text-earth/50 font-bold">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Name / Gender</th>
                  <th className="px-6 py-3 text-right">Price</th>
                  <th className="px-6 py-3 text-right">Qty</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-straw/70">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <Loader2 className="size-8 animate-spin text-leaf/40 mx-auto" />
                      <p className="text-sm text-earth/50 mt-3">Loading inventory...</p>
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <p className="text-sm text-earth/50">No pigs registered yet.</p>
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="hover:bg-sun/40 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-earth/60">
                        CS-{String(r.id).padStart(3, "0")}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-leaf">{TYPE_LABEL[r.type]}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-earth/70">
                        {r.type === "inahin" ? (
                          <span className="font-semibold text-leaf">"{r.name || "Unnamed"}"</span>
                        ) : (
                          r.gender
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-leaf text-right tabular-nums">
                        {r.type === "inahin" ? "—" : `₱${Number(r.price).toLocaleString()}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-earth/70 text-right tabular-nums">
                        {r.type === "inahin" ? "1" : r.qty}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleStatus(r.id)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                            r.status === "For Sale"
                              ? "bg-leaf/10 text-leaf hover:bg-leaf/20"
                              : "bg-earth/10 text-earth/60 hover:bg-earth/15"
                          }`}
                        >
                          {r.status}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(r.id)}
                          className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors ml-auto"
                          title="Delete Record"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default PigInventory;
