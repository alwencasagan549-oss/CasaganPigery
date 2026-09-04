import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShieldCheck, Database, Trash2, Lock } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-dvh bg-sun text-earth flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          <header className="mb-12 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center size-16 rounded-3xl bg-leaf/10 text-leaf mb-6">
              <ShieldCheck className="size-8" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-medium text-leaf">Privacy Policy</h1>
            <p className="mt-4 text-earth/60">Last updated: April 25, 2026</p>
          </header>

          <div className="space-y-10 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <section className="space-y-4">
              <h2 className="font-display text-2xl font-medium text-leaf flex items-center gap-3">
                <Database className="size-5" /> Data Collection
              </h2>
              <p className="leading-relaxed text-earth/80">
                CasaganPigery respects your privacy. When you use our website or Facebook Login, we only collect 
                essential information required to process your inquiries:
              </p>
              <ul className="list-disc list-inside space-y-2 text-earth/70 ml-4">
                <li>Your Public Facebook Profile Name (to identify your inquiry)</li>
                <li>Your Profile Picture (to verify identity in our admin dashboard)</li>
                <li>Your Contact Details (if provided during inquiry)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-2xl font-medium text-leaf flex items-center gap-3">
                <Lock className="size-5" /> How We Use Your Data
              </h2>
              <p className="leading-relaxed text-earth/80">
                Your data is stored securely in our private database and is only accessible by the farm administrator 
                (Alfredo G. Casagan). We never sell your data to third parties. We use your Facebook information 
                solely to provide a personalized inquiry experience.
              </p>
            </section>

            <section className="p-8 rounded-3xl bg-white border border-straw shadow-soft space-y-4">
              <h2 className="font-display text-2xl font-medium text-leaf flex items-center gap-3 text-red-600">
                <Trash2 className="size-5" /> User Data Deletion Instructions
              </h2>
              <p className="leading-relaxed text-earth/80 font-medium">
                You have the right to request the deletion of your data from our system at any time.
              </p>
              <div className="space-y-4 text-earth/70">
                <p>To request data deletion, you can follow these steps:</p>
                <ol className="list-decimal list-inside space-y-3 ml-4">
                  <li>
                    Go to your Facebook Profile's **Apps and Websites** settings.
                  </li>
                  <li>
                    Find **CasaganPigery** and click **Remove**.
                  </li>
                  <li>
                    Alternatively, contact us directly at **casaganpigery@gmail.com** with your request.
                  </li>
                </ol>
                <p className="italic text-sm mt-4">
                  Upon receiving a request, we will remove your name and profile picture from our records within 48 hours.
                </p>
              </div>
            </section>

            <section className="text-center pt-10 border-t border-straw">
              <p className="text-earth/50 text-sm">
                If you have any questions about our privacy practices, please contact the farm owner directly.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
