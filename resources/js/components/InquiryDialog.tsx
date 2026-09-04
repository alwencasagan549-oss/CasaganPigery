import React, { useEffect, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Pig {
  id: number;
  type: string;
  name?: string;
  price: number;
  qty: number;
}

interface InquiryDialogProps {
  pig: Pig | null;
  onClose: () => void;
}

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

export const InquiryDialog = ({ pig, onClose }: InquiryDialogProps) => {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [fbName, setFbName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fbId, setFbId] = useState("");
  const [fbPic, setFbPic] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFbLoading, setIsFbLoading] = useState(false);

  // REPLACE THIS WITH YOUR FACEBOOK APP ID FROM developers.facebook.com
  const FB_APP_ID = "2062909744644105"; 
  const FB_PAGE_USERNAME = "jeosilita.tiwanagsingcay"; 

  useEffect(() => {
    if (pig) setQuantity(1);

    // Initialize Facebook SDK
    if (!window.FB) {
      window.fbAsyncInit = function() {
        window.FB.init({
          appId      : FB_APP_ID,
          cookie     : true,
          xfbml      : true,
          version    : 'v18.0'
        });
      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        (js as any).src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode?.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }
  }, [pig]);

  if (!pig) return null;

  const handleFacebookLogin = () => {
    setIsFbLoading(true);
    window.FB.login((response: any) => {
      if (response.authResponse) {
        window.FB.api('/me', { fields: 'name,picture' }, (res: any) => {
          setFbName(res.name);
          setFbId(res.id);
          setFbPic(res.picture?.data?.url || "");
          setIsFbLoading(false);
          toast({ title: "Connected!", description: `Logged in as ${res.name}` });
        });
      } else {
        setIsFbLoading(false);
        toast({ variant: "destructive", title: "Login Cancelled", description: "Facebook login was not completed." });
      }
    }, { scope: 'public_profile' });
  };

  const total = quantity * pig.price;
  const isSow = pig.type.includes("Sow") || !!pig.name;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const message = `Hello CasaganPigery! 🐖

I would like to inquire about this pig:
• Item: ${isSow && pig.name ? `"${pig.name}" (${pig.type})` : pig.type}
• Price: ₱${total.toLocaleString()}
• Quantity: ${isSow ? "1" : quantity}

My Details:
• Name: ${fbName}
• Address: ${address}
${notes ? `• Note: ${notes}` : ""}

Please let me know if this is available. Thank you!`;

    const messengerUrl = `https://m.me/${FB_PAGE_USERNAME}?text=${encodeURIComponent(message)}`;

    try {
      // START SAVING TO DATABASE
      const savePromise = fetch("/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
        body: JSON.stringify({
          pig_id: pig.id,
          fb_id: fbId,
          fb_profile_pic: fbPic,
          customer_name: fbName,
          phone: phone,
          address: address,
          qty: quantity,
          message: notes,
        }),
      });

      // ON DESKTOP: Sometimes async window.open is blocked. 
      // We try to open it immediately or use location.href as fallback
      toast({ title: "Connecting...", description: "Opening Messenger for you..." });
      
      const res = await savePromise;

      if (res.ok) {
        // Successful save, now redirect
        window.location.href = messengerUrl;
      } else {
        throw new Error("Failed to save");
      }

    } catch (err) {
      console.error(err);
      // Fallback: even if DB fails, let them message you!
      window.location.href = messengerUrl;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-leaf-deep/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-sun rounded-t-3xl md:rounded-3xl shadow-leaf overflow-hidden max-h-[92vh] overflow-y-auto">
        <div className="bg-leaf p-6 text-sun flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-sun/70">Purchase Inquiry</p>
            <h2 className="font-display text-2xl font-medium mt-1">
              {isSow && pig.name ? `"${pig.name}" (${pig.type})` : pig.type}
            </h2>
          </div>
          <button onClick={onClose} className="size-9 rounded-full bg-sun/15 hover:bg-sun/25 flex items-center justify-center">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-5">
          {/* Identity Section */}
          <div className="space-y-4">
            <div className="text-center py-2">
              <p className="text-sm font-medium text-leaf leading-relaxed">
                "We need you to login your account so we can message you too."
              </p>
            </div>
            
            {!fbId ? (
              <div className="bg-white border border-straw p-6 rounded-2xl text-center space-y-4 shadow-sm">
                <div className="size-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto">
                  <svg className="size-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> 
                </div>
                <div>
                  <h4 className="font-bold text-leaf">Connect to Continue</h4>
                  <p className="text-xs text-earth/50 mt-1">Login with Facebook to securely send your inquiry.</p>
                </div>
                <button 
                  type="button" 
                  onClick={handleFacebookLogin}
                  disabled={isFbLoading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-md disabled:opacity-50"
                >
                  {isFbLoading ? "Connecting..." : "Login with Facebook"}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-white border border-straw p-3 rounded-2xl animate-fade-in shadow-sm">
                <img src={fbPic} className="size-10 rounded-full border border-straw shadow-sm" alt="FB" />
                <div>
                  <p className="text-sm font-bold text-leaf leading-tight">{fbName}</p>
                  <p className="text-[10px] text-earth/40">Verified via Facebook</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => { setFbId(""); setFbPic(""); setFbName(""); }}
                  className="ml-auto text-[10px] text-red-500 font-medium hover:underline"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {fbId && (
            <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Buyer Address</label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Barangay, Municipality, Province"
                  className="w-full rounded-2xl border border-straw bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Contact Number</label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912 345 6789"
                  className="w-full rounded-2xl border border-straw bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={pig.qty}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(pig.qty, Math.max(1, +e.target.value || 1)))}
                    className="w-full rounded-2xl border border-straw bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Price Est.</label>
                  <div className="rounded-2xl bg-straw px-4 py-3 font-display text-xl font-semibold text-leaf tabular-nums">
                    ₱{total.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-earth/50">Additional Message (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ask about vaccination, age, or schedule a visit..."
                  className="w-full rounded-2xl border border-straw bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-leaf/20 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-leaf py-4 font-display text-lg font-medium text-sun shadow-soft hover:bg-leaf-deep transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <MessageCircle className="size-5" />
                {isSubmitting ? "Processing..." : "Send Inquiry via Messenger"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
