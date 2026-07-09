import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { useI18n, REGIONS, LANGUAGES, type RegionCode, type LangCode } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Index,
});

const INVEST_EMAIL = "invest@afnansales.com";

type Msg = { role: "user" | "assistant"; content: string };

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
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

function Nav() {
  const { t, region, setRegion, lang, setLang } = useI18n();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <a href="#top" className="flex items-center gap-2 font-display text-2xl">
          <span className="inline-block h-3 w-3 rounded-full bg-primary shadow-glow" />
          AFNAN <span className="text-primary">SALES</span>
        </a>
        <div className="hidden gap-8 text-sm md:flex">
          <a href="#tiers" className="text-muted-foreground hover:text-foreground">{t.navLearn}</a>
          <a href="#faq" className="text-muted-foreground hover:text-foreground">{t.navFaq}</a>
          <a href="#ask" className="text-muted-foreground hover:text-foreground">{t.navAsk}</a>
          <a href="#invest" className="text-muted-foreground hover:text-foreground">{t.navInvest}</a>
          <a href="#join" className="text-muted-foreground hover:text-foreground">{t.navContact}</a>
        </div>
        <div className="flex items-center gap-2">
          <select
            aria-label={t.regionLabel}
            value={region.code}
            onChange={(e) => setRegion(e.target.value as RegionCode)}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-primary"
          >
            {REGIONS.map((r) => (
              <option key={r.code} value={r.code}>{r.flag} {r.label}</option>
            ))}
          </select>
          <select
            aria-label={t.languageLabel}
            value={lang}
            onChange={(e) => setLang(e.target.value as LangCode)}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-primary"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
          <a href="#tiers" className="hidden rounded-md bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90 sm:inline-block">
            {t.ctaStart}
          </a>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  const { t, region } = useI18n();
  return (
    <section id="top" className="bg-hero relative overflow-hidden">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
        <span className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs uppercase tracking-widest text-primary">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          {region.flag} {t.heroPill}
        </span>
        <h1 className="font-display text-5xl leading-[0.95] md:text-7xl">
          {t.heroTitleA} <span className="text-gradient">{t.heroTitleB}</span>.<br />
          {t.heroTitleC} <span className="text-gradient">{t.heroTitleD}</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          {t.heroSub}
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm text-primary">
          {t.assignedTo}: {region.instructorName} ({region.flag} {region.label})
        </p>
      </div>
    </section>
  );
}

