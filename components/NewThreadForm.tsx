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
      <div className="glass flex items-center justify-between rounded-2xl px-5 py-4">
        <p className="text-sm text-neutral-300">
          Sign in to start a thread and post ideas.
        </p>
        <a
          href="/login"
          className="rounded-lg bg-amber-500 px-3.5 py-1.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-amber-400"
        >
          Sign in
        </a>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-1.5">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-neutral-400 transition-colors hover:bg-white/5"
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-500/15 text-amber-300">
            +
          </span>
          Start a new discussion thread…
        </button>
      ) : (
        <AnimatePresence>
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            onSubmit={createThread}
            className="space-y-3 p-3"
          >
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Thread title — e.g. “Features for v2”"
              className="w-full rounded-xl border border-white/10 bg-neutral-900/60 px-3.5 py-2.5 text-sm outline-none focus:border-amber-400/60"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={2}
              className="w-full resize-none rounded-xl border border-white/10 bg-neutral-900/60 px-3.5 py-2.5 text-sm outline-none focus:border-amber-400/60"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-1.5 text-sm text-neutral-400 hover:text-neutral-200"
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                disabled={loading || !title.trim()}
                className="rounded-lg bg-amber-500 px-4 py-1.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
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
