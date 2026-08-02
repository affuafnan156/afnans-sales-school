import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Staff Sign In — SellForge" },
      { name: "description", content: "Restricted SellForge staff area." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/admin/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 font-display text-2xl">
          <span className="inline-block h-3 w-3 rounded-full bg-primary shadow-glow" />
          SELL <span className="text-primary">FORGE</span>
        </div>
        <h1 className="mt-6 font-display text-3xl">Staff sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Restricted area. Accounts without administrator permissions will be denied.
        </p>

        <form
          onSubmit={submit}
          className="mt-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-6 shadow-card"
        >
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
          />
          <label className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
            Password
          </label>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
          />
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
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
