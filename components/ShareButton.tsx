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
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.04 }}
      onClick={share}
      className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors"
    >
      {copied ? "Copied ✓" : "Share ↗"}
    </motion.button>
  );
}
