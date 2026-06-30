"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const supabase = createClient();
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("next") || "/";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else if (data.session) {
        router.push(redirectTo);
        router.refresh();
      } else {
        setMessage(
          "Check your inbox to confirm your email, then sign in. (Tip: disable email confirmation in Supabase for instant access.)"
        );
        setMode("signin");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    }
    setLoading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto mt-10 max-w-sm"
    >
      <div className="card-light p-7">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-lg text-white shadow-glow">
            ⚡
          </span>
          <span className="text-lg font-extrabold tracking-tight text-ink">
            ideawatts<span className="text-brand-500">.</span>
          </span>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-ink/55">
          {mode === "signin"
            ? "Sign in with your email to post and vote."
            : "Sign up with your email — that's all you need."}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-brand-400"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-brand-400"
          />

          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          {message && (
            <p className="text-sm font-medium text-brand-600">{message}</p>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            type="submit"
            className="w-full rounded-full bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-brand-600 disabled:opacity-60"
          >
            {loading
              ? "Please wait…"
              : mode === "signin"
                ? "Sign in"
                : "Sign up"}
          </motion.button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setMessage(null);
          }}
          className="mt-4 w-full text-center text-sm font-medium text-ink/50 transition-colors hover:text-ink"
        >
          {mode === "signin"
            ? "New here? Create an account"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
