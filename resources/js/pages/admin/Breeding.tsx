import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Heart, Plus, Calendar, Baby, Loader2, TrendingUp, CheckCircle2, Trash2, Pencil } from "lucide-react";

interface Pig {
  id: number;
  type: string;
  name?: string;
  gender: string;
}

interface BreedingRecord {
  id: number;
  pig_id: number;
  pig: Pig;
  service_date: string;
  expected_farrowing_date: string;
  actual_farrowing_date?: string;
  status: "Active" | "Farrowed" | "Failed" | "Weaned";
  litter_size?: number;
}

const Breeding = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<BreedingRecord[]>([]);
  const [pigs, setPigs] = useState<Pig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [selectedPigId, setSelectedPigId] = useState("");
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchData = async () => {
    try {
      const [resB, resP] = await Promise.all([
        fetch("/breeding-records"),
        fetch("/pigs"),
      ]);
      if (resB.ok) setItems(await resB.json());
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
      ? `/breeding-records/${editingId}`
      : "/breeding-records";
    
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
        body: JSON.stringify({ pig_id: selectedPigId, service_date: serviceDate }),
      });

      if (res.ok) {
        fetchData();
        setShowForm(false);
        setEditingId(null);
        setSelectedPigId("");
        toast({ 
          title: editingId ? "Record updated" : "Breeding started", 
          description: "Gestation dates managed successfully." 
        });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Operation failed." });
    }
  };

  const deleteRecord = async (id: number) => {
    if (!confirm("Are you sure you want to delete this breeding record?")) return;

    try {
      const res = await fetch(`/breeding-records/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
      });

      if (res.ok) {
        setItems(items.filter(i => i.id !== id));
        toast({ title: "Deleted", description: "Breeding record removed." });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Delete failed." });
    }
  };

  const startEdit = (record: BreedingRecord) => {
    setEditingId(record.id);
    setSelectedPigId(String(record.pig_id));
    setServiceDate(record.service_date);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateStatus = async (id: number, status: string, litter?: number) => {
    try {
      const res = await fetch(`/breeding-records/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
        body: JSON.stringify({ status, ...(litter !== undefined && { litter_size: litter }) }),
      });

      if (res.ok) {
        setItems(items.map(i => i.id === id ? { ...i, status: status as any, litter_size: litter } : i));
        toast({ title: "Status updated", description: `Record updated to ${status}.` });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Update failed." });
    }
  };

  return (
    <AdminLayout title="Breeding & Reproduction">
      <div className="p-6 lg:p-10 space-y-8 animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-rattan mb-2">Life Cycle</p>
            <h2 className="font-display text-4xl font-medium text-leaf">Breeding & Reproduction</h2>
            <p className="mt-2 text-earth/60">Gestation tracking (114-day cycle) and farrowing schedules.</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setSelectedPigId("");
              setShowForm(!showForm);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-leaf px-6 py-3 text-sm font-medium text-sun hover:bg-leaf-deep transition-all shadow-soft self-start"
          >
            <Plus className="size-4" /> {showForm ? "Close Form" : "New Breeding Entry"}
          </button>
        </header>

        {showForm && (
          <section className="rounded-3xl bg-white border border-straw shadow-card p-7 animate-fade-in">
            <h3 className="font-display text-2xl text-leaf font-medium mb-6">
              {editingId ? "Edit Gestation Record" : "Start New Gestation"}
            </h3>
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
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
                <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Service Date *</label>
                <input
                  type="date"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 rounded-2xl bg-leaf px-7 py-3 text-sm font-semibold text-sun hover:bg-leaf-deep transition-all">
                  {editingId ? "Update Record" : "Confirm Breeding"}
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
            <p className="text-earth/50 mt-4">Loading breeding records...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {items.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-straw">
                <p className="text-earth/50">No active breeding records found.</p>
              </div>
            ) : (
              items.map((r) => {
                const start = new Date(r.service_date).getTime();
                const end = new Date(r.expected_farrowing_date).getTime();
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
                          <Baby className="size-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-rattan">
                            Gestation · {r.pig?.name ? `"${r.pig.name}"` : `CS-${String(r.pig_id).padStart(3, '0')}`}
                          </p>
                          <h4 className="font-display text-xl font-medium text-leaf">Active Pregnancy</h4>
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
                        <p className="text-[10px] uppercase tracking-wider text-earth/40">Service Date</p>
                        <p className="text-sm font-medium text-leaf flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-rattan" /> {new Date(r.service_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[10px] uppercase tracking-wider text-earth/40">Expected Farrowing</p>
                        <p className="text-sm font-medium text-leaf flex items-center gap-1.5 justify-end">
                          <CheckCircle2 className="size-3.5 text-leaf" /> {new Date(r.expected_farrowing_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 flex-1">
                      <div className="flex items-end justify-between">
                        <p className="text-xs text-earth/60">Gestation Progress</p>
                        <p className="text-xs font-bold text-leaf">{progress.toFixed(0)}% · T-{daysLeft} days</p>
                      </div>
                      <div className="h-2 rounded-full bg-straw overflow-hidden">
                        <div 
                          className="h-full bg-leaf rounded-full transition-all" 
                          style={{ width: `${progress}%` }} 
                        />
                      </div>
                    </div>

                    {r.status === 'Active' && progress > 90 && (
                      <div className="mt-6 flex gap-2">
                        <button 
                          onClick={() => {
                            const size = prompt("Enter litter size:");
                            if (size) updateStatus(r.id, "Farrowed", parseInt(size));
                          }}
                          className="flex-1 rounded-xl bg-leaf/10 text-leaf py-2.5 text-xs font-bold hover:bg-leaf hover:text-sun transition-all"
                        >
                          Confirm Farrowed
                        </button>
                        <button 
                          onClick={() => updateStatus(r.id, "Failed")}
                          className="rounded-xl border border-straw px-4 text-xs font-medium text-earth/40"
                        >
                          Failed
                        </button>
                      </div>
                    )}

                    {r.status === 'Farrowed' && (
                      <div className="mt-6 bg-sun/60 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="size-4 text-leaf" />
                          <p className="text-sm font-medium text-leaf">Litter Size: <span className="font-bold">{r.litter_size}</span></p>
                        </div>
                        <button 
                          onClick={() => updateStatus(r.id, "Weaned")}
                          className="text-xs font-bold text-rattan hover:underline"
                        >
                          Mark as Weaned
                        </button>
                      </div>
                    )}
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

export default Breeding;
