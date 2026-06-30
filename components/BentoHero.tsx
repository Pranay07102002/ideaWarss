import { Tile } from "@/components/Tile";

function format(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "K";
  return String(n);
}

export function BentoHero({
  threads,
  ideas,
  votes,
}: {
  threads: number;
  ideas: number;
  votes: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {/* Hero brand tile */}
      <Tile
        delay={0}
        className="card-brand relative col-span-2 row-span-2 flex flex-col justify-between overflow-hidden p-7"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-6 h-36 w-36 rounded-full bg-black/10 blur-2xl" />

        <div className="flex items-center gap-2">
          <span className="pill bg-white/15 text-white">⚡ live</span>
          <span className="pill bg-white/15 text-white">crowd-ranked</span>
        </div>

        <div className="relative z-10 mt-6">
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            Where ideas
            <br />
            get their{" "}
            <span className="bg-gradient-to-r from-white to-brand-200 bg-clip-text text-transparent">
              watts
            </span>
            .
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">
            Spin up a thread, gather ideas, upvote the brightest, and watch the
            leaderboard light up — in real time.
          </p>
        </div>

        <div className="relative z-10 mt-6 flex items-center gap-2 text-xs text-white/70">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15">
            💡
          </span>
          <span>Share any thread link · anyone can join the spark</span>
        </div>
      </Tile>

      {/* Threads */}
      <Tile delay={0.06} className="card-light flex flex-col justify-between p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink/60">Threads</span>
          <span className="text-lg">🧵</span>
        </div>
        <div>
          <p className="text-4xl font-extrabold tracking-tight">
            {format(threads)}
          </p>
          <p className="mt-1 text-xs font-semibold text-accent-green">
            live discussions
          </p>
        </div>
      </Tile>

      {/* Ideas */}
      <Tile delay={0.12} className="card-light flex flex-col justify-between p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink/60">Ideas posted</span>
          <span className="text-lg">💡</span>
        </div>
        <div>
          <p className="text-4xl font-extrabold tracking-tight">
            {format(ideas)}
          </p>
          <p className="mt-1 text-xs font-semibold text-accent-green">
            +{Math.max(1, Math.round(ideas * 0.1))} this week
          </p>
        </div>
      </Tile>

      {/* Votes (brand) */}
      <Tile delay={0.18} className="card-brand flex flex-col justify-between p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white/70">Upvotes cast</span>
          <span className="text-lg">🔥</span>
        </div>
        <div>
          <p className="text-4xl font-extrabold tracking-tight">
            {format(votes)}
          </p>
          <p className="mt-1 text-xs font-medium text-white/70">
            and counting
          </p>
        </div>
      </Tile>

      {/* Community */}
      <Tile delay={0.24} className="card-light flex flex-col justify-between p-6">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-extrabold tracking-tight">4.9</span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-ink/5 text-ink/50">
            ↗
          </span>
        </div>
        <div>
          <div className="flex -space-x-2">
            {["🧑‍🎤", "👩‍💻", "🧑‍🚀"].map((e, i) => (
              <span
                key={i}
                className="grid h-8 w-8 place-items-center rounded-full border-2 border-lavender bg-brand-100 text-sm"
              >
                {e}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs font-medium text-ink/60">
            Loved by idea-hunters
          </p>
        </div>
      </Tile>
    </div>
  );
}
