import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Stethoscope, Plus, Calendar, Loader2, Pill, Syringe, Activity } from "lucide-react";

interface HealthRecord {
  id: number;
  pig_id: number;
  pig: { type: string };
  type: string;
  date: string;
  description: string;
  remarks?: string;
}

const Health = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<HealthRecord[]>([]);
  const [pigs, setPigs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    pig_id: "",
    type: "Vaccination",
    date: new Date().toISOString().split("T")[0],
    description: "",
    remarks: "",
  });

  const fetchData = async () => {
    try {
      const [resH, resP] = await Promise.all([
        fetch("/health-records"),
        fetch("/pigs"),
      ]);
      if (resH.ok) setItems(await resH.json());
      if (resP.ok) setPigs(await resP.json());
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
    try {
      const res = await fetch("/health-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchData();
        setShowForm(false);
        toast({ title: "Record saved", description: "Health log updated successfully." });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save record." });
    }
  };

  return (
    <AdminLayout title="Health & Medical Records">
      <div className="p-6 lg:p-10 space-y-8 animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-rattan mb-2">Biosecurity</p>
            <h2 className="font-display text-4xl font-medium text-leaf">Health & Medical Records</h2>
            <p className="mt-2 text-earth/60">Track vaccinations, treatments, and medical history.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 rounded-full bg-leaf px-6 py-3 text-sm font-medium text-sun hover:bg-leaf-deep transition-all shadow-soft self-start"
          >
            <Plus className="size-4" /> Add Medical Log
          </button>
        </header>

        {showForm && (
          <section className="rounded-3xl bg-white border border-straw shadow-card p-7 animate-fade-in">
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Target Pig *</label>
                <select
                  value={formData.pig_id}
                  onChange={(e) => setFormData({ ...formData, pig_id: e.target.value })}
                  className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20"
                  required
                >
                  <option value="">-- Choose Pig --</option>
                  {pigs.map(p => (
                    <option key={p.id} value={p.id}>CS-{String(p.id).padStart(3, '0')} ({p.type})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Treatment Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20"
                >
                  <option>Vaccination</option>
                  <option>Medication</option>
                  <option>Deworming</option>
                  <option>Checkup</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Treatment / Medicine *</label>
                <input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Hog Cholera Vaccine"
                  className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20"
                  required
                />
              </div>
              <div className="lg:col-span-3 space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Remarks</label>
                <input
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Additional notes..."
                  className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 rounded-2xl bg-leaf px-7 py-3 text-sm font-semibold text-sun hover:bg-leaf-deep transition-all shadow-soft">
                  Save Log
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
            <p className="text-earth/50 mt-4">Loading medical history...</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-straw">
                <p className="text-earth/50">No medical records found.</p>
              </div>
            ) : (
              items.map((r) => (
                <article key={r.id} className="rounded-3xl bg-white border border-straw shadow-card p-6 hover:shadow-leaf transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-xl flex items-center justify-center ${
                        r.type === 'Vaccination' ? 'bg-blue-100 text-blue-600' :
                        r.type === 'Medication' ? 'bg-red-100 text-red-600' :
                        'bg-sun text-leaf'
                      }`}>
                        {r.type === 'Vaccination' ? <Syringe className="size-5" /> : 
                         r.type === 'Medication' ? <Pill className="size-5" /> : 
                         <Activity className="size-5" />}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-rattan">{r.type}</p>
                        <h4 className="font-display text-lg font-medium text-leaf">{r.description}</h4>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="text-earth/70 flex items-center gap-2">
                      <Calendar className="size-3.5 text-earth/40" /> {new Date(r.date).toLocaleDateString()}
                    </p>
                    <p className="text-earth/60">
                      Applied to: <span className="font-semibold text-leaf">CS-{String(r.pig_id).padStart(3, '0')}</span>
                    </p>
                    {r.remarks && (
                      <p className="text-xs italic text-earth/50 bg-sun/40 rounded-xl px-3 py-2 mt-2">
                        "{r.remarks}"
                      </p>
                    )}
                  </div>
                </article>
              ))
            )}
          </section>
        )}
      </div>
    </AdminLayout>
  );
};

export default Health;
