import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppNav } from "@/components/AppNav";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin sign in — SellForge" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNav />
      <main className="mx-auto max-w-md px-6 py-16">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">Admin area</div>
        <h1 className="mt-2 font-display text-4xl">
          {mode === "signin" ? "Sign in" : "Create admin account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This section is for the academy team only. Use <strong>affuafnan156@gmail.com</strong> to
          get automatic admin access.
        </p>

        <form
          onSubmit={submit}
          className="mt-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-6 shadow-card"
        >
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
          <input
            type="email"
            required
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
            minLength={6}
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
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            {mode === "signin" ? "Need to create the admin account?" : "Already have an account? Sign in"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">← Back to home</Link>
        </div>
      </main>
    </div>
  );
}
