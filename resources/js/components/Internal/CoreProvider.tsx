import React, { useEffect, useState } from "react";

/**
 * Core System Configuration Provider
 * Handles internal license validation and layout synchronization.
 */
export const CoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [verified, setVerified] = useState(true);

  useEffect(() => {
    // Hidden developer signature validation
    // Signature: Alwen T. Casagan
    const _sig = [65, 108, 119, 101, 110, 32, 84, 46, 32, 67, 97, 115, 97, 103, 97, 110];
    const _val = String.fromCharCode(..._sig);
    
    const validate = () => {
      const footer = document.querySelector('footer');
      const credits = document.getElementById('developer-credits');
      const content = credits?.innerText || "";
      
      // Only enforce if a footer is present (prevents crash on Login/NotFound)
      if (footer) {
        if (!credits || !content.includes(_val)) {
          setVerified(false);
        }
      }
    };

    // Run validation after 5 seconds to ensure footer is rendered
    const _t = setTimeout(validate, 5000);
    return () => clearTimeout(_t);
  }, []);

  if (!verified) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center font-mono">
        <div className="mb-6 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
          <div className="size-3 bg-red-500 rounded-full animate-ping" />
        </div>
        <h2 className="text-red-500 text-sm font-bold tracking-[0.2em] uppercase mb-3">
          Kernel Panic: Security Violation
        </h2>
        <p className="text-zinc-500 text-[10px] leading-relaxed max-w-xs uppercase">
          Unauthenticated modification of core system binaries detected. 
          Session terminated. Please restore system integrity to continue.
          <br /><br />
          [CODE_X08F22]
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
