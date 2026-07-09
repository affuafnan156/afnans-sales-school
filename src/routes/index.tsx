import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, type FormEvent } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

const INSTRUCTOR_EMAIL = "afnan@salesacademy.com";
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
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2 font-display text-2xl">
          <span className="inline-block h-3 w-3 rounded-full bg-primary shadow-glow" />
          AFNAN <span className="text-primary">SALES</span>
        </a>
        <div className="hidden gap-8 text-sm md:flex">
          <a href="#tiers" className="text-muted-foreground hover:text-foreground">Learn</a>
          <a href="#faq" className="text-muted-foreground hover:text-foreground">FAQ</a>
          <a href="#ask" className="text-muted-foreground hover:text-foreground">Ask AI</a>
          <a href="#invest" className="text-muted-foreground hover:text-foreground">Invest</a>
          <a href="#join" className="text-muted-foreground hover:text-foreground">Contact</a>
        </div>
        <a href="#tiers" className="rounded-md bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90">
          Start Learning
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="bg-hero relative overflow-hidden">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
        <span className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs uppercase tracking-widest text-primary">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Halal Sales Training · By Muslims, For Muslims
        </span>
        <h1 className="font-display text-5xl leading-[0.95] md:text-7xl">
          HALAL <span className="text-gradient">SALES</span>.<br />
          BARAKAH <span className="text-gradient">BUSINESS</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          As-salamu alaykum. Learn ethical sales and business the halal way — with sidq, amanah, and zero riba. Free lessons, live coaching, and a global ummah of closers.
        </p>
      </div>
    </section>
  );
}

function Tiers() {
  return (
    <section id="tiers" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">Two Halal Paths</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Pick your path, insha'Allah</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Free */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Free</div>
          <div className="mt-2 font-display text-4xl">Starter</div>
          <div className="mt-1 text-sm text-muted-foreground">Halal sales fundamentals — $0 forever.</div>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Weekly halal sales newsletter",
              "Full YouTube library (Muslim-friendly examples)",
              "Halal cold email & DM script pack (PDF)",
              "Brothers & sisters Discord community",
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
              "Full course library (60+ hours, halal-only frameworks)",
              "Weekly live coaching with Afnan",
              "Private Muslim entrepreneurs mastermind",
              "1:1 pitch & call reviews",
              "Objection & closing script vault (riba-free offers)",
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
      q: "Is everything you teach halal?",
      a: "Yes. Every framework is built around sidq (truthfulness) and amanah (trust). We don't teach pressure tactics, deception, or how to sell haram products. If a technique compromises your deen, we don't teach it.",
    },
    {
      id: "non-muslim",
      q: "I'm not Muslim — can I still join?",
      a: "Of course. The academy is built for Muslims but everyone is welcome. The sales frameworks are universal; the values-first approach just happens to be rooted in Islamic ethics.",
    },
    {
      id: "free-cost",
      q: "Is the Free Starter plan really free?",
      a: "Yes, $0 forever. You get the weekly newsletter, YouTube lessons, a halal cold outreach script pack, and the community Discord.",
    },
    {
      id: "pro-includes",
      q: "What do I get with Pro Mentorship?",
      a: "The full course library, weekly live coaching with Afnan, a private Muslim entrepreneurs mastermind, 1:1 pitch reviews, and the complete script vault. $197/month or $1,497 one-time for lifetime access.",
    },
    {
      id: "riba",
      q: "Do you teach anything involving riba or haram industries?",
      a: "No. We explicitly avoid riba-based financing offers, gambling, alcohol, and other haram niches. If your product is halal, we'll help you sell it with excellence.",
    },
    {
      id: "who-teaches",
      q: "Who teaches the lessons and runs the calls?",
      a: "Afnan leads the live coaching and curriculum, supported by a team of Muslim coaches for outreach, closing, community, and operations.",
    },
    {
      id: "time-commitment",
      q: "How much time do I need each week?",
      a: "Free students learn at their own pace. Pro students get the most value from 3-5 hours per week — live calls, practice, and lesson time, arranged around salah.",
    },
    {
      id: "refund",
      q: "Is there a refund policy for Pro?",
      a: "Yes. If Pro isn't the right fit, contact us within 14 days for a full refund. No hard feelings.",
    },
    {
      id: "invest",
      q: "Can I invest in the academy?",
      a: "Yes. We're open to Muslim angels and strategic partners. Minimum ticket is $5,000 via a riba-free equity SAFE. Email invest@afnansales.com with your background and ticket size.",
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
    { role: "assistant", content: "As-salamu alaykum — I'm the Afnan Sales Academy assistant. Ask me anything about halal sales, our courses, or investing in the business." },
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
          <p className="mt-3 text-muted-foreground">Instant answers on halal sales, our programs, or how to invest.</p>
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
          Insha'Allah we're growing fast — thousands of Muslim students, expanding courses, and building the world's leading halal sales training platform.
          If you'd like to back the business, we welcome Muslim angels and strategic partners on a riba-free structure.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { label: "Min ticket", value: "$5,000" },
            { label: "Structure", value: "Equity SAFE (riba-free)" },
            { label: "Use of funds", value: "Content, engineering, ummah growth" },
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
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [tier, setTier] = useState<"free" | "pro">("free");
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const subject = encodeURIComponent(`New ${tier === "free" ? "Free" : "Pro"} signup: ${name || email}`);
    const body = encodeURIComponent(
      `Hi Afnan,\n\nNew signup for the ${tier === "free" ? "Starter (Free)" : "Pro Mentorship"} plan.\n\nName: ${name || "(not provided)"}\nEmail: ${email}\n\n— Sent from afnansales.com`,
    );
    window.location.href = `mailto:${INSTRUCTOR_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="join" className="bg-hero border-t border-border">
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">Contact Afnan</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Bismillah — let's begin</h2>
        <p className="mt-3 text-muted-foreground">Choose your plan and Afnan will personally send you the next steps.</p>

        {sent ? (
          <div className="mx-auto mt-8 rounded-xl border border-primary/40 bg-card p-8 shadow-glow">
            <div className="font-display text-2xl text-primary">You're in.</div>
            <p className="mt-2 text-sm text-muted-foreground">Your email client just opened — send the message and Afnan will reply within 24 hours.</p>
            <button onClick={() => setSent(false)} className="mt-6 text-xs uppercase tracking-widest text-primary hover:underline">
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-8 flex flex-col gap-3 rounded-xl border border-border bg-card p-6 text-left shadow-card">
            <div className="flex gap-2">
              {(["free", "pro"] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTier(t)}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm font-semibold transition ${
                    tier === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "free" ? "Free Starter" : "Pro Mentorship"}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              maxLength={100}
              className="rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              maxLength={255}
              className="rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="mt-2 rounded-md bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90"
            >
              Send to Afnan →
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
      © {new Date().getFullYear()} Afnan Sales Academy. Built for closers.
    </footer>
  );
}
