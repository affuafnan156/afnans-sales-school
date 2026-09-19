import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppNav } from "@/components/AppNav";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — SellForge" },
      {
        name: "description",
        content: "Log in to SellForge to continue your 30-day roadmap, practice in the Sales Lab and track your progress.",
      },
      { property: "og:title", content: "Log in to SellForge" },
      { property: "og:description", content: "Pick up your roadmap, streak and Sales Lab practice." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        throw new Error(
          /invalid login/i.test(error.message)
            ? "That email and password don't match an account."
            : /confirm/i.test(error.message)
              ? "Please confirm your email first — check your inbox for the link."
              : error.message,
        );
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Log in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNav />
      <main className="mx-auto flex max-w-md flex-col px-6 py-12">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">Welcome back</div>
        <h1 className="mt-2 font-display text-4xl">Log in</h1>

        <form
          onSubmit={submit}
          className="mt-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-6 shadow-card"
        >
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Email</span>
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Password</span>
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
            />
          </label>

          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-md bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>

          <Link
            to="/forgot-password"
            className="mt-1 text-center text-xs text-muted-foreground hover:text-primary"
          >
            Forgot password?
          </Link>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
