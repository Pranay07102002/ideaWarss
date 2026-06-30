import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { SetupNotice } from "@/components/SetupNotice";
import { ThreadView } from "@/components/ThreadView";
import type { Idea, IdeaWithVotes, Thread } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ThreadPage({
  params,
}: {
  params: { id: string };
}) {
  if (!isSupabaseConfigured) return <SetupNotice />;

  const supabase = createClient();

  const { data: thread } = await supabase
    .from("threads")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!thread) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: ideas } = await supabase
    .from("ideas")
    .select("*")
    .eq("thread_id", params.id);

  const ideaIds = (ideas ?? []).map((i) => i.id);
  const { data: votes } = ideaIds.length
    ? await supabase.from("votes").select("idea_id, user_id").in("idea_id", ideaIds)
    : { data: [] as { idea_id: string; user_id: string }[] };

  const voteList = votes ?? [];
  const initialIdeas: IdeaWithVotes[] = (ideas as Idea[] ?? []).map((idea) => ({
    ...idea,
    votes: voteList.filter((v) => v.idea_id === idea.id).length,
    votedByMe: user
      ? voteList.some((v) => v.idea_id === idea.id && v.user_id === user.id)
      : false,
  }));

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-neutral-400 transition-colors hover:text-neutral-200"
      >
        ← All threads
      </Link>

      <ThreadView
        thread={thread as Thread}
        initialIdeas={initialIdeas}
        currentUserId={user?.id ?? null}
        currentUserEmail={user?.email ?? null}
      />
    </div>
  );
}
