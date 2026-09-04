import { AdminLayout } from "@/components/AdminLayout";
import React, { useState, useEffect } from "react";
import { MessageCircle, MapPin, Hash, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Status = "New" | "Contacted" | "Completed" | "Cancelled";

interface Inquiry {
  id: number;
  fb_id?: string;
  fb_profile_pic?: string;
  customer_name: string;
  pig: { type: string; price: number };
  qty: number;
  address: string;
  message?: string;
  status: Status;
  created_at: string;
}

const STATUS_STYLE: Record<Status, string> = {
  New: "bg-rattan/15 text-rattan",
  Contacted: "bg-leaf/10 text-leaf",
  Completed: "bg-emerald-500/15 text-emerald-700",
  Cancelled: "bg-earth/10 text-earth/60",
};

const Inquiries = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<Status | "all">("all");

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/inquiries");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const setInquiryStatus = async (id: number, status: Status) => {
    try {
      const res = await fetch(`/inquiries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setItems(items.map((i) => (i.id === id ? { ...i, status } : i)));
        toast({ title: "Inquiry updated", description: `Status changed to ${status}.` });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update inquiry." });
    }
  };

  const deleteInquiry = async (id: number) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    
    try {
      const res = await fetch(`/inquiries/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
      });

      if (res.ok) {
        setItems(items.filter((i) => i.id !== id));
        toast({ title: "Inquiry deleted", description: "The inquiry has been removed." });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete inquiry." });
    }
  };

  const filtered = tab === "all" ? items : items.filter((i) => i.status === tab);
  const tabs: (Status | "all")[] = ["all", "New", "Contacted", "Completed", "Cancelled"];

  const TYPE_LABEL: Record<string, string> = {
    inahin: "Inahin (Sow)",
    platining: "Platining (Grower)",
    biik: "Biik (Piglet)",
  };

  return (
    <AdminLayout title="Purchase Inquiries">
      <div className="p-6 lg:p-10 space-y-8 animate-fade-in">
        <header>
          <p className="text-xs font-bold uppercase tracking-widest text-rattan mb-2">Customer Pipeline</p>
          <h2 className="font-display text-4xl font-medium text-leaf">Purchase Inquiries</h2>
          <p className="mt-2 text-earth/60">Public inquiries from the marketplace, with verified Facebook identities.</p>
        </header>

        {isLoading ? (
          <div className="py-20 text-center">
            <Loader2 className="size-10 animate-spin text-leaf/30 mx-auto" />
            <p className="text-earth/50 mt-4">Loading inquiries...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {tabs.map((t) => {
                const count = t === "all" ? items.length : items.filter((i) => i.status === t).length;
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-all flex items-center gap-2 ${
                      tab === t
                        ? "bg-leaf text-sun shadow-soft"
                        : "bg-white border border-straw text-earth/70 hover:border-leaf/30"
                    }`}
                  >
                    {t}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        tab === t ? "bg-sun/20" : "bg-straw text-rattan"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filtered.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-straw">
                  <p className="text-earth/50">No inquiries found in this category.</p>
                </div>
              ) : (
                filtered.map((i) => (
                  <article
                    key={i.id}
                    className="rounded-3xl bg-white border border-straw shadow-card p-6 hover:shadow-leaf transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        {i.fb_profile_pic ? (
                          <div className="relative">
                            <img src={i.fb_profile_pic} className="size-14 rounded-2xl border border-straw shadow-sm object-cover" alt={i.customer_name} />
                            <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white">
                              <svg className="size-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> 
                            </div>
                          </div>
                        ) : (
                          <div className="size-14 rounded-2xl bg-straw flex items-center justify-center text-leaf">
                            <Hash className="size-6 opacity-20" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[i.status]}`}>
                              {i.status}
                            </span>
                            <span className="text-[11px] text-earth/40 inline-flex items-center gap-1">
                              INQ-{String(i.id).padStart(4, "0")}
                            </span>
                          </div>
                          <h3 className="font-display text-xl font-medium text-leaf leading-tight">{i.customer_name}</h3>
                          <p className="text-xs text-earth/40 mt-1">
                            {new Date(i.created_at).toLocaleDateString()} · {i.fb_id ? "Verified FB" : "Unverified"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-earth/40">Est. Total</p>
                        <p className="font-display text-xl font-semibold text-leaf tabular-nums">
                          ₱{(i.qty * (i.pig?.price || 0)).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-5 text-sm pl-0 lg:pl-[72px]">
                      <p className="text-earth/70">
                        <span className="font-medium text-leaf">
                          {i.qty}× {TYPE_LABEL[i.pig?.type] || i.pig?.type || "Unknown Pig"}
                        </span>
                      </p>
                      <p className="text-earth/60 inline-flex items-start gap-2">
                        <MapPin className="size-3.5 mt-0.5 shrink-0 text-rattan" />
                        {i.address}
                      </p>
                      {i.message && (
                        <p className="text-xs italic text-earth/50 bg-sun/60 rounded-xl px-3 py-2 border border-straw/50">
                          "{i.message}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap pl-0 lg:pl-[72px]">
                      {i.fb_id ? (
                        <a 
                          href="https://www.facebook.com/messages/t/"
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-leaf px-5 py-2.5 text-xs font-semibold text-sun hover:bg-leaf-deep transition-all inline-flex items-center gap-1.5 shadow-soft"
                        >
                          <MessageCircle className="size-3.5" /> Check Messages in Inbox
                        </a>
                      ) : (
                        <div className="rounded-full bg-straw/50 px-5 py-2.5 text-xs font-semibold text-earth/40 inline-flex items-center gap-1.5 cursor-not-allowed">
                          <MessageCircle className="size-3.5 opacity-30" /> No FB Linked
                        </div>
                      )}
                      
                      {i.status === "New" && (
                        <button
                          onClick={() => setInquiryStatus(i.id, "Contacted")}
                          className="rounded-full border border-straw px-4 py-2.5 text-xs font-medium text-earth/70 hover:bg-sun transition-all"
                        >
                          Mark Contacted
                        </button>
                      )}

                      <button
                        onClick={() => deleteInquiry(i.id)}
                        className="rounded-full border border-red-100 px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-all flex items-center gap-1.5 ml-auto"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Inquiries;