function Tiers() {
  return (
    <section id="tiers" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">Two Paths</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Pick your path</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Ethical sales training — rooted in Islamic values, open to everyone.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Free */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Free</div>
          <div className="mt-2 font-display text-4xl">Starter</div>
          <div className="mt-1 text-sm text-muted-foreground">Ethical sales fundamentals — $0 forever.</div>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Weekly sales newsletter",
              "Full YouTube library",
              "Cold email & DM script pack (PDF)",
              "Global Discord community",
              "Live monthly Q&A with Afnan",
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

        {/* Paid */}
        <div className="relative rounded-2xl border border-primary/50 bg-card p-8 shadow-glow">
          <div className="absolute right-6 top-6 rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Most Popular
          </div>
          <div className="text-xs uppercase tracking-widest text-primary">Paid</div>
          <div className="mt-2 font-display text-4xl">Pro Mentorship</div>
          <div className="mt-1 text-sm text-muted-foreground">
            <span className="text-2xl font-semibold text-foreground">$197</span>/mo · or $1,497 lifetime
          </div>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Everything in Starter",
              "Full course library (60+ hours)",
              "Weekly live coaching with Afnan",
              "Private founders mastermind",
              "1:1 pitch & call reviews",
              "Objection & closing script vault",
            ].map((f) => (
              <li key={f} className="flex gap-3">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />
                {f}
              </li>
            ))}
          </ul>
          <a href="#join" className="mt-8 inline-block w-full rounded-md bg-gradient-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground hover:opacity-90">
            Join Pro
          </a>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<string | null>(null);

  const questions = [
    {
      id: "halal",
      q: "Is your teaching ethical and values-based?",
      a: "Yes. Every framework is built around truthfulness (sidq) and trust (amanah). We don't teach pressure tactics or deception. The values come from Islamic ethics, but they're universal principles any professional can stand behind.",
    },
    {
      id: "non-muslim",
      q: "I'm not Muslim — can I still join?",
      a: "Absolutely. Everyone is welcome. The sales frameworks are universal — the values-first approach just happens to be inspired by Islamic business ethics. You'll get the same coaching, community, and support as every other student.",
    },
    {
      id: "free-cost",
      q: "Is the Free Starter plan really free?",
      a: "Yes, $0 forever. You get the weekly newsletter, YouTube lessons, a cold outreach script pack, and the community Discord.",
    },
    {
      id: "pro-includes",
      q: "What do I get with Pro Mentorship?",
      a: "The full course library, weekly live coaching with Afnan, a private founders mastermind, 1:1 pitch reviews, and the complete script vault. $197/month or $1,497 one-time for lifetime access.",
    },
    {
      id: "riba",
      q: "Are there industries or tactics you won't teach?",
      a: "Yes — we skip interest-based (riba) financing, gambling, alcohol, and other tactics that clash with our values. If your product is ethical, we'll help you sell it with excellence, whatever your background.",
    },
    {
      id: "who-teaches",
      q: "Who teaches the lessons and runs the calls?",
      a: "Afnan leads the live coaching and curriculum, supported by a full team of coaches for outreach, closing, community, and operations.",
    },
    {
      id: "time-commitment",
      q: "How much time do I need each week?",
      a: "Free students learn at their own pace. Pro students get the most value from 3-5 hours per week — live calls, practice, and lesson time.",
    },
    {
      id: "refund",
      q: "Is there a refund policy for Pro?",
      a: "Yes. If Pro isn't the right fit, contact us within 14 days for a full refund. No hard feelings.",
    },
    {
      id: "invest",
      q: "Can I invest in the academy?",
      a: "Yes. We're open to angels and strategic partners. Minimum ticket is $5,000 via an equity SAFE (interest-free structure available for those who prefer it). Email invest@afnansales.com with your background and ticket size.",
    },
  ];

  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-20">
      <div className="mb-10 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">Support</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Questions & answers</h2>
        <p className="mt-3 text-muted-foreground">Everything you need to know about learning with us.</p>
      </div>
      <div className="space-y-3">
        {questions.map(({ id, q, a }) => {
          const isOpen = open === id;
          return (
            <div
              key={id}
              className={`rounded-xl border transition ${isOpen ? "border-primary/50 bg-card shadow-glow" : "border-border bg-card hover:border-primary/60"}`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-display text-lg">{q}</span>
                <span className={`ml-4 text-primary transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                  {a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ChatSection() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi — I'm the Afnan Sales Academy assistant. Ask me anything about sales, our courses, or investing in the business. (As-salamu alaykum if you're Muslim — everyone's welcome here.)" },
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
      <div className="mx-auto max-w-3xl px-6 py-20">
        <div className="mb-8 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Ask Anything</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Talk to the Academy AI</h2>
          <p className="mt-3 text-muted-foreground">Instant answers on sales, our programs, or how to invest.</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div ref={scrollRef} className="max-h-[420px] min-h-[300px] space-y-4 overflow-y-auto p-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${
                    m.role === "user"
                      ? "bg-gradient-primary text-primary-foreground"
                      : "border border-border bg-background text-foreground"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                  </span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={send} className="flex gap-2 border-t border-border bg-background p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about sales, the course, or investing…"
              maxLength={500}
              className="flex-1 rounded-md border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-md bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-90 disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Invest() {
  return (
    <section id="invest" className="mx-auto max-w-5xl px-6 py-20">
      <div className="rounded-2xl border border-primary/40 bg-card p-10 shadow-card md:p-14">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">Investors</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Invest in Afnan Sales Academy</h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          We're growing fast — thousands of students worldwide, expanding courses, and building a leading ethical sales training platform.
          If you'd like to back the business, we welcome angels and strategic partners. Interest-free (riba-free) structures are available for investors who prefer them.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { label: "Min ticket", value: "$5,000" },
            { label: "Structure", value: "Equity SAFE (riba-free option available)" },
            { label: "Use of funds", value: "Content, engineering, global community" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-background p-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
              <div className="mt-2 font-display text-2xl">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`mailto:${INVEST_EMAIL}?subject=${encodeURIComponent("Investment interest — Afnan Sales Academy")}&body=${encodeURIComponent("Hi Afnan,\n\nI'd like to explore investing in the academy.\n\nName:\nBackground:\nTicket size:\n\nThanks,")}`}
            className="rounded-md bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90"
          >
            Email {INVEST_EMAIL}
          </a>
          <a href="#ask" className="rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold hover:border-primary/60">
            Ask the AI first
          </a>
        </div>
      </div>
    </section>
  );
}

function Enroll() {
  const { t, region } = useI18n();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [tier, setTier] = useState<"free" | "pro">("free");
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const subject = encodeURIComponent(`New ${tier === "free" ? "Free" : "Pro"} signup (${region.code}): ${name || email}`);
    const body = encodeURIComponent(
      `As-salamu alaykum ${region.instructorName},\n\nNew signup for the ${tier === "free" ? "Starter (Free)" : "Pro Mentorship"} plan.\n\nRegion: ${region.label}\nName: ${name || "(not provided)"}\nEmail: ${email}\n\n— Sent from afnansales.com`,
    );
    window.location.href = `mailto:${region.instructorEmail}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="join" className="bg-hero border-t border-border">
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">{t.joinEyebrow}</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">{t.joinTitle}</h2>
        <p className="mt-3 text-muted-foreground">{t.joinSub}</p>
        <p className="mt-2 text-sm text-primary">
          {t.assignedTo}: <strong>{region.instructorName}</strong> · {region.flag} {region.label} · {region.instructorEmail}
        </p>

        {sent ? (
          <div className="mx-auto mt-8 rounded-xl border border-primary/40 bg-card p-8 shadow-glow">
            <div className="font-display text-2xl text-primary">{t.joinSent}</div>
            <p className="mt-2 text-sm text-muted-foreground">{t.joinSentSub}</p>
            <button onClick={() => setSent(false)} className="mt-6 text-xs uppercase tracking-widest text-primary hover:underline">
              {t.joinAgain}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-8 flex flex-col gap-3 rounded-xl border border-border bg-card p-6 text-left shadow-card">
            <div className="flex gap-2">
              {(["free", "pro"] as const).map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setTier(v)}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm font-semibold transition ${
                    tier === v
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {v === "free" ? t.joinTabFree : t.joinTabPro}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.joinName}
              maxLength={100}
              className="rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.joinEmail}
              maxLength={255}
              className="rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="mt-2 rounded-md bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90"
            >
              {t.joinSend}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Team() {
  const people = [
    {
      name: "Afnan",
      role: "Founder & Lead Instructor",
      bio: "8+ years closing high-ticket B2B. Leads weekly coaching and the halal sales curriculum.",
      initials: "AF",
    },
    {
      name: "Ustadh Yusuf Rahman",
      role: "Islamic Ethics Advisor",
      bio: "Reviews every framework and script to make sure our teaching stays within the bounds of the Shariah.",
      initials: "YR",
    },
    {
      name: "Sara Malik",
      role: "Head Coach — Halal Cold Outreach",
      bio: "Ex-SDR leader. Runs the outbound track: honest cold email, LinkedIn, and DM frameworks.",
      initials: "SM",
    },
    {
      name: "Bilal Hassan",
      role: "Closing Coach",
      bio: "Reviews student call recordings and teaches the objection-handling scripts — no pressure tactics, ever.",
      initials: "BH",
    },
    {
      name: "Aisha Siddiqui",
      role: "Sisters Community Lead",
      bio: "Runs the sisters-only track and Discord channels so every sister gets tailored support.",
      initials: "AS",
    },
    {
      name: "Omar Farooq",
      role: "Business & Operations",
      bio: "Handles onboarding, billing (riba-free), and partnerships so the coaches can focus on teaching.",
      initials: "OF",
    },
    {
      name: "Zoya Ahmed",
      role: "Content & Curriculum",
      bio: "Produces the video lessons, script vault updates, and the free newsletter.",
      initials: "ZA",
    },
  ];

  return (
    <section id="team" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">The Team</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">A team of Muslims teaching Muslims</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Afnan leads, but a full team of coaches, a Shariah advisor, and operators helps every student get answers, feedback, and support.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p) => (
          <div
            key={p.name}
            className="group rounded-2xl border border-border bg-card p-6 shadow-card transition hover:border-primary/60 hover:shadow-glow"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary font-display text-xl text-primary-foreground shadow-glow">
                {p.initials}
              </div>
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
    <footer className="border-t border-border py-10 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Afnan Sales Academy. Halal sales, built for the ummah.
    </footer>
  );
}
