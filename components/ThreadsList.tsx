"use client";

import Link from "next/link";
import { Tile } from "@/components/Tile";
import type { Thread } from "@/lib/types";

// A few accent treatments so the grid feels lively, like the reference bento.
const TONES = [
  { card: "card-light", arrow: "text-brand-500", meta: "text-ink/50" },
  { card: "card-brand", arrow: "text-white", meta: "text-white/60" },
];

export function ThreadsList({ initialThreads }: { initialThreads: Thread[] }) {
  if (initialThreads.length === 0) {
    return (
      <Tile className="card-light px-6 py-12 text-center" hover={false}>
        <p className="text-2xl">🪄</p>
        <p className="mt-2 text-sm font-medium text-ink/70">
          No threads yet — start the first one and light it up.
        </p>
      </Tile>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {initialThreads.map((thread, i) => {
        const tone = TONES[i % TONES.length];
        const isBrand = tone.card === "card-brand";
        return (
          <Tile key={thread.id} delay={i * 0.05}>
            <Link
              href={`/thread/${thread.id}`}
              className={`${tone.card} group block h-full p-6`}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-lg ${
                    isBrand ? "bg-white/15" : "bg-brand-100"
                  }`}
                >
                  💬
                </span>
                <span
                  className={`text-xl transition-transform group-hover:translate-x-1 ${tone.arrow}`}
                >
                  →
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold leading-snug">
                {thread.title}
              </h3>
              {thread.description && (
                <p
                  className={`mt-1 line-clamp-2 text-sm ${
                    isBrand ? "text-white/75" : "text-ink/60"
                  }`}
                >
                  {thread.description}
                </p>
              )}

              <p className={`mt-4 text-xs font-medium ${tone.meta}`}>
                Opened{" "}
                {new Date(thread.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </Link>
          </Tile>
        );
      })}
    </div>
  );
}
