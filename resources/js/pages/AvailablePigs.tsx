import React, { useMemo, useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Search } from "lucide-react";
import { InquiryDialog } from "@/components/InquiryDialog";
import biikImg from "@/assets/pig-biik.jpg";
import inahinImg from "@/assets/pig-inahin.jpg";
import platiningImg from "@/assets/pig-platining.jpg";

interface Pig {
  id: number;
  type: "Biik (Piglet)" | "Platining (Grower)" | "Inahin (Sow)";
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

const AvailablePigs = () => {
  const [pigs, setPigs] = useState<Pig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
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
              gender: p.gender,
              price: Number(p.price),
              qty: p.qty,
              img: IMG_MAP[p.type] || biikImg,
            }));
          setPigs(mapped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPigs();
  }, []);

  const filtered = useMemo(() => {
    return pigs.filter((p) => (filter === "All" ? true : p.type === filter)).filter((p) =>
      p.type.toLowerCase().includes(search.toLowerCase())
    );
  }, [pigs, filter, search]);

  const filters = ["All", "Biik (Piglet)", "Platining (Grower)", "Inahin (Sow)"];

  const handleInquiry = (p: Pig) => {
    setSelectedPig(p);
  };

  return (
    <div className="min-h-dvh bg-sun text-earth flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="border-b border-straw bg-gradient-warm">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-xs font-bold uppercase tracking-widest text-rattan mb-3">Marketplace</p>
          <h1 className="font-display text-5xl md:text-6xl font-medium text-leaf leading-tight max-w-3xl">
            Available pigs, ready for rehoming.
          </h1>
          <p className="mt-4 text-lg text-earth/70 max-w-2xl">
            Browse what's currently for sale at Casagan Farm. Tap any animal to open a direct Messenger chat.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-7xl px-6 py-8 w-full">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  filter === f
                    ? "bg-leaf text-sun shadow-soft"
                    : "bg-white border border-straw text-earth/70 hover:border-leaf/30"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative md:w-72">
            <Search className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-earth/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search by type..."
              className="w-full rounded-full bg-white border border-straw pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-leaf/20"
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-20 w-full flex-1">
        {filtered.length === 0 ? (
          <div className="rounded-3xl bg-white border border-straw p-16 text-center">
            <p className="font-display text-2xl text-leaf">No pigs match your filters.</p>
            <p className="text-earth/60 mt-2">Try a different category or clear your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <article
                key={p.id}
                className="group bg-white rounded-3xl border border-straw overflow-hidden shadow-card hover:shadow-leaf transition-all hover:-translate-y-1"
              >
                <div className="aspect-square overflow-hidden bg-straw/40 relative">
                  <img
                    src={p.img}
                    alt={p.type}
                    loading="lazy"
                    width={600}
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
                    <span className="text-xs text-earth/50">{p.gender} · #CS-{String(p.id).padStart(3, "0")}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-earth/40">Price</p>
                      <p className="font-display text-2xl font-semibold text-leaf">
                        ₱{p.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-wider text-earth/40">Available</p>
                      <p className="font-medium tabular-nums text-leaf">{p.qty} head</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleInquiry(p)}
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

export default AvailablePigs;
