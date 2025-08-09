"use client";

import { useEffect } from "react";

export function Confetti() {
  useEffect(() => {
    let confettiScript: HTMLScriptElement | null = null;
    if (typeof window !== "undefined") {
      confettiScript = document.createElement("script");
      confettiScript.src =
        "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
      confettiScript.async = true;
      confettiScript.onload = () => {
        // @ts-ignore
        if (window.confetti) {
          // @ts-ignore
          window.confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      };
      document.body.appendChild(confettiScript);
    }
    return () => {
      if (confettiScript) document.body.removeChild(confettiScript);
    };
  }, []);
  return null;
}