import { ReactNode, useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Bell, Search, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-sun text-earth flex w-full">
      {/* Desktop sidebar */}
      <AdminSidebar />

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-fade-in">
          <div
            className="absolute inset-0 bg-leaf-deep/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-leaf flex flex-col">
            <div className="flex items-center justify-end p-3 border-b border-straw">
              <button
                onClick={() => setMobileOpen(false)}
                className="size-9 rounded-full hover:bg-straw flex items-center justify-center text-earth/60"
                aria-label="Close menu"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto" onClick={() => setMobileOpen(false)}>
              <AdminSidebar variant="mobile" />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-straw bg-white/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden size-10 rounded-full bg-sun border border-straw flex items-center justify-center hover:bg-straw transition-colors"
              aria-label="Open menu"
            >
              <Menu className="size-4 text-leaf" />
            </button>
            {title && <h1 className="font-display text-xl font-medium text-leaf">{title}</h1>}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-earth/40" />
              <input
                placeholder="Search records..."
                className="rounded-full bg-sun border border-straw pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-leaf/20"
              />
            </div>
            <button className="relative size-10 rounded-full bg-sun border border-straw flex items-center justify-center hover:bg-straw transition-colors">
              <Bell className="size-4 text-leaf" />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-rattan" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
