import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Users, Plus, Search, Loader2, MapPin, Phone, ShoppingBag } from "lucide-react";

interface Customer {
  id: number;
  name: string;
  contact?: string;
  address?: string;
  total_purchases: number;
}

const Customers = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/customers");
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

  const filtered = items.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Customer Database">
      <div className="p-6 lg:p-10 space-y-8 animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-rattan mb-2">CRM</p>
            <h2 className="font-display text-4xl font-medium text-leaf">Buyer Database</h2>
            <p className="mt-2 text-earth/60">Manage repeat buyers and contact information.</p>
          </div>
          <div className="relative md:w-80">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-earth/40" />
            <input
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full bg-white border border-straw pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-leaf/20"
            />
          </div>
        </header>

        {isLoading ? (
          <div className="py-20 text-center">
            <Loader2 className="size-10 animate-spin text-leaf/30 mx-auto" />
            <p className="text-earth/50 mt-4">Loading customer records...</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-straw">
                <p className="text-earth/50">No customers found.</p>
              </div>
            ) : (
              filtered.map((i) => (
                <article key={i.id} className="rounded-3xl bg-white border border-straw shadow-card p-6 hover:shadow-leaf transition-shadow group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="size-14 rounded-2xl bg-straw flex items-center justify-center text-leaf group-hover:bg-leaf group-hover:text-sun transition-all shadow-soft">
                      <Users className="size-7" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-earth/40">Total Orders</p>
                      <p className="text-2xl font-display font-bold text-leaf">{i.total_purchases}</p>
                    </div>
                  </div>

                  <h4 className="font-display text-xl font-medium text-leaf mb-3">{i.name}</h4>
                  
                  <div className="space-y-2 text-sm text-earth/60 mb-6">
                    <p className="flex items-center gap-2">
                      <Phone className="size-3.5 text-rattan" /> {i.contact || 'No contact info'}
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin className="size-3.5 text-rattan mt-0.5 shrink-0" /> {i.address || 'No address provided'}
                    </p>
                  </div>

                  <button className="w-full rounded-2xl bg-sun/60 py-3 text-xs font-bold text-leaf hover:bg-leaf hover:text-sun transition-all flex items-center justify-center gap-2">
                    <ShoppingBag className="size-3.5" /> View Order History
                  </button>
                </article>
              ))
            )}
          </section>
        )}
      </div>
    </AdminLayout>
  );
};

export default Customers;
