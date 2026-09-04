import { Link, useLocation } from "react-router-dom";
import { Sprout, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  variant?: "public" | "admin";
}

export const Navbar = ({ variant = "public" }: NavbarProps) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const publicLinks = [
    { to: "/", label: "Home" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-straw bg-sun/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="size-10 rounded-full overflow-hidden shadow-soft transition-transform group-hover:rotate-6">
            <img src="/assets/logo.png" className="w-full h-full object-cover" alt="Logo" />
          </div>
          <div className="leading-tight">
            <span className="block font-display text-xl font-semibold text-leaf tracking-tight">
              CasaganPigery
            </span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-rattan font-medium">
              Farm Management
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {publicLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`transition-colors ${
                  active ? "text-leaf" : "text-earth/60 hover:text-leaf"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {variant === "public" && (
            <Link
              to="/login"
              className="hidden sm:inline-flex rounded-full bg-leaf px-5 py-2.5 text-sm font-medium text-sun hover:bg-leaf-deep transition-all shadow-soft hover:shadow-leaf"
            >
              Admin Login
            </Link>
          )}
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden size-10 rounded-full bg-leaf/10 flex items-center justify-center text-leaf transition-colors hover:bg-leaf/20"
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-straw bg-sun/95 backdrop-blur-xl animate-fade-in">
          <div className="px-6 py-8 space-y-6">
            {publicLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`block text-lg font-medium transition-colors ${
                    active ? "text-leaf" : "text-earth/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {variant === "public" && (
              <div className="pt-4 border-t border-straw">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-leaf px-6 py-4 text-base font-semibold text-sun shadow-leaf"
                >
                  Admin Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
