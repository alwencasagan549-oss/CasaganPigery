import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Sprout, ShieldCheck, HeartPulse, MapPin, Anchor, Camera } from "lucide-react";

const About = () => {
  const gallery = [
    { src: "/assets/gallery-1.png", alt: "Healthy livestock in clean environment" },
    { src: "/assets/gallery-2.png", alt: "Cute piglet close up" },
    { src: "/assets/gallery-3.png", alt: "Farm landscape at sunset" },
  ];

  return (
    <div className="min-h-dvh bg-sun text-earth flex flex-col">
      <Navbar />

      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/about-hero.png" 
            className="w-full h-full object-cover" 
            alt="Farm Background" 
          />
          <div className="absolute inset-0 bg-leaf-deep/60 backdrop-blur-[2px]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-24 text-center relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-sun/20 border border-sun/30 px-4 py-1.5 text-xs font-semibold text-sun uppercase tracking-widest mb-6 animate-fade-in">
            Established 2010
          </span>
          <h1 className="font-display text-5xl md:text-8xl font-medium text-sun leading-[1.1] tracking-tight animate-slide-up">
            Rooted in Soil, <br /> 
            <span className="italic text-rattan-light">Raised by the Sea.</span>
          </h1>
          <p className="mt-8 text-xl text-sun/80 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Since 2010, CasaganPigery has been a family-driven mission to bring high-quality, sustainable livestock to our local community.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 space-y-32">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="font-display text-4xl md:text-5xl font-medium text-leaf">From Humble Beginnings.</h2>
              <div className="h-1.5 w-20 bg-rattan rounded-full" />
            </div>
            <div className="space-y-6 text-earth/70 leading-relaxed text-lg">
              <p>
                Our journey began in 2010 as a small family project focused on a simple belief: <strong className="text-leaf">Honest farming creates healthy communities.</strong> What started with just a few pens has grown into a standard-setting piggery in Dinagat Island.
              </p>
              <p>
                In 2023, we moved to our current location in <strong>Bagumbayan, Dinagat</strong>, bringing over a decade of experience in biosecurity and animal welfare to the islands.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="p-6 rounded-3xl bg-white border border-straw shadow-soft hover:shadow-leaf transition-all group">
                <div className="size-12 rounded-2xl bg-straw flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="size-6 text-leaf" />
                </div>
                <h4 className="font-bold text-leaf text-lg">Island Home</h4>
                <p className="text-sm text-earth/60 mt-2">Proudly operating in P-7 Bagumbayan, serving the entire Dinagat Island province.</p>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-straw shadow-soft hover:shadow-leaf transition-all group">
                <div className="size-12 rounded-2xl bg-straw flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Anchor className="size-6 text-leaf" />
                </div>
                <h4 className="font-bold text-leaf text-lg">Local Trade</h4>
                <p className="text-sm text-earth/60 mt-2">We support local traders and families with fair, transparent pricing.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-[3rem] bg-straw/30 overflow-hidden relative shadow-leaf">
              <div className="absolute inset-0 rattan-dots opacity-40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6">
                 <div className="size-24 rounded-full border-4 border-leaf/20 p-2">
                    <img src="/assets/logo.png" className="w-full h-full object-contain" alt="Logo" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="font-display text-3xl text-leaf">Our Standards</h3>
                    <p className="text-earth/60">Every pig in our farm is tracked with a complete digital record of health, weight, and pedigree.</p>
                 </div>
                 <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                       <ShieldCheck className="size-8 text-leaf mb-1" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-rattan">Bio-Secure</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <HeartPulse className="size-8 text-leaf mb-1" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-rattan">Well-Fed</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <Sprout className="size-8 text-leaf mb-1" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-rattan">Eco-Friendly</span>
                    </div>
                 </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-leaf text-sun p-8 rounded-full shadow-leaf hidden md:block">
               <p className="text-xs font-bold uppercase tracking-widest leading-none">Since</p>
               <p className="font-display text-3xl font-medium mt-1">2010</p>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="space-y-10">
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-straw px-4 py-1.5 text-xs font-bold text-rattan uppercase tracking-widest">
              <Camera className="size-3.5" /> Farm Life
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-medium text-leaf">Gallery</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gallery.map((img, i) => (
              <div key={i} className="aspect-square rounded-[2rem] overflow-hidden border border-straw shadow-card hover:shadow-leaf transition-all hover:-translate-y-2 group">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="rounded-[4rem] bg-leaf p-12 md:p-24 relative overflow-hidden text-center text-sun shadow-leaf">
          <div className="absolute inset-0 rattan-dots opacity-20" />
          <div className="relative max-w-3xl mx-auto space-y-10">
            <div className="inline-block p-4 rounded-full bg-sun/10 backdrop-blur-md mb-2">
              <Sprout className="size-8 text-sun" />
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-medium leading-tight">
              Honest livestock for <br className="hidden md:block" /> a stronger community.
            </h2>
            <p className="text-sun/80 text-xl leading-relaxed italic">
              "We believe that every family deserves access to meat that is raised with transparency and care. Our farm is built on the values of integrity, hard work, and the love for our land here in Dinagat."
            </p>
            <div className="pt-6 border-t border-sun/20 inline-block px-10">
              <p className="font-display text-2xl">Alfredo G. Casagan</p>
              <p className="text-sun/50 text-xs uppercase tracking-widest mt-2 font-bold">Founder & Lead Manager</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
