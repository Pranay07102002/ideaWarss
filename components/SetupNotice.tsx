export function SetupNotice() {
  return (
    <div className="card-light mx-auto mt-10 max-w-xl p-7">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-xl text-white shadow-glow">
        ⚡
      </span>
      <h2 className="mt-4 text-xl font-extrabold tracking-tight text-ink">
        Almost there — connect Supabase
      </h2>
      <p className="mt-2 text-sm text-ink/65">
        IdeaWatts needs Supabase credentials to run. Create a project at{" "}
        <a
          href="https://supabase.com"
          className="font-semibold text-brand-600 underline"
          target="_blank"
          rel="noreferrer"
        >
          supabase.com
        </a>
        , run <code className="text-brand-700">supabase-schema.sql</code> in the
        SQL Editor, then add these environment variables:
      </p>
      <pre className="mt-3 overflow-x-auto rounded-2xl bg-ink/90 p-4 text-xs text-lavender">
        {`NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...`}
      </pre>
      <p className="mt-3 text-sm text-ink/55">
        Locally: copy <code className="text-brand-700">.env.local.example</code>{" "}
        to <code className="text-brand-700">.env.local</code>. On Vercel: add
        them under Project Settings → Environment Variables.
      </p>
    </div>
  );
}
