import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import afnanImg from "@/assets/afnan.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const INSTRUCTOR_EMAIL = "afnan@salesacademy.com";

function Index() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const subject = encodeURIComponent(`New student signup: ${name || email}`);
    const body = encodeURIComponent(
      `Hi Afnan,\n\nA new student wants to join the sales program.\n\nName: ${name || "(not provided)"}\nEmail: ${email}\n\n— Sent from afnansales.com`,
    );
    window.location.href = `mailto:${INSTRUCTOR_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2 font-display text-2xl">
            <span className="inline-block h-3 w-3 rounded-full bg-primary shadow-glow" />
            AFNAN <span className="text-primary">SALES</span>
          </a>
          <div className="hidden gap-8 text-sm md:flex">
            <a href="#curriculum" className="text-muted-foreground hover:text-foreground">Curriculum</a>
            <a href="#instructor" className="text-muted-foreground hover:text-foreground">Instructor</a>
            <a href="#results" className="text-muted-foreground hover:text-foreground">Results</a>
            <a href="#join" className="text-muted-foreground hover:text-foreground">Enroll</a>
          </div>
          <a
            href="#join"
            className="rounded-md bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
          >
            Get Started
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section id="top" className="bg-hero relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,oklch(0.98_0.01_20/0.15)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:py-32">
          <div className="flex flex-col justify-center">
            <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Enrollment Open
            </span>
            <h1 className="font-display text-5xl leading-[0.95] md:text-7xl">
              LEARN TO <span className="text-gradient">CLOSE</span>.
              <br />
              LEARN TO <span className="text-gradient">EARN</span>.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              A no-fluff sales and business mentorship led by <strong className="text-foreground">Afnan</strong>.
              Master high-ticket closing, cold outreach, and the psychology behind every deal that gets signed.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#join"
                className="rounded-md bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.02]"
              >
                Talk to Afnan →
              </a>
              <a
                href="#curriculum"
                className="rounded-md border border-border bg-card px-6 py-3 text-sm font-semibold hover:border-primary/60"
              >
                See the Curriculum
              </a>
            </div>
            <div className="mt-10 flex gap-8 text-sm text-muted-foreground">
              <div><div className="font-display text-3xl text-foreground">1,200+</div>Students trained</div>
              <div><div className="font-display text-3xl text-foreground">$40M+</div>Client revenue closed</div>
              <div><div className="font-display text-3xl text-foreground">4.9★</div>Avg rating</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-primary opacity-40 blur-3xl" />
            <div className="overflow-hidden rounded-2xl border border-border shadow-card">
              <img
                src={afnanImg}
                alt="Afnan, sales instructor"
                width={1024}
                height={1280}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 max-w-[220px] rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="text-xs uppercase tracking-widest text-primary">Your Instructor</div>
              <div className="mt-1 font-display text-xl">Afnan</div>
              <div className="text-xs text-muted-foreground">Founder · 8+ yrs closing high-ticket</div>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement banner for Afnan */}
      <section className="border-y border-primary/30 bg-gradient-primary">
        <div className="mx-auto max-w-6xl px-6 py-10 md:flex md:items-center md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary-foreground/80">Meet the Owner</div>
            <h2 className="mt-2 font-display text-3xl text-primary-foreground md:text-4xl">
              AFNAN — Sales Strategist, Business Builder, Mentor.
            </h2>
            <p className="mt-2 max-w-2xl text-primary-foreground/90">
              "I built this academy because I was tired of watching great people fail at selling great products.
              Give me 30 days — I'll change the way you talk to customers forever."
            </p>
          </div>
          <a
            href="#join"
            className="mt-6 inline-block rounded-md bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-card transition hover:opacity-90 md:mt-0"
          >
            Learn from Afnan →
          </a>
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">The Program</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">What You'll Master</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { n: "01", t: "Prospecting & Outreach", d: "Cold email, DMs, and calls that actually get replies. Scripts that don't sound like scripts." },
            { n: "02", t: "Discovery That Converts", d: "Ask the questions that make prospects sell themselves. The SPIN + pain-funnel method." },
            { n: "03", t: "Objection Handling", d: "Turn 'too expensive' and 'let me think' into signed contracts using the LAER framework." },
            { n: "04", t: "High-Ticket Closing", d: "The exact 7-step call structure Afnan uses to close $5k–$50k offers on the phone." },
            { n: "05", t: "Building a Sales Business", d: "Offers, pricing, positioning, and how to build a lean team that scales past $100k/mo." },
            { n: "06", t: "Mindset & Consistency", d: "The daily rituals of top 1% closers. Rejection resilience, energy, discipline." },
          ].map((m) => (
            <div
              key={m.n}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition hover:border-primary/60 hover:shadow-glow"
            >
              <div className="font-display text-5xl text-primary/40 transition group-hover:text-primary">{m.n}</div>
              <h3 className="mt-2 font-display text-xl">{m.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{m.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Instructor */}
      <section id="instructor" className="border-y border-border bg-card/40">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-border shadow-card">
              <img src={afnanImg} alt="Afnan portrait" loading="lazy" className="w-full object-cover" />
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-[0.3em] text-primary">Instructor</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Trained by Afnan.</h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Afnan is the founder of Afnan Sales Academy. Over 8 years, he's built and led sales floors
              closing eight figures across SaaS, coaching, and e-commerce. Now he teaches the exact
              playbook — no theory, no gurus, just what works on live calls.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {[
                "Personally mentored 1,200+ closers across 40+ countries",
                "Built sales teams for 7- and 8-figure businesses",
                "Weekly live coaching calls and script reviews",
                "Direct feedback on your recorded pitches",
              ].map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-1.5 inline-block h-2 w-2 rounded-full bg-primary shadow-glow" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="results" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Results</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Students Who Closed.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { q: "Went from $2k/mo to $18k/mo in 90 days. Afnan's discovery framework changed everything.", n: "Yusuf A.", r: "SaaS Closer" },
            { q: "I was terrified of the phone. Now I book 20 demos a week without flinching.", n: "Maya K.", r: "Coaching Setter" },
            { q: "Closed my first $25k deal in week 6. The objection scripts are pure gold.", n: "Daniel R.", r: "Agency Owner" },
          ].map((t) => (
            <div key={t.n} className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="mb-3 text-primary">★★★★★</div>
              <p className="text-sm text-muted-foreground">"{t.q}"</p>
              <div className="mt-6 border-t border-border pt-4 text-sm">
                <div className="font-semibold">{t.n}</div>
                <div className="text-xs text-muted-foreground">{t.r}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enroll / Email capture */}
      <section id="join" className="bg-hero border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Talk to Afnan</div>
          <h2 className="mt-3 font-display text-4xl md:text-6xl">
            Ready to <span className="text-gradient">close bigger deals?</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Drop your email and Afnan will personally reach out about your enrollment.
          </p>

          {sent ? (
            <div className="mx-auto mt-10 max-w-md rounded-xl border border-primary/40 bg-card p-8 shadow-glow">
              <div className="font-display text-2xl text-primary">You're in.</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Your email client just opened a message to Afnan. Send it and he'll respond within 24 hours.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-6 text-xs uppercase tracking-widest text-primary hover:underline"
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-10 flex max-w-xl flex-col gap-3 rounded-xl border border-border bg-card p-6 shadow-card"
            >
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
                className="mt-2 rounded-md bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.01]"
              >
                Send to Afnan →
              </button>
              <p className="mt-1 text-xs text-muted-foreground">
                We'll never spam you. Your info goes straight to the instructor.
              </p>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t border-border py-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Afnan Sales Academy. Built for closers.
      </footer>
    </div>
  );
}
