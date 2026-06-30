"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { IdeaCard } from "@/components/IdeaCard";
import { ShareButton } from "@/components/ShareButton";
import type { IdeaWithVotes, Thread } from "@/lib/types";

type View = "feed" | "leaderboard";

export function ThreadView({
  thread,
  initialIdeas,
  currentUserId,
  currentUserEmail,
}: {
  thread: Thread;
  initialIdeas: IdeaWithVotes[];
  currentUserId: string | null;
  currentUserEmail: string | null;
}) {
  const supabase = createClient();
  const [ideas, setIdeas] = useState<IdeaWithVotes[]>(initialIdeas);
  const [view, setView] = useState<View>("feed");
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  // Live updates: keep vote counts and new ideas in sync across users.
  useEffect(() => {
    const channel = supabase
      .channel(`thread-${thread.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ideas",
          filter: `thread_id=eq.${thread.id}`,
        },
        (payload) => {
          const row = payload.new as IdeaWithVotes;
          setIdeas((prev) =>
            prev.some((i) => i.id === row.id)
              ? prev
              : [...prev, { ...row, votes: 0, votedByMe: false }]
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "votes" },
        (payload) => {
          const row = (payload.new ?? payload.old) as {
            idea_id: string;
            user_id: string;
          };
          if (!row) return;
          setIdeas((prev) =>
            prev.map((i) =>
              i.id === row.idea_id
                ? {
                    ...i,
                    votes: Math.max(
                      0,
                      i.votes + (payload.eventType === "INSERT" ? 1 : -1)
                    ),
                  }
                : i
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, thread.id]);

  async function postIdea(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUserId || !content.trim()) return;
    setPosting(true);

    const { data, error } = await supabase
      .from("ideas")
      .insert({
        thread_id: thread.id,
        content: content.trim(),
        created_by: currentUserId,
        author_email: currentUserEmail,
      })
      .select()
      .single();

    setPosting(false);
    if (!error && data) {
      setContent("");
      setIdeas((prev) =>
        prev.some((i) => i.id === data.id)
          ? prev
          : [{ ...(data as IdeaWithVotes), votes: 0, votedByMe: false }, ...prev]
      );
    }
  }

  async function toggleVote(idea: IdeaWithVotes) {
    if (!currentUserId) {
      window.location.href = `/login?next=/thread/${thread.id}`;
      return;
    }
    const voted = idea.votedByMe;

    // Optimistic update
    setIdeas((prev) =>
      prev.map((i) =>
        i.id === idea.id
          ? { ...i, votedByMe: !voted, votes: i.votes + (voted ? -1 : 1) }
          : i
      )
    );

    if (voted) {
      await supabase
        .from("votes")
        .delete()
        .eq("idea_id", idea.id)
        .eq("user_id", currentUserId);
    } else {
      const { error } = await supabase
        .from("votes")
        .insert({ idea_id: idea.id, user_id: currentUserId });
      // Roll back if the vote failed (e.g. duplicate).
      if (error) {
        setIdeas((prev) =>
          prev.map((i) =>
            i.id === idea.id
              ? { ...i, votedByMe: true, votes: Math.max(0, i.votes - 1) }
              : i
          )
        );
      }
    }
  }

  const orderedIdeas = useMemo(() => {
    const list = [...ideas];
    if (view === "leaderboard") {
      list.sort(
        (a, b) =>
          b.votes - a.votes ||
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } else {
      list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return list;
  }, [ideas, view]);

  return (
    <div className="mt-4 space-y-6">
      <header className="glass rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight">{thread.title}</h1>
            {thread.description && (
              <p className="mt-1 text-neutral-400">{thread.description}</p>
            )}
            <p className="mt-2 text-xs text-neutral-500">
              {ideas.length} idea{ideas.length === 1 ? "" : "s"} ·{" "}
              {ideas.reduce((s, i) => s + i.votes, 0)} votes
            </p>
          </div>
          <ShareButton />
        </div>
      </header>

      {/* Post an idea */}
      {currentUserId ? (
        <form onSubmit={postIdea} className="glass rounded-2xl p-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your idea…"
            rows={2}
            className="w-full resize-none rounded-xl border border-white/10 bg-neutral-900/60 px-3.5 py-2.5 text-sm outline-none focus:border-amber-400/60"
          />
          <div className="mt-2 flex justify-end">
            <motion.button
              whileTap={{ scale: 0.96 }}
              disabled={posting || !content.trim()}
              className="rounded-lg bg-amber-500 px-4 py-1.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
            >
              {posting ? "Posting…" : "Post idea"}
            </motion.button>
          </div>
        </form>
      ) : (
        <div className="glass flex items-center justify-between rounded-2xl px-5 py-4">
          <p className="text-sm text-neutral-300">
            Sign in to post ideas and upvote.
          </p>
          <a
            href={`/login?next=/thread/${thread.id}`}
            className="rounded-lg bg-amber-500 px-3.5 py-1.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-amber-400"
          >
            Sign in
          </a>
        </div>
      )}

      {/* View toggle */}
      <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1 text-sm">
        {(["feed", "leaderboard"] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="relative flex-1 rounded-lg px-3 py-1.5 font-medium capitalize transition-colors"
          >
            {view === v && (
              <motion.span
                layoutId="view-pill"
                className="absolute inset-0 rounded-lg bg-amber-500"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 ${
                view === v ? "text-neutral-950" : "text-neutral-300"
              }`}
            >
              {v === "leaderboard" ? "🏆 Leaderboard" : "💬 Discussion"}
            </span>
          </button>
        ))}
      </div>

      {/* Ideas */}
      {orderedIdeas.length === 0 ? (
        <div className="glass rounded-2xl px-5 py-10 text-center text-sm text-neutral-400">
          No ideas yet. Drop the first spark ⚡
        </div>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {orderedIdeas.map((idea, index) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                rank={view === "leaderboard" ? index : null}
                onVote={() => toggleVote(idea)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
