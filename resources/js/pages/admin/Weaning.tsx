import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Baby, Plus, Calendar, Loader2, TrendingUp, CheckCircle2, Trash2, Pencil, Waves } from "lucide-react";

interface Pig {
  id: number;
  type: string;
  name?: string;
  gender: string;
}

interface WeaningRecord {
  id: number;
  pig_id: number;
  pig: Pig;
  farrowing_date: string;
  expected_weaning_date: string;
  actual_weaning_date?: string;
  status: "Active" | "Completed";
  litter_size?: number;
}

const Weaning = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<WeaningRecord[]>([]);
  const [pigs, setPigs] = useState<Pig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [selectedPigId, setSelectedPigId] = useState("");
  const [farrowingDate, setFarrowingDate] = useState(new Date().toISOString().split("T")[0]);
  const [litterSize, setLitterSize] = useState("");

  const fetchData = async () => {
    try {
      const [resW, resP] = await Promise.all([
        fetch("/weaning-records"),
        fetch("/pigs"),
      ]);
      if (resW.ok) setItems(await resW.json());
      if (resP.ok) {
        const allPigs = await resP.json();
        setPigs(allPigs.filter((p: any) => p.type === "inahin"));
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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPigId) return;

    const url = editingId 
      ? `/weaning-records/${editingId}`
      : "/weaning-records";
    
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
        body: JSON.stringify({ 
          pig_id: selectedPigId, 
          farrowing_date: farrowingDate,
          litter_size: litterSize ? parseInt(litterSize) : null
        }),
      });

      if (res.ok) {
        fetchData();
        setShowForm(false);
        setEditingId(null);
        setSelectedPigId("");
        setLitterSize("");
        toast({ 
          title: editingId ? "Record updated" : "Weaning started", 
          description: "Weaning period (28 days) tracked successfully." 
        });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Operation failed." });
    }
  };

  const deleteRecord = async (id: number) => {
    if (!confirm("Are you sure you want to delete this weaning record?")) return;

    try {
      const res = await fetch(`/weaning-records/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
      });

      if (res.ok) {
        setItems(items.filter(i => i.id !== id));
        toast({ title: "Deleted", description: "Weaning record removed." });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Delete failed." });
    }
  };

  const startEdit = (record: WeaningRecord) => {
    setEditingId(record.id);
    setSelectedPigId(String(record.pig_id));
    setFarrowingDate(record.farrowing_date);
    setLitterSize(String(record.litter_size || ""));
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/weaning-records/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
        body: JSON.stringify({ status, actual_weaning_date: status === 'Completed' ? new Date().toISOString().split("T")[0] : null }),
      });

      if (res.ok) {
        setItems(items.map(i => i.id === id ? { ...i, status: status as any } : i));
        toast({ title: "Status updated", description: `Record marked as ${status}.` });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Update failed." });
    }
  };

  return (
    <AdminLayout title="Weaning Process">
      <div className="p-6 lg:p-10 space-y-8 animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-rattan mb-2">Post-Farrowing</p>
            <h2 className="font-display text-4xl font-medium text-leaf">Weaning Management</h2>
            <p className="mt-2 text-earth/60">Piglet weaning tracking (28-day cycle) after birth.</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setSelectedPigId("");
              setLitterSize("");
              setShowForm(!showForm);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-leaf px-6 py-3 text-sm font-medium text-sun hover:bg-leaf-deep transition-all shadow-soft self-start"
          >
            <Plus className="size-4" /> {showForm ? "Close Form" : "Manual Weaning Entry"}
          </button>
        </header>

        {showForm && (
          <section className="rounded-3xl bg-white border border-straw shadow-card p-7 animate-fade-in">
            <h3 className="font-display text-2xl text-leaf font-medium mb-6">
              {editingId ? "Edit Weaning Record" : "New Weaning Period"}
            </h3>
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Select Sow (Inahin) *</label>
                <select
                  value={selectedPigId}
                  onChange={(e) => setSelectedPigId(e.target.value)}
                  className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20"
                  required
                >
                  <option value="">-- Choose a sow --</option>
                  {pigs.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name ? `"${p.name}"` : `Sow ID: CS-${String(p.id).padStart(3, '0')}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Farrowing Date (Birth) *</label>
                <input
                  type="date"
                  value={farrowingDate}
                  onChange={(e) => setFarrowingDate(e.target.value)}
                  className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Litter Size</label>
                <input
                  type="number"
                  value={litterSize}
                  onChange={(e) => setLitterSize(e.target.value)}
                  placeholder="No. of piglets"
                  className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 rounded-2xl bg-leaf px-7 py-3 text-sm font-semibold text-sun hover:bg-leaf-deep transition-all">
                  {editingId ? "Update" : "Start Weaning"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="rounded-2xl border border-straw px-5 py-3 text-sm font-medium text-earth/60 hover:bg-sun">
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {isLoading ? (
          <div className="py-20 text-center">
            <Loader2 className="size-10 animate-spin text-leaf/30 mx-auto" />
            <p className="text-earth/50 mt-4">Loading weaning records...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {items.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-straw">
                <p className="text-earth/50">No active weaning records found.</p>
              </div>
            ) : (
              items.map((r) => {
                const start = new Date(r.farrowing_date).getTime();
                const end = new Date(r.expected_weaning_date).getTime();
                const now = new Date().getTime();
                const total = end - start;
                const elapsed = now - start;
                const progress = Math.min(100, Math.max(0, (elapsed / total) * 100));
                const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

                return (
                  <article key={r.id} className="rounded-3xl bg-white border border-straw shadow-card p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-sun flex items-center justify-center text-leaf">
                          <Waves className="size-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-rattan">
                            Weaning · {r.pig?.name ? `"${r.pig.name}"` : `CS-${String(r.pig_id).padStart(3, '0')}`}
                          </p>
                          <h4 className="font-display text-xl font-medium text-leaf">Active Weaning</h4>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => startEdit(r)}
                          className="size-8 rounded-full bg-sun hover:bg-straw flex items-center justify-center text-leaf transition-colors"
                          title="Edit Record"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button 
                          onClick={() => deleteRecord(r.id)}
                          className="size-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-earth/40">Birth Date</p>
                        <p className="text-sm font-medium text-leaf flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-rattan" /> {new Date(r.farrowing_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[10px] uppercase tracking-wider text-earth/40">Expected Weaning</p>
                        <p className="text-sm font-medium text-leaf flex items-center gap-1.5 justify-end">
                          <CheckCircle2 className="size-3.5 text-leaf" /> {new Date(r.expected_weaning_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 flex-1">
                      <div className="flex items-end justify-between">
                        <p className="text-xs text-earth/60">Weaning Progress (28 Days)</p>
                        <p className="text-xs font-bold text-leaf">{progress.toFixed(0)}% · {daysLeft > 0 ? `T-${daysLeft} days` : 'Ready'}</p>
                      </div>
                      <div className="h-2 rounded-full bg-straw overflow-hidden">
                        <div 
                          className="h-full bg-leaf rounded-full transition-all" 
                          style={{ width: `${progress}%` }} 
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-straw pt-4">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="size-4 text-leaf" />
                        <p className="text-sm font-medium text-leaf">Litter Size: <span className="font-bold">{r.litter_size || 0}</span></p>
                      </div>
                      {r.status === 'Active' && (
                        <button 
                          onClick={() => updateStatus(r.id, "Completed")}
                          className="rounded-xl bg-leaf/10 text-leaf px-4 py-2 text-xs font-bold hover:bg-leaf hover:text-sun transition-all"
                        >
                          Mark Completed
                        </button>
                      )}
                      {r.status === 'Completed' && (
                        <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" /> Weaned
                        </span>
                      )}
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

export default Weaning;
