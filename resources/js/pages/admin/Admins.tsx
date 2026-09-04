import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Users, Plus, Trash2, Mail, ShieldCheck, Loader2 } from "lucide-react";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

const Admins = () => {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/users");
      if (res.ok) setAdmins(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
        credentials: "same-origin",
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        fetchAdmins();
        setShowForm(false);
        setName("");
        setEmail("");
        setPassword("");
        toast({ title: "Admin Added", description: "New administrator created successfully." });
      } else {
        const data = await res.json();
        toast({ variant: "destructive", title: "Error", description: data.message || "Failed to add admin." });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "An error occurred." });
    }
  };

  const deleteAdmin = async (id: number) => {
    if (!confirm("Are you sure you want to remove this administrator?")) return;

    try {
      const res = await fetch(`/users/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
        credentials: "same-origin",
      });

      if (res.ok) {
        setAdmins(admins.filter(a => a.id !== id));
        toast({ title: "Admin Removed", description: "Administrator account deleted." });
      } else {
        const data = await res.json();
        toast({ variant: "destructive", title: "Error", description: data.message || "Cannot remove this admin." });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Delete failed." });
    }
  };

  return (
    <AdminLayout title="Admin Management">
      <div className="p-6 lg:p-10 space-y-8 animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-rattan mb-2">Security</p>
            <h2 className="font-display text-4xl font-medium text-leaf">Admin Management</h2>
            <p className="mt-2 text-earth/60">Manage staff access and administrator accounts.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 rounded-full bg-leaf px-6 py-3 text-sm font-medium text-sun hover:bg-leaf-deep transition-all shadow-soft self-start"
          >
            <Plus className="size-4" /> {showForm ? "Close Form" : "Add New Admin"}
          </button>
        </header>

        {showForm && (
          <section className="rounded-3xl bg-white border border-straw shadow-card p-7 animate-fade-in">
            <h3 className="font-display text-2xl text-leaf font-medium mb-6 text-center">New Administrator</h3>
            <form onSubmit={handleAddAdmin} className="max-w-2xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-straw bg-sun/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20"
                  required
                  placeholder="Minimum 8 characters"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 rounded-2xl bg-leaf px-7 py-3 text-sm font-semibold text-sun hover:bg-leaf-deep transition-all">
                  Create Admin Account
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="rounded-2xl border border-straw px-5 py-3 text-sm font-medium text-earth/60 hover:bg-sun">
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full py-20 text-center">
              <Loader2 className="size-10 animate-spin text-leaf/30 mx-auto" />
            </div>
          ) : (
            admins.map((admin) => (
              <article key={admin.id} className="rounded-3xl bg-white border border-straw shadow-card p-6 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={() => deleteAdmin(admin.id)}
                    className="size-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    title="Remove Admin"
                   >
                    <Trash2 className="size-4" />
                   </button>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="size-14 rounded-2xl bg-sun flex items-center justify-center text-leaf border border-straw">
                    <ShieldCheck className="size-7" />
                  </div>
                  <div>
                    <h4 className="font-display text-xl font-medium text-leaf">{admin.name}</h4>
                    <p className="text-xs text-earth/40 uppercase tracking-widest font-bold">System Admin</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-earth/60">
                    <Mail className="size-4 text-rattan" />
                    {admin.email}
                  </div>
                  <div className="pt-4 border-t border-straw/50 text-[10px] text-earth/30 uppercase tracking-tighter">
                    Added on {new Date(admin.created_at).toLocaleDateString()}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admins;
