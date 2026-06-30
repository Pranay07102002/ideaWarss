"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
    <header className="sticky top-0 z-30 bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-lg shadow-glow transition-transform group-hover:scale-105">
            ⚡
          </span>
          <span className="text-xl font-bold tracking-tight text-white">
            idea<span className="text-brand-300">watts</span>
            <span className="text-brand-400">.</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          {user ? (
            <>
              <span className="hidden max-w-[12rem] items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-lavender/70 sm:inline-flex">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-[10px] font-bold uppercase text-white">
                  {user.email?.[0] ?? "?"}
                </span>
                <span className="truncate">{user.email}</span>
              </span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={signOut}
                className="rounded-full border border-white/10 px-4 py-2 font-medium text-lavender transition-colors hover:bg-white/5"
              >
                Sign out
              </motion.button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-white px-4 py-2 font-semibold text-ink transition-transform hover:scale-105"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
