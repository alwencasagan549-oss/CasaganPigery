import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Sprout, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-warm px-6">
      <div className="text-center max-w-md">
        <div className="size-16 mx-auto rounded-full overflow-hidden shadow-leaf mb-6">
          <img src="/assets/logo.png" className="w-full h-full object-cover" alt="Logo" />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-rattan mb-3">404</p>
        <h1 className="font-display text-5xl font-medium text-leaf mb-3">Lost in the pasture.</h1>
        <p className="text-earth/60 mb-8">
          The page you're looking for has wandered off. Let's get you back to the farm.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-leaf px-6 py-3 text-sm font-semibold text-sun hover:bg-leaf-deep transition-all shadow-soft"
        >
          <ArrowLeft className="size-4" /> Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
