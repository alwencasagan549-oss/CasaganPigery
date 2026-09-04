import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PiggyBank,
  Heart,
  Baby,
  Stethoscope,
  Wheat,
  ShoppingCart,
  Users,
  Inbox,
  BarChart3,
  Sprout,
  LogOut,
  ShieldCheck,
} from "lucide-react";

interface Stats {
  pending_inquiries: number;
}

export const AdminSidebar = ({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) => {
  const isMobile = variant === "mobile";
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/dashboard-stats", {
          headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest"
          }
        });
        if (res.ok) setStats(await res.json());
      } catch (err) {
        console.error("Sidebar stats fetch failed", err);
      }
    };
    fetchStats();
    // Poll every 30 seconds for new inquiries
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/logout", { 
        method: "POST", 
        headers: { 
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "" 
        },
        credentials: "same-origin",
      });
    } catch (err) {
      console.error("Logout request failed", err);
    }
    // Always redirect to login to clear the UI state
    window.location.href = "/login";
  };

  const menuItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/pigs", label: "Pig Inventory", icon: PiggyBank },
    { to: "/admin/breeding", label: "Breeding", icon: Heart },
    { to: "/admin/weaning", label: "Weaning", icon: Baby },
    { to: "/admin/health", label: "Health", icon: Stethoscope },
    { to: "/admin/feed", label: "Feed & Nutrition", icon: Wheat },
    { to: "/admin/sales", label: "Sales", icon: ShoppingCart },
    { to: "/admin/customers", label: "Customers", icon: Users },
    { to: "/admin/inquiries", label: "Inquiries", icon: Inbox, badge: stats?.pending_inquiries },
    { to: "/admin/reports", label: "Reports", icon: BarChart3 },
    { to: "/admin/admins", label: "Admins", icon: ShieldCheck },
  ];

  return (
    <aside
      className={
        isMobile
          ? "flex flex-col w-full bg-white"
          : "hidden lg:flex flex-col w-64 shrink-0 border-r border-straw bg-white"
      }
    >
      <div className="px-6 py-6 border-b border-straw">
        <Link to="/admin" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="size-10 rounded-full overflow-hidden shadow-soft">
            <img src="/assets/logo.png" className="w-full h-full object-cover" alt="Logo" />
          </div>
          <div className="leading-tight">
            <span className="block font-display text-lg font-semibold text-leaf">CasaganPigery</span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-rattan font-medium">
              Admin Console
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {menuItems.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-leaf text-sun shadow-soft"
                  : "text-earth/70 hover:bg-straw hover:text-leaf"
              }`
            }
          >
            <span className="flex items-center gap-3">
              <Icon className="size-4" />
              {label}
            </span>
            {badge && badge > 0 && (
              <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-straw space-y-2">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="size-9 rounded-full bg-rattan flex items-center justify-center text-sun font-semibold">
            FM
          </div>
          <div className="flex-1 leading-tight">
            <p className="text-sm font-medium text-leaf">Farm Manager</p>
            <p className="text-[11px] text-earth/50">admin@casagan.ph</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all border border-red-100"
        >
          <LogOut className="size-4" />
          Logout Account
        </button>
      </div>
    </aside>
  );
};
