import { AdminLayout } from "@/components/AdminLayout";
import { Link } from "react-router-dom";
import { PiggyBank, Tag, Inbox, Baby, AlertTriangle, ArrowUpRight, TrendingUp, DollarSign, Bell } from "lucide-react";
import React, { useState, useEffect } from "react";

const StatCard = ({
  label,
  value,
  hint,
  hintTone = "neutral",
  icon: Icon,
  variant = "white",
}: {
  label: string;
  value: string;
  hint?: string;
  hintTone?: "neutral" | "warn" | "good";
  icon: React.ElementType;
  variant?: "white" | "leaf";
}) => {
  const isLeaf = variant === "leaf";
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-7 border transition-all hover:-translate-y-0.5 ${
        isLeaf
          ? "bg-leaf border-leaf shadow-leaf text-sun"
          : "bg-white border-straw shadow-card hover:shadow-leaf"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`size-11 rounded-2xl flex items-center justify-center ${
            isLeaf ? "bg-sun/15" : "bg-straw"
          }`}
        >
          <Icon className={`size-5 ${isLeaf ? "text-sun" : "text-leaf"}`} />
        </div>
      </div>
      <p
        className={`mt-5 text-xs uppercase tracking-widest font-medium ${
          isLeaf ? "text-sun/70" : "text-rattan"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-1 font-display text-4xl font-semibold tabular-nums ${
          isLeaf ? "text-sun" : "text-leaf"
        }`}
      >
        {value}
      </p>
      {hint && (
        <p
          className={`mt-3 text-xs font-medium ${
            isLeaf
              ? "text-sun/80"
              : hintTone === "warn"
              ? "text-amber-700"
              : hintTone === "good"
              ? "text-leaf/70"
              : "text-earth/50"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_pigs: 0,
    for_sale: 0,
    pending_inquiries: 0,
    active_gestations: 0,
    due_soon_count: 0,
    total_revenue: 0,
    low_stock_feeds: 0
  });

  const [gestations, setGestations] = useState<any[]>([]);

  useEffect(() => {
    fetch("/dashboard-stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Stats fetch error:", err));

    fetch("/breeding-records")
      .then(res => res.json())
      .then(data => setGestations(data.filter((r: any) => r.status === 'Active').slice(0, 4)))
      .catch(err => console.error(err));
  }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <AdminLayout title="Dashboard">
      <div className="p-6 lg:p-10 space-y-10 animate-fade-in">
        {/* Welcome */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-rattan mb-2">
              {today}
            </p>
            <h2 className="font-display text-4xl font-medium text-leaf">
              Good morning, Farm Manager.
            </h2>
            <p className="mt-2 text-earth/60">
              The herd is healthy and your farm is synchronized with the live database.
            </p>
          </div>
          
          {stats.due_soon_count > 0 && (
            <Link 
              to="/admin/breeding"
              className="flex items-center gap-4 bg-red-50 border border-red-100 rounded-3xl p-4 pr-6 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="size-12 rounded-2xl bg-red-600 flex items-center justify-center text-white animate-pulse">
                <Bell className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-600">Urgent Alert</p>
                <p className="text-sm font-semibold text-leaf">
                  {stats.due_soon_count} Sows are due for farrowing!
                </p>
                <p className="text-xs text-earth/50">Check breeding logs immediately.</p>
              </div>
              <ArrowUpRight className="size-4 text-earth/30 group-hover:text-red-600 transition-colors" />
            </Link>
          )}
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard label="Total Pigs" value={String(stats.total_pigs)} hint="Total headcount" hintTone="good" icon={PiggyBank} />
          <StatCard label="Total Revenue" value={`₱${Number(stats.total_revenue).toLocaleString()}`} hint="Sales to date" icon={DollarSign} />
          <StatCard
            label="Pending Inquiries"
            value={String(stats.pending_inquiries).padStart(2, '0')}
            hint={stats.pending_inquiries > 0 ? "New requests found" : "All caught up"}
            hintTone={stats.pending_inquiries > 0 ? "warn" : "good"}
            icon={Inbox}
          />
          <StatCard
            label="Active Gestations"
            value={String(stats.active_gestations)}
            hint={stats.due_soon_count > 0 ? `${stats.due_soon_count} sows are due soon` : "Sows in pregnancy"}
            hintTone={stats.due_soon_count > 0 ? "warn" : "neutral"}
            icon={Baby}
            variant={stats.due_soon_count > 0 ? "white" : "leaf"}
          />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Gestation Countdown */}
          <section className="xl:col-span-2 rounded-3xl bg-white border border-straw shadow-card p-7">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h3 className="font-display text-2xl font-medium text-leaf">Gestation Countdown</h3>
                <p className="text-sm text-earth/60">Real-time tracking (114-day cycle).</p>
              </div>
              <Link
                to="/admin/breeding"
                className="text-xs font-semibold text-leaf inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                Full breeding log <ArrowUpRight className="size-3.5" />
              </Link>
            </div>

            <div className="space-y-5">
              {gestations.length === 0 ? (
                <div className="py-10 text-center border border-dashed border-straw rounded-2xl">
                  <p className="text-earth/40 text-sm">No active gestations found.</p>
                </div>
              ) : (
                gestations.map((r) => {
                  const start = new Date(r.service_date).getTime();
                  const end = new Date(r.expected_farrowing_date).getTime();
                  const now = new Date().getTime();
                  const progress = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
                  const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
                  const urgent = daysLeft <= 10;

                  return (
                    <div key={r.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`size-8 rounded-xl flex items-center justify-center ${urgent ? "bg-red-50 text-red-600" : "bg-straw text-rattan"}`}>
                            <Baby className="size-4" />
                          </div>
                          <div className="leading-tight">
                            <p className="text-sm font-medium text-leaf">
                              {r.pig?.name ? `"${r.pig.name}"` : `Sow CS-${String(r.pig_id).padStart(3, '0')}`}
                            </p>
                            <p className="text-[11px] text-earth/50">Progress: {progress.toFixed(0)}%</p>
                          </div>
                        </div>
                        <span
                          className={`text-xs font-bold tabular-nums px-3 py-1 rounded-full ${
                            urgent ? "bg-red-600 text-white shadow-sm" : "bg-straw text-leaf"
                          }`}
                        >
                          {daysLeft <= 0 ? "DUE NOW" : `T-${daysLeft} days`}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-straw overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${urgent ? "bg-red-600" : "bg-leaf"}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Low Feed Alert + Recent */}
          <section className="space-y-6">
            <div className={`rounded-3xl border p-6 ${stats.low_stock_feeds > 0 ? 'bg-gradient-warm border-straw' : 'bg-white border-straw'}`}>
              <div className="flex items-center gap-2 text-rattan mb-3">
                <AlertTriangle className="size-4" />
                <p className="text-xs font-bold uppercase tracking-widest">Feed Inventory</p>
              </div>
              <p className="font-display text-xl text-leaf font-medium leading-snug">
                {stats.low_stock_feeds > 0 
                  ? `${stats.low_stock_feeds} items are below reorder threshold.` 
                  : "All feed stocks are within safe levels."}
              </p>
              <Link
                to="/admin/feed"
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-leaf hover:gap-2 transition-all"
              >
                Inventory details <ArrowUpRight className="size-3.5" />
              </Link>
            </div>

            <div className="rounded-3xl bg-white border border-straw shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-medium text-leaf">System Status</h3>
                <TrendingUp className="size-4 text-rattan" />
              </div>
              <ul className="space-y-3.5 text-sm text-earth/60">
                <li className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-leaf" />
                  Database: Connected
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-leaf" />
                  API Sync: Active
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-rattan" />
                  Gestation: 114 Days
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Quick Actions */}
        <section className="rounded-3xl bg-leaf p-8 md:p-10 shadow-leaf overflow-hidden relative">
          <div className="absolute inset-0 rattan-dots opacity-40" />
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <p className="text-[11px] font-bold uppercase tracking-widest text-sun/70">Quick Action</p>
              <h3 className="font-display text-3xl font-medium text-sun mt-2">
                Register a new pig in seconds.
              </h3>
              <p className="text-sun/80 mt-2 max-w-md">
                Keep your inventory up to date by recording new births or arrivals immediately.
              </p>
            </div>
            <div className="md:text-right">
              <Link
                to="/admin/pigs"
                className="inline-flex items-center gap-2 rounded-full bg-sun px-7 py-3.5 text-sm font-semibold text-leaf hover:bg-white transition-all shadow-soft"
              >
                Go to Inventory <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
