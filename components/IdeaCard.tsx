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
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      whileHover={{ y: -3 }}
      className={`card-light flex items-start gap-4 p-5 ${
        isPodium ? "ring-2 ring-brand-400" : ""
      }`}
    >
      {/* Rank badge in leaderboard view */}
      {rank !== null && (
        <div className="w-8 shrink-0 pt-1 text-center text-2xl font-extrabold text-ink/40">
          {MEDALS[rank] ?? <span className="text-lg">#{rank + 1}</span>}
        </div>
      )}

      {/* Upvote control */}
      <div className="relative flex shrink-0 flex-col items-center">
        <motion.button
          whileTap={{ scale: 0.82 }}
          onClick={handleVote}
          aria-label="Upvote"
          className={`grid h-12 w-12 place-items-center rounded-2xl border-2 transition-colors ${
            idea.votedByMe
              ? "border-brand-500 bg-brand-500 text-white shadow-glow"
              : "border-ink/10 bg-white/60 text-ink/50 hover:border-brand-400 hover:text-brand-500"
          }`}
        >
          <motion.span
            key={idea.votedByMe ? "on" : "off"}
            initial={{ scale: 0.5, y: idea.votedByMe ? 4 : 0 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 16 }}
            className="text-base font-bold"
          >
            ▲
          </motion.span>
        </motion.button>

        <motion.span
          key={idea.votes}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          className={`mt-1.5 text-sm font-extrabold tabular-nums ${
            idea.votedByMe ? "text-brand-600" : "text-ink/70"
          }`}
        >
          {idea.votes}
        </motion.span>

        {/* Spark burst */}
        <AnimatePresence>
          {sparks > 0 && <SparkBurst key={sparks} onDone={() => setSparks(0)} />}
        </AnimatePresence>
      </div>

      <p className="min-w-0 flex-1 whitespace-pre-wrap break-words pt-1 text-[15px] font-medium leading-relaxed text-ink">
        {idea.content}
        {idea.author_email && (
          <span className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-ink/45">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-[10px] uppercase text-white">
              {idea.author_email[0]}
            </span>
            {idea.author_email.split("@")[0]}
          </span>
        )}
      </p>
    </motion.div>
  );
}

function SparkBurst({ onDone }: { onDone: () => void }) {
  const particles = Array.from({ length: 7 });
  return (
    <div className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: Math.cos(angle) * 26,
              y: Math.sin(angle) * 26,
              scale: 0.3,
            }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            onAnimationComplete={() => i === 0 && onDone()}
            className="absolute h-1.5 w-1.5 rounded-full bg-brand-500"
          />
        );
      })}
    </div>
  );
}
