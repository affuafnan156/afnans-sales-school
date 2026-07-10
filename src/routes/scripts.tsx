import { createFileRoute } from "@tanstack/react-router";
import { AppNav, GatedNotice } from "@/components/AppNav";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/scripts")({
  head: () => ({
    meta: [
      { title: "Script Library — Afnan Sales Academy" },
      { name: "description", content: "Ready-made scripts for cold calls, cold emails, DMs, and objection handling." },
    ],
  }),
  component: Scripts,
});

type Item = { title: string; body: string; tier: "free" | "pro" };

const SCRIPTS: { section: string; items: Item[] }[] = [
  {
    section: "Cold email",
    items: [
      { tier: "free", title: "Question opener (3 lines)", body: "Subject: quick q about [topic]\n\nHey [Name],\n\nSaw [specific thing]. Curious — how are you currently handling [problem]?\n\nNo pitch, just checking.\n\n[You]" },
      { tier: "free", title: "The 'wrong person'", body: "Subject: wrong person?\n\nHey [Name] — is it right that you handle [X] at [company]? If not, could you point me to the right person?\n\nThanks either way." },
      { tier: "pro", title: "Enterprise multi-thread opener", body: "[PRO ONLY] Full 5-touch enterprise sequence with champion-building playbook and mutual action plan." },
    ],
  },
  {
    section: "LinkedIn / DM",
    items: [
      { tier: "free", title: "The name-drop DM", body: "Hey [Name] — really liked your post on [topic]. Quick question: [one specific question]. Would love to hear your take." },
      { tier: "pro", title: "Founder-to-founder cold DM", body: "[PRO ONLY] The 4-line DM that gets 40%+ reply rates from founders." },
    ],
  },
  {
    section: "Cold call",
    items: [
      { tier: "free", title: "The 15-second opener", body: "Hey [Name], this is [You] — I know I'm calling out of the blue. Do you have 15 seconds and I'll tell you why I called, then you can hang up if it's not useful?" },
      { tier: "pro", title: "Gatekeeper bypass", body: "[PRO ONLY] Honest, respectful ways to reach decision-makers without lying to gatekeepers." },
    ],
  },
  {
    section: "Objection handling",
    items: [
      { tier: "free", title: "'Too expensive'", body: "Totally fair. Just so I understand — is it the total number, or the way it's structured?" },
      { tier: "free", title: "'Send me info'", body: "Happy to. One quick question first so I only send what's actually useful for you: [question]." },
      { tier: "free", title: "'I need to think about it'", body: "Of course. What part isn't quite clear yet — the fit, the timing, or the price?" },
      { tier: "pro", title: "The 8 hardest B2B objections", body: "[PRO ONLY] Complete framework for procurement pushback, legal delays, and 'we already have a vendor'." },
    ],
  },
  {
    section: "Closing",
    items: [
      { tier: "free", title: "The soft assumptive close", body: "Based on what you told me, this fits. Want to move forward, or is there a reason not to?" },
      { tier: "pro", title: "Retainer & high-ticket close scripts", body: "[PRO ONLY] Deal terms language, payment splits, and pilot-to-full close transitions." },
    ],
  },
];

function Scripts() {
  const { p } = useProgress();
  const gated = p.unlockedTier === "none";
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNav />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Script Library</div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">📄 Ready-to-send scripts</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Copy, paste, personalize. Free students get openers & objection handling. Pro students get the full vault.
          </p>
        </div>
        {gated && (
          <div className="mb-6">
            <GatedNotice tier="free" />
          </div>
        )}
        <div className="space-y-8">
          {SCRIPTS.map((s) => (
            <section key={s.section}>
              <h2 className="font-display text-2xl">{s.section}</h2>
              <div className="mt-3 grid gap-3">
                {s.items.map((it) => {
                  const proLocked = it.tier === "pro" && p.unlockedTier !== "pro";
                  const infoLocked = gated;
                  return (
                    <div
                      key={it.title}
                      className={`rounded-xl border p-5 ${it.tier === "pro" ? "border-primary/40 bg-card shadow-glow" : "border-border bg-card"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-display text-lg">{it.title}</div>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${it.tier === "pro" ? "bg-gradient-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>
                          {it.tier.toUpperCase()}
                        </span>
                      </div>
                      <pre className="mt-3 whitespace-pre-wrap rounded-md border border-border bg-background p-4 text-sm">
{infoLocked ? "🔒 Enroll (free) to unlock this script." : proLocked ? "🔒 Pro-only script. Enroll in Pro to unlock." : it.body}
                      </pre>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
