"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { IdeaWithVotes } from "@/lib/types";

const MEDALS = ["🥇", "🥈", "🥉"];

export function IdeaCard({
  idea,
  rank,
  onVote,
}: {
  idea: IdeaWithVotes;
  rank: number | null;
  onVote: () => void;
}) {
  const [sparks, setSparks] = useState(0);

  function handleVote() {
    if (!idea.votedByMe) setSparks((s) => s + 1); // burst only on upvote
    onVote();
  }

  const isPodium = rank !== null && rank < 3;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      className={`glass flex items-start gap-3 rounded-2xl p-4 ${
        isPodium ? "border-amber-400/30 bg-amber-400/[0.06]" : ""
      }`}
    >
      {/* Rank badge in leaderboard view */}
      {rank !== null && (
        <div className="w-7 shrink-0 pt-0.5 text-center text-lg font-bold text-neutral-500">
          {MEDALS[rank] ?? rank + 1}
        </div>
      )}

      {/* Upvote control */}
      <div className="relative flex shrink-0 flex-col items-center">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleVote}
          aria-label="Upvote"
          className={`grid h-10 w-10 place-items-center rounded-xl border transition-colors ${
            idea.votedByMe
              ? "border-amber-400 bg-amber-500 text-neutral-950"
              : "border-white/10 bg-white/5 text-neutral-300 hover:border-amber-400/50 hover:text-amber-300"
          }`}
        >
          <motion.span
            key={idea.votedByMe ? "on" : "off"}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
          >
            ▲
          </motion.span>
        </motion.button>

        <motion.span
          key={idea.votes}
          initial={{ scale: 1.4, color: "#fbbf24" }}
          animate={{ scale: 1, color: "#a3a3a3" }}
          transition={{ duration: 0.3 }}
          className="mt-1 text-sm font-semibold tabular-nums"
        >
          {idea.votes}
        </motion.span>

        {/* Spark burst */}
        <AnimatePresence>
          {sparks > 0 && (
            <SparkBurst key={sparks} onDone={() => setSparks(0)} />
          )}
        </AnimatePresence>
      </div>

      <p className="min-w-0 flex-1 whitespace-pre-wrap break-words pt-1 text-sm leading-relaxed text-neutral-100">
        {idea.content}
        {idea.author_email && (
          <span className="mt-2 block text-xs text-neutral-500">
            — {idea.author_email.split("@")[0]}
          </span>
        )}
      </p>
    </motion.div>
  );
}

function SparkBurst({ onDone }: { onDone: () => void }) {
  const particles = Array.from({ length: 6 });
  return (
    <div className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: Math.cos(angle) * 22,
              y: Math.sin(angle) * 22,
              scale: 0.4,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onAnimationComplete={() => i === 0 && onDone()}
            className="absolute h-1.5 w-1.5 rounded-full bg-amber-400"
          />
        );
      })}
    </div>
  );
}
