import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppNav } from "@/components/AppNav";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — SellForge" },
      {
        name: "description",
        content:
          "Create a free SellForge account to unlock the 30-day roadmap, Sales Lab practice and your progress dashboard.",
      },
      { property: "og:title", content: "Create your SellForge account" },
      {
        property: "og:description",
        content: "Free account — unlock lessons, the roadmap and AI practice in seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (fullName.trim().length < 2) return setError("Please enter your full name.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords don't match.");

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName.trim() },
        },
      });
      if (error) throw error;
      if (data.session) {
        navigate({ to: "/dashboard" });
      } else {
        setCheckEmail(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNav />
      <main className="mx-auto flex max-w-md flex-col px-6 py-12">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">Join SellForge</div>
        <h1 className="mt-2 font-display text-4xl">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Free account — unlocks the lessons, roadmap and Sales Lab straight away.
        </p>

        {checkEmail ? (
          <div className="mt-6 rounded-xl border border-primary/40 bg-card p-6 shadow-glow">
            <div className="font-display text-xl">Check your email ✉️</div>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a confirmation link to <strong className="text-foreground">{email}</strong>.
              Click it to activate your account, then log in.
            </p>
            <Link
              to="/login"
              className="mt-4 inline-block rounded-md bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              Go to log in
            </Link>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="mt-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-6 shadow-card"
          >
            <Field label="Full name">
              <input
                required
                value={fullName}
                autoComplete="name"
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label="Email">
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label="Password">
              <input
                required
                type="password"
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label="Confirm password">
              <input
                required
                type="password"
                minLength={8}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>

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
              {loading ? "Creating account…" : "Create account"}
            </button>

            <p className="mt-2 text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </form>
        )}
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
