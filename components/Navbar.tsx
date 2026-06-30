"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-neutral-950/60 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="group flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-lg shadow-lg shadow-amber-500/20 transition-transform group-hover:scale-105">
            ⚡
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Idea<span className="text-amber-400">Watts</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          {user ? (
            <>
              <span className="hidden max-w-[12rem] truncate text-neutral-400 sm:inline">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-neutral-200 transition-colors hover:bg-white/5"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-amber-500 px-3.5 py-1.5 font-medium text-neutral-950 transition-colors hover:bg-amber-400"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
