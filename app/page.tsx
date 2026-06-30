import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { SetupNotice } from "@/components/SetupNotice";
import { BentoHero } from "@/components/BentoHero";
import { NewThreadForm } from "@/components/NewThreadForm";
import { ThreadsList } from "@/components/ThreadsList";
import type { Thread } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  if (!isSupabaseConfigured) return <SetupNotice />;

  const supabase = createClient();

  let threadList: Thread[] = [];
  let ideasTotal = 0;
  let votesTotal = 0;

  try {
    const [{ data: threads }, ideasCount, votesCount] = await Promise.all([
      supabase.from("threads").select("*").order("created_at", { ascending: false }),
      supabase.from("ideas").select("*", { count: "exact", head: true }),
      supabase.from("votes").select("*", { count: "exact", head: true }),
    ]);
    threadList = (threads as Thread[]) ?? [];
    ideasTotal = ideasCount.count ?? 0;
    votesTotal = votesCount.count ?? 0;
  } catch {
    // Supabase unreachable (e.g. placeholder creds) — render the shell.
  }

  return (
    <div className="space-y-8 pt-2">
      <BentoHero
        threads={threadList.length}
        ideas={ideasTotal}
        votes={votesTotal}
      />

      <NewThreadForm />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-lavender/50">
            Discussion threads
          </h2>
          <span className="text-xs text-lavender/40">
            {threadList.length} active
          </span>
        </div>
        <ThreadsList initialThreads={threadList} />
      </section>
    </div>
  );
}
