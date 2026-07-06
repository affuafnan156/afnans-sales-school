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
          Free & Paid Programs
        </span>
        <h1 className="font-display text-5xl leading-[0.95] md:text-7xl">
          LEARN <span className="text-gradient">SALES</span>.<br />
          BUILD <span className="text-gradient">BUSINESS</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Practical sales training by Afnan. Start free, upgrade when you're ready, or invest in the growth of the academy.
        </p>
      </div>
    </section>
  );
}

function Tiers() {
  return (
    <section id="tiers" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-primary">Two Ways to Learn</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Pick your path</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Free */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Free</div>
          <div className="mt-2 font-display text-4xl">Starter</div>
          <div className="mt-1 text-sm text-muted-foreground">Everything you need to begin — $0 forever.</div>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Weekly sales newsletter",
              "Full YouTube video library",
              "Cold email & DM script pack (PDF)",
              "Access to the public Discord community",
              "Live monthly Q&A stream",
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
              "Private mastermind community",
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

function ChatSection() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hey — I'm the Afnan Sales Academy assistant. Ask me anything about sales, the courses, or investing in the business." },
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
          <p className="mt-3 text-muted-foreground">Get instant answers about sales, our programs, or how to invest.</p>
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
          We're growing fast — thousands of students, expanding courses, and building a full sales-training platform.
          If you'd like to back the business, we're open to angel checks and strategic partners.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { label: "Min ticket", value: "$5,000" },
            { label: "Round", value: "SAFE (post-money)" },
            { label: "Use of funds", value: "Content, engineering, growth" },
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
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Get started today</h2>
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

function Footer() {
  return (
    <footer className="border-t border-border py-10 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Afnan Sales Academy. Built for closers.
    </footer>
  );
}
