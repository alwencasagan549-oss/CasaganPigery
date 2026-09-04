import { Sprout } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-straw bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full overflow-hidden">
              <img src="/assets/logo.png" className="w-full h-full object-cover" alt="Logo" />
            </div>
            <span className="font-display text-xl font-semibold text-leaf">CasaganPigery</span>
          </div>
          <p className="text-sm text-earth/60 max-w-[36ch]">
            A family-run piggery cultivating healthy livestock and honest trade since 2010.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-rattan">Visit Us</p>
          <p className="text-sm text-earth/70 leading-relaxed">
            P-7 Bagumbayan, Dinagat<br />
            Dinagat Island
          </p>
        </div>

        <div className="space-y-3 md:text-right">
          <p className="text-xs font-bold uppercase tracking-widest text-rattan">Get in Touch</p>
          <p className="text-sm text-earth/70">Facebook: @CasaganPigery or @Ging Tiwanag</p>
          <p className="text-sm text-earth/70">Email: casaganpigery@gmail.com</p>
          <p className="text-sm text-earth/70">Hotline: 09214542689</p>
        </div>
      </div>
      <div className="border-t border-straw">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col md:flex-row justify-between items-center text-xs text-earth/50 gap-4">
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-leaf transition-colors underline">Privacy Policy</a>
            <a href="/privacy" className="hover:text-leaf transition-colors underline">User Data Deletion</a>
          </div>
          <div>
            © {new Date().getFullYear()} CasaganPigery — <span id="developer-credits">Designed and Developed by Alwen T. Casagan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
