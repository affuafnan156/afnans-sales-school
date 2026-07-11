import { Link } from "@tanstack/react-router";
import { useProgress } from "@/lib/progress";
import { useTheme } from "@/lib/theme";

const LINKS: { to: string; label: string }[] = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/lab", label: "Sales Lab" },
  { to: "/arcade", label: "Arcade" },
  { to: "/profile", label: "Profile" },
];

export function AppNav() {
  const { p } = useProgress();
  const { theme, toggle } = useTheme();
  const tierBadge =
    p.unlockedTier === "pro" ? "PRO" : p.unlockedTier === "free" ? "FREE" : "GUEST";
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl">
          <span className="inline-block h-3 w-3 rounded-full bg-primary shadow-glow" />
          AFNAN <span className="text-primary">SALES</span>
        </Link>
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "bg-primary/15 text-primary" }}
              className="rounded-md px-3 py-1.5 text-muted-foreground transition hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-md border border-border bg-card px-2 py-1 hover:border-primary/60"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <span className="rounded-md border border-border bg-card px-2 py-1">
            Lv <strong className="text-primary">{p.level}</strong> · {p.xp} XP
          </span>
          <span className="rounded-md border border-border bg-card px-2 py-1">
            🔥 {p.streakDays}d
          </span>
          <span
            className={`rounded-md px-2 py-1 font-semibold ${
              p.unlockedTier === "pro"
                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                : p.unlockedTier === "free"
                  ? "border border-primary/50 text-primary"
                  : "border border-border text-muted-foreground"
            }`}
          >
            {tierBadge}
          </span>
        </div>
      </nav>
    </header>
  );
}

export function GatedNotice({ tier }: { tier: "free" | "pro" }) {
  return (
    <div className="rounded-xl border border-primary/40 bg-card p-6 text-center shadow-glow">
      <div className="font-display text-xl">
        {tier === "pro" ? "Pro-only content" : "Unlock the full library"}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {tier === "pro"
          ? "Enroll in Pro to unlock this — send your details from the home page enroll form and pick 'Pro'."
          : "Enroll (Free is fine) to unlock lessons, scripts, and videos. Sending your details keeps this personal."}
      </p>
      <Link
        to="/"
        hash="join"
        className="mt-4 inline-block rounded-md bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90"
      >
        Go to enroll form
      </Link>
    </div>
  );
}
