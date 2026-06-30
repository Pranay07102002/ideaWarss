"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Thread } from "@/lib/types";

export function ThreadsList({ initialThreads }: { initialThreads: Thread[] }) {
  if (initialThreads.length === 0) {
    return (
      <div className="glass rounded-2xl px-5 py-10 text-center text-sm text-neutral-400">
        No threads yet. Be the first to start one ⚡
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {initialThreads.map((thread, i) => (
        <motion.div
          key={thread.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.3, ease: "easeOut" }}
        >
          <Link
            href={`/thread/${thread.id}`}
            className="glass group block rounded-2xl p-5 transition-all hover:border-amber-400/30 hover:bg-white/[0.07]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold transition-colors group-hover:text-amber-300">
                  {thread.title}
                </h3>
                {thread.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-400">
                    {thread.description}
                  </p>
                )}
              </div>
              <span className="shrink-0 text-neutral-600 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-400">
                →
              </span>
            </div>
            <p className="mt-3 text-xs text-neutral-500">
              {new Date(thread.created_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
