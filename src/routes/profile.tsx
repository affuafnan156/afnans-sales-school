import { createFileRoute } from "@tanstack/react-router";
import { AppNav } from "@/components/AppNav";
import { useProgress, type AgeGroup, type Goal } from "@/lib/progress";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — SellForge" },
      { name: "description", content: "Pick your age group and goal so we can tailor the game and lessons to you." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Profile,
});

const AGES: { code: AgeGroup; label: string }[] = [
  { code: "under18", label: "Under 18" },
  { code: "18-24", label: "18 – 24" },
  { code: "25-34", label: "25 – 34" },
  { code: "35-49", label: "35 – 49" },
  { code: "50+", label: "50+" },
];

const GOALS: { code: Goal; label: string; blurb: string }[] = [
  { code: "learn_basics", label: "Learn the basics", blurb: "You're new. We'll start with mindset & the 3 pillars." },
  { code: "get_first_sales_job", label: "Get my first sales job", blurb: "Focus: cold outreach, discovery, interview prep." },
  { code: "close_more_deals", label: "Close more deals", blurb: "Focus: objections, closing, follow-up rhythm." },
  { code: "start_a_business", label: "Start a business", blurb: "Focus: customer discovery, pricing, pitch." },
  { code: "grow_my_business", label: "Grow my business", blurb: "Focus: pipeline, retention, referrals." },
  { code: "career_switch", label: "Switch to sales from another career", blurb: "Focus: mindset shift + transferable skills." },
];

function Profile() {
  const { p, update } = useProgress();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNav />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Profile</div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">🎯 Set up your journey</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Pick your age group and goal. The game and coach adapt.
          </p>
        </div>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="text-xs uppercase tracking-widest text-primary">Your name</div>
          <input
            value={p.name ?? ""}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="What should we call you?"
            className="mt-2 w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="text-xs uppercase tracking-widest text-primary">Age group</div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {AGES.map((a) => (
              <button
                key={a.code}
                onClick={() => update({ ageGroup: a.code })}
                className={`rounded-md border px-3 py-2 text-sm ${p.ageGroup === a.code ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:border-primary/60"}`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="text-xs uppercase tracking-widest text-primary">Your goal</div>
          <div className="mt-3 grid gap-3">
            {GOALS.map((g) => (
              <button
                key={g.code}
                onClick={() => update({ goal: g.code })}
                className={`rounded-xl border p-4 text-left ${p.goal === g.code ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-background hover:border-primary/60"}`}
              >
                <div className="font-display text-lg">{g.label}</div>
                <div className="text-xs text-muted-foreground">{g.blurb}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="text-xs uppercase tracking-widest text-primary">Your enrollment status</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Current: <strong className="text-foreground">{p.unlockedTier === "none" ? "Guest (game only)" : p.unlockedTier === "free" ? "Free (Starter unlocked)" : "Pro (everything unlocked)"}</strong>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Head to the home page enroll form to send your details and unlock lessons, videos and scripts.
          </p>
        </section>
      </main>
    </div>
  );
}
