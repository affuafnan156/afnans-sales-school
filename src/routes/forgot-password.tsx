import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppNav } from "@/components/AppNav";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — SellForge" },
      { name: "description", content: "Send yourself a SellForge password reset link by email." },
      { property: "og:title", content: "Reset your SellForge password" },
      { property: "og:description", content: "We'll email you a secure link to set a new password." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNav />
      <main className="mx-auto flex max-w-md flex-col px-6 py-12">
        <h1 className="font-display text-4xl">Forgot password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we'll send you a link to set a new password.
        </p>

        {sent ? (
          <div className="mt-6 rounded-xl border border-primary/40 bg-card p-6 shadow-glow text-sm">
            If an account exists for <strong>{email}</strong>, a reset link is on its way.
          </div>
        ) : (
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
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <Link to="/login" className="mt-4 text-center text-xs text-muted-foreground hover:text-primary">
          Back to log in
        </Link>
      </main>
    </div>
  );
}
