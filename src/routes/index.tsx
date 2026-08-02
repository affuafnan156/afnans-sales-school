import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { useI18n, REGIONS, LANGUAGES, type RegionCode, type LangCode } from "@/lib/i18n";
import { AppNav } from "@/components/AppNav";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/")({
  component: Index,
});

const ACADEMY_EMAIL = "affuafnan156@gmail.com";
const INVEST_EMAIL = "invest@sellforge.com";
const DISCORD_URL = "https://discord.gg/fsfPArVRg";

type Msg = { role: "user" | "assistant"; content: string };

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNav />
      <RegionBar />
      <Hero />
      <Tiers />
      <FAQ />
      <Team />
      <ChatSection />
      <Invest />
      <Enroll />
      <Footer />
    </div>
  );
}

function RegionBar() {
  const { t, region, setRegion, lang, setLang } = useI18n();
  return (
    <div className="border-b border-border/60 bg-card/40">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-2 px-6 py-2">
        <select
          aria-label={t.regionLabel}
          value={region.code}
          onChange={(e) => setRegion(e.target.value as RegionCode)}
          className="rounded-md border border-border bg-background px-2 py-1 text-xs outline-none focus:border-primary"
        >
          {REGIONS.map((r) => <option key={r.code} value={r.code}>{r.flag} {r.label}</option>)}
        </select>
        <select
          aria-label={t.languageLabel}
          value={lang}
          onChange={(e) => setLang(e.target.value as LangCode)}
          className="rounded-md border border-border bg-background px-2 py-1 text-xs outline-none focus:border-primary"
        >
          {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
      </div>
    </div>
  );
}

function Hero() {
  const { t, region } = useI18n();
  return (
    <section id="top" className="bg-hero relative overflow-hidden">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
        <span className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs uppercase tracking-widest text-primary">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          {region.flag} {t.heroPill}
        </span>
        <h1 className="font-display text-5xl leading-[0.95] md:text-7xl">
          {t.heroTitleA} <span className="text-gradient">{t.heroTitleB}</span>.<br />
          {t.heroTitleC} <span className="text-gradient">{t.heroTitleD}</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">{t.heroSub}</p>
        <p className="mx-auto mt-4 max-w-xl text-sm text-primary">
          {t.assignedTo}: {region.instructorName} ({region.flag} {region.label})
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#join" className="rounded-md bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90">
            Enroll & unlock
          </a>
          <a href="/arcade" className="rounded-md border border-primary/60 px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/10">
            🎮 Try the game first
          </a>
          <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold hover:border-primary/60">
            💬 Join Discord
          </a>
        </div>
      </div>
    </section>
  );
}

function Tiers() {
  return (
    <section id="tiers" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">Two Paths</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Pick your path</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Ethical sales training — rooted in Islamic values, open to everyone.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Free</div>
          <div className="mt-2 font-display text-4xl">Starter</div>
          <div className="mt-1 text-sm text-muted-foreground">Ethical sales fundamentals — $0 forever.</div>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Weekly sales newsletter",
              "YouTube library (basics)",
              "Cold email & DM opener pack",
              "Full arcade access (all games)",
              "Discord community",
              "Roadmap Days 1–14",
              "AI Sales Lab (limited)",
            ].map((f) => (
              <li key={f} className="flex gap-3">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                {f}
              </li>
            ))}
          </ul>
          <a href="#join" className="mt-8 inline-block w-full rounded-md border border-border bg-background px-6 py-3 text-center text-sm font-semibold hover:border-primary/60">
            Get Free Access
          </a>
        </div>

        <div className="relative rounded-2xl border border-primary/50 bg-card p-8 shadow-glow">
          <div className="absolute right-6 top-6 rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Most Popular
          </div>
          <div className="text-xs uppercase tracking-widest text-primary">Pro</div>
          <div className="mt-2 font-display text-4xl">Pro Mentorship</div>
          <div className="mt-1 text-sm text-muted-foreground">
            <span className="text-2xl font-semibold text-foreground">$10</span>/mo — everything unlocked
          </div>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Everything in Starter",
              "Full 30-day roadmap + advanced Day 29 vault",
              "Full script vault (enterprise, gatekeeper, close scripts)",
              "Unlimited AI Sales Lab practice + coach feedback",
              "Weekly live coaching with Afnan",
              "Private founders mastermind (Discord)",
              "1:1 pitch & call reviews",
              "Real sales call breakdowns (weekly)",
            ].map((f) => (
              <li key={f} className="flex gap-3">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />
                {f}
              </li>
            ))}
          </ul>
          <a href="#join" className="mt-8 inline-block w-full rounded-md bg-gradient-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground hover:opacity-90">
            Join Pro — $10/mo
          </a>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<string | null>(null);
  const questions = [
    { id: "cost", q: "How much is Pro?", a: "Just $10/month. Cancel anytime. That unlocks everything: full roadmap, script vault, unlimited AI Sales Lab, weekly live coaching, and pitch reviews." },
    { id: "game", q: "Can I use the site without paying?", a: "Yes. The arcade and Sales Lab basics are open to everyone — no email needed. But to unlock lessons, scripts, videos, and the roadmap you'll need to enroll (Free is fine — just send your details)." },
    { id: "non-muslim", q: "I'm not Muslim — can I still join?", a: "Absolutely. Everyone is welcome. The values (honesty, trust, no manipulation) are universal — the Islamic ethics angle just names where our principles come from." },
    { id: "how", q: "How do I unlock the full library?", a: "Fill in the enroll form at the bottom of this page. Once we get your details you get an instant unlock badge and the content opens up." },
    { id: "discord", q: "Is there a community?", a: `Yes — our Discord: ${DISCORD_URL}. Both Free and Pro students get in.` },
    { id: "refund", q: "Is there a refund policy for Pro?", a: "Yes. If Pro isn't the right fit, contact us within 14 days for a full refund." },
    { id: "invest", q: "Can I invest?", a: "Yes. Email invest@sellforge.com with name, background, and ticket size. Interest-free (riba-free) structures available." },
  ];
  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">Support</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Questions & answers</h2>
      </div>
      <div className="space-y-3">
        {questions.map(({ id, q, a }) => {
          const isOpen = open === id;
          return (
            <div key={id} className={`rounded-xl border transition ${isOpen ? "border-primary/50 bg-card shadow-glow" : "border-border bg-card hover:border-primary/60"}`}>
              <button onClick={() => setOpen(isOpen ? null : id)} className="flex w-full items-center justify-between px-5 py-4 text-left">
                <span className="font-display text-lg">{q}</span>
                <span className={`ml-4 text-primary transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
              </button>
              {isOpen && <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{a}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ChatSection() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi — I'm the Kai – Your Personal AI Assistant. Ask me anything about sales, our programs, or how to unlock the full course." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) {
        const errText = await res.text();
        setMessages((m) => [...m, { role: "assistant", content: `⚠️ ${errText || "Something went wrong."}` }]);
      } else {
        const data = (await res.json()) as { reply: string };
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "⚠️ Network error. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ask" className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-6 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Ask Anything</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Talk to the Academy AI</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div ref={scrollRef} className="max-h-[380px] min-h-[240px] space-y-4 overflow-y-auto p-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-gradient-primary text-primary-foreground" : "border border-border bg-background text-foreground"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <p className="text-xs text-muted-foreground">…thinking</p>}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-border bg-background p-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question…" maxLength={500} className="flex-1 rounded-md border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary" />
            <button type="submit" disabled={loading || !input.trim()} className="rounded-md bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-40">Send</button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Invest() {
  return (
    <section id="invest" className="mx-auto max-w-5xl px-6 py-16">
      <div className="rounded-2xl border border-primary/40 bg-card p-10 shadow-card">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">Investors</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Invest in the academy</h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Interest-free (riba-free) structures available. Minimum $5,000.
        </p>
        <a href={`mailto:${INVEST_EMAIL}?subject=${encodeURIComponent("Investment interest")}`} className="mt-6 inline-block rounded-md bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90">
          Email {INVEST_EMAIL}
        </a>
      </div>
    </section>
  );
}

function Enroll() {
  const { t, region } = useI18n();
  const { update } = useProgress();
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    experience: "beginner",
    challenge: "",
    goal: "",
    tier: "free" as "free" | "pro",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email || loading) return;
    setLoading(true);
    setError(null);
    try {
      const message = [
        `Age: ${form.age || "—"}`,
        `Experience: ${form.experience}`,
        `Biggest challenge: ${form.challenge || "—"}`,
        `Goal: ${form.goal || "—"}`,
      ].join("\n");
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "enroll",
          name: form.name,
          email: form.email,
          tier: form.tier === "free" ? "Starter (Free)" : "Pro Mentorship ($10/mo)",
          region: `${region.flag} ${region.label}`,
          instructor: region.instructorName,
          message,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Something went wrong." }));
        setError(data.error || "Something went wrong.");
      } else {
        update({
          email: form.email,
          name: form.name || null,
          pendingEnrollment: true,
        });
        setSent(true);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="join" className="bg-hero border-t border-border">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">{t.joinEyebrow}</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">{t.joinTitle}</h2>
          <p className="mt-3 text-muted-foreground text-sm">
            Send your details and Afnan will review your request. Once confirmed, your tier
            unlocks automatically the next time you open this site (usually within a few minutes).
          </p>
        </div>

        {sent ? (
          <div className="mt-8 rounded-xl border border-primary/50 bg-card p-8 text-center shadow-glow">
            <div className="font-display text-3xl text-primary">📩 Details received.</div>
            <p className="mt-3 text-sm text-muted-foreground">
              Your submission is now waiting for Afnan to confirm. You'll get an email at{" "}
              <strong className="text-foreground">{form.email}</strong> the moment your{" "}
              {form.tier === "pro" ? "Pro" : "Free"} tier is unlocked — and this site will
              auto-unlock too if you leave it open.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <a href="/dashboard" className="rounded-md bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow">Go to dashboard</a>
              <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="rounded-md border border-border bg-background px-5 py-2 text-sm font-semibold">💬 Join Discord</a>
              <button onClick={() => setSent(false)} className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">Send another</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 flex flex-col gap-3 rounded-xl border border-border bg-card p-6 text-left shadow-card">
            <div className="flex gap-2">
              {(["free", "pro"] as const).map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => set("tier", v)}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm font-semibold transition ${form.tier === v ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}
                >
                  {v === "free" ? "Free — $0" : "Pro — $10/mo"}
                </button>
              ))}
            </div>
            <Field label="Name">
              <input value={form.name} onChange={(e) => set("name", e.target.value)} maxLength={100} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            </Field>
            <Field label="Email *">
              <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} maxLength={255} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Age (optional)">
                <input inputMode="numeric" value={form.age} onChange={(e) => set("age", e.target.value.replace(/[^\d]/g, "").slice(0, 3))} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
              </Field>
              <Field label="Sales experience">
                <select value={form.experience} onChange={(e) => set("experience", e.target.value)} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary">
                  <option value="none">None — total beginner</option>
                  <option value="beginner">Beginner — some exposure</option>
                  <option value="intermediate">Intermediate — 1-3 years</option>
                  <option value="advanced">Advanced — 3+ years</option>
                </select>
              </Field>
            </div>
            <Field label="Your biggest challenge right now">
              <textarea value={form.challenge} onChange={(e) => set("challenge", e.target.value.slice(0, 500))} rows={2} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" placeholder="e.g. I can't get anyone to reply to my cold emails…" />
            </Field>
            <Field label="Your goal">
              <textarea value={form.goal} onChange={(e) => set("goal", e.target.value.slice(0, 500))} rows={2} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" placeholder="e.g. Close my first 3 clients in the next 60 days" />
            </Field>

            {error && (
              <div className="rounded-md border border-destructive/60 bg-destructive/10 p-3 text-sm text-destructive-foreground">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-md bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Sending…" : `Send my details → unlock ${form.tier === "pro" ? "Pro" : "Free"}`}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              We never share your info. Reply anytime with questions.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Team() {
  const people = [
    { name: "Afnan", role: "Founder & Lead Instructor", bio: "Leads weekly coaching and the core curriculum.", initials: "AF" },
    { name: "Sara Malik", role: "Head Coach — Outreach", bio: "Runs the outbound track: cold email, LinkedIn, DMs.", initials: "SM" },
    { name: "Bilal Hassan", role: "Closing Coach", bio: "Reviews call recordings, teaches objection handling.", initials: "BH" },
    { name: "Aisha Siddiqui", role: "Community Lead", bio: "Runs Discord and student support.", initials: "AS" },
    { name: "Omar Farooq", role: "Operations", bio: "Onboarding, billing, partnerships.", initials: "OF" },
    { name: "Zoya Ahmed", role: "Curriculum", bio: "Produces videos, script vault, and the newsletter.", initials: "ZA" },
  ];
  return (
    <section id="team" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">The Team</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">A team that shows up</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p) => (
          <div key={p.name} className="rounded-2xl border border-border bg-card p-6 shadow-card hover:border-primary/60">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary font-display text-xl text-primary-foreground shadow-glow">{p.initials}</div>
              <div>
                <div className="font-display text-xl">{p.name}</div>
                <div className="text-xs uppercase tracking-widest text-primary">{p.role}</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{p.bio}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
      <div>© {new Date().getFullYear()} SellForge · Ethical sales, open to everyone.</div>
      <div className="mt-2 space-x-3">
        <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="hover:text-primary">Discord</a>
        <a href={`mailto:${ACADEMY_EMAIL}`} className="hover:text-primary">Contact</a>
        <a href="/arcade" className="hover:text-primary">Arcade</a>
        <a href="/dashboard" className="hover:text-primary">Dashboard</a>
      </div>
    </footer>
  );
}
