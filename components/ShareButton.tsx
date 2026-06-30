"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
        return;
      }
    } catch {
      // user cancelled native share — fall through to copy
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked — no-op
    }
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={share}
      className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-neutral-200 transition-colors hover:border-amber-400/50 hover:text-amber-300"
    >
      {copied ? "Copied ✓" : "Share"}
    </motion.button>
  );
}
