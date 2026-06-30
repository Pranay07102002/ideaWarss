import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { SetupNotice } from "@/components/SetupNotice";
import { NewThreadForm } from "@/components/NewThreadForm";
import { ThreadsList } from "@/components/ThreadsList";
import type { Thread } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  if (!isSupabaseConfigured) return <SetupNotice />;

  const supabase = createClient();
  const { data: threads } = await supabase
    .from("threads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <section className="pt-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Where ideas get their{" "}
          <span className="bg-gradient-to-r from-amber-300 to-orange-500 bg-clip-text text-transparent">
            watts
          </span>
          .
        </h1>
        <p className="mt-2 max-w-xl text-neutral-400">
          Open a thread, collect ideas, upvote the best, and watch the
          leaderboard light up. Share any thread link and let the crowd decide.
        </p>
      </section>

      <NewThreadForm />

      <section>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-neutral-500">
          Threads
        </h2>
        <ThreadsList initialThreads={(threads as Thread[]) ?? []} />
      </section>
    </div>
  );
}
