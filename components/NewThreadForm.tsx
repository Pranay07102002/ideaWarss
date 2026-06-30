"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function NewThreadForm() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setUser(s?.user ?? null)
    );
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  async function createThread(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !title.trim()) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("threads")
      .insert({
        title: title.trim(),
        description: description.trim() || null,
        created_by: user.id,
      })
      .select()
      .single();

    setLoading(false);
    if (!error && data) {
      setTitle("");
      setDescription("");
      setOpen(false);
      router.push(`/thread/${data.id}`);
    }
  }

  if (!user) {
    return (
      <div className="card-brand flex flex-col items-start justify-between gap-3 p-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-lg font-bold">Got a topic worth debating?</p>
          <p className="text-sm text-white/75">
            Sign in to open a thread and start collecting ideas.
          </p>
        </div>
        <a
          href="/login"
          className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-105"
        >
          Sign in to start
        </a>
      </div>
    );
  }

  return (
    <div className="card-light overflow-hidden p-2">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-3 rounded-[1.4rem] px-4 py-4 text-left text-ink/60 transition-colors hover:bg-ink/5"
        >
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-brand-500 text-lg text-white shadow-glow">
            +
          </span>
          <span className="font-medium">Start a new discussion thread…</span>
        </button>
      ) : (
        <AnimatePresence>
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={createThread}
            className="space-y-3 p-3"
          >
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Thread title — e.g. “Features for v2”"
              className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-brand-400"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description — what should people brainstorm?"
              rows={2}
              className="w-full resize-none rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-brand-400"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-2 text-sm font-medium text-ink/50 hover:text-ink"
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={loading || !title.trim()}
                className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-brand-600 disabled:opacity-50"
              >
                {loading ? "Creating…" : "Create thread"}
              </motion.button>
            </div>
          </motion.form>
        </AnimatePresence>
      )}
    </div>
  );
}
