export function SetupNotice() {
  return (
    <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
      <h2 className="text-lg font-semibold text-amber-300">
        Almost there — connect Supabase
      </h2>
      <p className="mt-2 text-sm text-neutral-300">
        IdeaWatts needs Supabase credentials to run. Create a project at{" "}
        <a
          href="https://supabase.com"
          className="text-amber-300 underline"
          target="_blank"
          rel="noreferrer"
        >
          supabase.com
        </a>
        , run <code className="text-amber-200">supabase-schema.sql</code> in the
        SQL Editor, then add these environment variables:
      </p>
      <pre className="mt-3 overflow-x-auto rounded-lg bg-neutral-900/80 p-3 text-xs text-neutral-300">
        {`NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...`}
      </pre>
      <p className="mt-3 text-sm text-neutral-400">
        Locally: copy <code className="text-amber-200">.env.local.example</code>{" "}
        to <code className="text-amber-200">.env.local</code>. On Vercel: add
        them under Project Settings → Environment Variables.
      </p>
    </div>
  );
}
