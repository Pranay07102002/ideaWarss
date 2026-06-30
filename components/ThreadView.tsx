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

  const totalVotes = ideas.reduce((s, i) => s + i.votes, 0);

  return (
    <div className="mt-4 space-y-6">
      {/* Thread header — brand bento */}
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="card-brand relative overflow-hidden p-7"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="pill bg-white/15 text-white">💬 thread</span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
              {thread.title}
            </h1>
            {thread.description && (
              <p className="mt-2 max-w-xl text-white/80">{thread.description}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="pill bg-white/15 text-white">
                💡 {ideas.length} idea{ideas.length === 1 ? "" : "s"}
              </span>
              <span className="pill bg-white/15 text-white">
                🔥 {totalVotes} vote{totalVotes === 1 ? "" : "s"}
              </span>
            </div>
          </div>
          <ShareButton />
        </div>
      </motion.header>

      {/* Post an idea */}
      {currentUserId ? (
        <form onSubmit={postIdea} className="card-light p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your idea… the crowd decides what rises."
            rows={2}
            className="w-full resize-none rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-brand-400"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs font-medium text-ink/40">
              {content.length}/280
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={posting || !content.trim() || content.length > 280}
              className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-brand-600 disabled:opacity-50"
            >
              {posting ? "Posting…" : "⚡ Post idea"}
            </motion.button>
          </div>
        </form>
      ) : (
        <div className="card-light flex items-center justify-between gap-3 p-5">
          <p className="text-sm font-medium text-ink/70">
            Sign in to post ideas and upvote.
          </p>
          <a
            href={`/login?next=/thread/${thread.id}`}
            className="shrink-0 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-brand-600"
          >
            Sign in
          </a>
        </div>
      )}

      {/* View toggle */}
      <div className="flex items-center gap-1 rounded-full bg-white/5 p-1 text-sm">
        {(["feed", "leaderboard"] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="relative flex-1 rounded-full px-3 py-2 font-semibold transition-colors"
          >
            {view === v && (
              <motion.span
                layoutId="view-pill"
                className="absolute inset-0 rounded-full bg-brand-500 shadow-glow"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span
              className={`relative z-10 ${
                view === v ? "text-white" : "text-lavender/60"
              }`}
            >
              {v === "leaderboard" ? "🏆 Leaderboard" : "💬 Discussion"}
            </span>
          </button>
        ))}
      </div>

      {/* Ideas */}
      {orderedIdeas.length === 0 ? (
        <div className="card-light px-6 py-12 text-center">
          <p className="text-2xl">⚡</p>
          <p className="mt-2 text-sm font-medium text-ink/70">
            No ideas yet. Drop the first spark.
          </p>
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
