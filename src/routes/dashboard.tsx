import { createFileRoute, Link } from "@tanstack/react-router";
import { AppNav } from "@/components/AppNav";
import { useProgress, xpForLevel } from "@/lib/progress";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Afnan Sales Academy" },
      { name: "description", content: "Your personal sales coach: today's mission, streak, skill scores, and next lesson." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

const MISSIONS = [
  "Practice handling one price objection with the AI customer.",
  "Write a 2-line cold DM using the 'question opener'.",
  "Do the One-Minute Challenge: explain a product in 60s.",
  "Reverse Selling: play the buyer, notice one pressure tactic.",
  "Deal of the Day: read today's scenario and reply.",
];

function todayMission() {
  const day = new Date().getDate();
  return MISSIONS[day % MISSIONS.length];
}

function Dashboard() {
  const { p } = useProgress();
  const needed = xpForLevel(p.level);
  const soFar = p.xp - Array.from({ length: p.level - 1 }, (_, i) => xpForLevel(i + 1)).reduce((a, b) => a + b, 0);
  const pct = Math.max(0, Math.min(100, Math.round((soFar / needed) * 100)));

  const nextLesson =
    p.completedDays.length === 0
      ? { day: 1, label: "Start Day 1 — the mindset shift" }
      : p.completedDays.length >= 30
        ? { day: 30, label: "You finished the roadmap. Time to teach." }
        : { day: p.completedDays.length + 1, label: `Continue Day ${p.completedDays.length + 1}` };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNav />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Dashboard</div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">
            {p.name ? `Welcome back, ${p.name}` : "Your sales coach"}
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Small daily reps beat huge sprints. Show up, hit today's mission, watch the streak grow.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Card title="Today's mission" accent>
            <p className="text-sm">{todayMission()}</p>
            <Link
              to="/lab"
              className="mt-4 inline-block rounded-md bg-gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:opacity-90"
            >
              Start practice
            </Link>
          </Card>
          <Card title="Streak">
            <div className="font-display text-5xl text-primary">🔥 {p.streakDays}</div>
            <p className="mt-2 text-xs text-muted-foreground">
              days in a row. Miss a day, streak resets.
            </p>
          </Card>
          <Card title="Level & XP">
            <div className="font-display text-4xl">
              Lv <span className="text-primary">{p.level}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full bg-gradient-primary" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {p.xp} XP total · {pct}% to Lv {p.level + 1}
            </p>
          </Card>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Card title="Skill scores">
            {(Object.entries(p.skills) as [keyof typeof p.skills, number][]).map(([k, v]) => (
              <div key={k} className="mt-3 first:mt-0">
                <div className="flex justify-between text-xs">
                  <span className="capitalize">{k}</span>
                  <span className="text-primary">{v}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary" style={{ width: `${v}%` }} />
                </div>
              </div>
            ))}
          </Card>
          <Card title="Next lesson">
            <div className="font-display text-2xl">Day {nextLesson.day}</div>
            <p className="mt-1 text-sm text-muted-foreground">{nextLesson.label}</p>
            <Link
              to="/roadmap"
              className="mt-4 inline-block rounded-md border border-primary/60 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/10"
            >
              Open roadmap
            </Link>
          </Card>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Card title="Badges">
            {p.badges.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No badges yet. Hit a 7-day streak or reach Level 5 to earn your first.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {p.badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    🏅 {b.replaceAll("_", " ")}
                  </span>
                ))}
              </div>
            )}
          </Card>
          <Card title="Quick actions">
            <div className="flex flex-wrap gap-2 text-xs">
              <QuickLink to="/lab" label="🎤 Practice a pitch" />
              <QuickLink to="/arcade" label="🎮 Play a game" />
              
              <QuickLink to="/profile" label="🎯 Set age & goal" />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

function Card({ title, children, accent }: { title: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        accent ? "border-primary/50 bg-card shadow-glow" : "border-border bg-card shadow-card"
      }`}
    >
      <div className="text-xs uppercase tracking-widest text-primary">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function QuickLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="rounded-md border border-border bg-background px-3 py-2 font-semibold hover:border-primary/60"
    >
      {label}
    </Link>
  );
}
