import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, ShieldCheck, Sprout, HeartHandshake, Loader2 } from "lucide-react";
import { InquiryDialog } from "@/components/InquiryDialog";
import heroImg from "@/assets/farm-hero.jpg";
import biikImg from "@/assets/pig-biik.jpg";
import inahinImg from "@/assets/pig-inahin.jpg";
import platiningImg from "@/assets/pig-platining.jpg";

interface Pig {
  id: number;
  type: string;
  name?: string;
  gender: "Male" | "Female";
  price: number;
  qty: number;
  img: string;
}

const TYPE_MAP: Record<string, string> = {
  inahin: "Inahin (Sow)",
  platining: "Platining (Grower)",
  biik: "Biik (Piglet)",
};

const IMG_MAP: Record<string, string> = {
  inahin: inahinImg,
  platining: platiningImg,
  biik: biikImg,
};

const Index = () => {
  const [pigs, setPigs] = useState<Pig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPig, setSelectedPig] = useState<Pig | null>(null);

  useEffect(() => {
    const fetchPigs = async () => {
      try {
        const res = await fetch("https://casaganpigery.ct.ws/pigs");
        if (res.ok) {
          const data = await res.json();
          const mapped = data
            .filter((p: any) => p.status === "For Sale" && p.qty > 0)
            .map((p: any) => ({
              id: p.id,
              type: TYPE_MAP[p.type] || p.type,
              name: p.name,
              gender: p.gender,
              price: Number(p.price),
              qty: p.qty,
              img: IMG_MAP[p.type] || biikImg,
            }));
          setPigs(mapped.slice(0, 6)); // Show first 6 featured
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPigs();
  }, []);

  return (
    <div className="min-h-dvh bg-sun text-earth flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Casagan piggery farm at golden hour with banana leaves"
            className="w-full h-full object-cover"
            width={1600}
            height={900}
          />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-28 md:py-40">
          <div className="max-w-2xl space-y-6 animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full bg-sun/20 backdrop-blur-md border border-sun/30 px-4 py-1.5 text-xs font-medium text-sun uppercase tracking-widest">
              <Sprout className="size-3.5" /> Family-run since 2010
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-medium text-sun leading-[1.05] tracking-tight">
              Healthy livestock, raised the honest way.
            </h1>
            <p className="text-lg text-sun/85 max-w-xl leading-relaxed">
              CasaganPigery offers <em>inahin</em>, <em>platining</em>, and <em>biik</em> from a small Bulacan
              farm where every pig is fed well, cared for, and tracked with precision.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#marketplace"
                className="group inline-flex items-center gap-2 rounded-full bg-sun px-7 py-3.5 text-sm font-semibold text-leaf hover:bg-white transition-all shadow-leaf"
              >
                Browse Available Pigs
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
              <Link
                to="/about"
                className="inline-flex items-center rounded-full border border-sun/40 bg-sun/10 backdrop-blur-md px-7 py-3.5 text-sm font-semibold text-sun hover:bg-sun/20 transition-all"
              >
                Why Casagan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="values" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: HeartHandshake, title: "Raised with Care", text: "Spacious pens, clean water, and balanced feeding schedules every day." },
            { icon: ShieldCheck, title: "Health-Tracked", text: "Every animal has a complete vaccination and weight history on file." },
            { icon: Sprout, title: "Honest Pricing", text: "What you see is what you pay — no surprise fees or middleman markups." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl bg-white p-8 border border-straw shadow-card hover:shadow-leaf transition-shadow">
              <div className="size-12 rounded-2xl bg-straw flex items-center justify-center mb-5">
                <Icon className="size-5 text-leaf" />
              </div>
              <h3 className="font-display text-2xl font-medium text-leaf mb-2">{title}</h3>
              <p className="text-sm text-earth/70 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Marketplace — all available pigs */}
      <section id="marketplace" className="mx-auto max-w-7xl px-6 pb-20 scroll-mt-20 flex-1">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-rattan mb-2">Marketplace</p>
          <h2 className="font-display text-4xl font-medium text-leaf">Available Pigs</h2>
          <p className="mt-2 text-earth/60">All livestock currently for sale at Casagan Farm.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="size-8 animate-spin text-leaf/20" />
          </div>
        ) : pigs.length === 0 ? (
          <div className="rounded-3xl bg-white border border-straw p-16 text-center">
            <p className="font-display text-2xl text-leaf">No pigs currently for sale.</p>
            <p className="text-earth/60 mt-2">Check back soon for new arrivals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pigs.map((p) => (
              <article
                key={p.id}
                className="group bg-white rounded-3xl border border-straw overflow-hidden shadow-card hover:shadow-leaf transition-all hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden bg-straw/40 relative">
                  <img
                    src={p.img}
                    alt={p.name || p.type}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-leaf/90 backdrop-blur px-3 py-1 text-[11px] font-semibold text-sun uppercase tracking-wider">
                    For Sale
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-straw px-3 py-1 text-xs font-semibold text-rattan">
                      {p.type}
                    </span>
                    <span className="text-xs text-earth/50">
                      {p.name ? (
                        <span className="font-bold text-leaf italic">"{p.name}"</span>
                      ) : (
                        p.gender
                      )}
                      {" · "}#CS-{String(p.id).padStart(3, "0")}
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-earth/40">Price</p>
                      <p className="font-display text-2xl font-semibold text-leaf">
                        {p.price > 0 ? `₱${p.price.toLocaleString()}` : "Inquire"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-wider text-earth/40">Available</p>
                      <p className="font-medium tabular-nums text-leaf">{p.qty} head</p>
                    </div>
                  </div>
                   <button
                    onClick={() => setSelectedPig(p)}
                    className="w-full rounded-2xl bg-leaf py-3 text-sm font-semibold text-sun hover:bg-leaf-deep transition-all shadow-soft"
                  >
                    Inquire Now
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <Footer />
      
      {selectedPig && (
        <InquiryDialog 
          pig={selectedPig} 
          onClose={() => setSelectedPig(null)} 
        />
      )}
    </div>
  );
};

export default Index;
