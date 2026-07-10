import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppNav } from "@/components/AppNav";
import { useProgress, XP_UNLOCKS } from "@/lib/progress";

export const Route = createFileRoute("/arcade")({
  head: () => ({
    meta: [
      { title: "Arcade — Sales Games" },
      { name: "description", content: "Sales Escape Room, Deal of the Day, Pitch Battle, Objection of the Week, Sales Myth Busters, and more." },
    ],
  }),
  component: Arcade,
});

const GAMES: { id: string; title: string; emoji: string; blurb: string }[] = [
  { id: "escape", title: "Sales Escape Room", emoji: "🗝️", blurb: "Solve 3 sales riddles to escape. Each right answer unlocks the next room." },
  { id: "dotd", title: "Deal of the Day", emoji: "📅", blurb: "A new scenario every day. Pick the best move." },
  { id: "pitch", title: "Pitch Battle", emoji: "🥊", blurb: "60 seconds to pitch. Get graded on 3 axes." },
  { id: "objection", title: "Objection of the Week", emoji: "🛡️", blurb: "One brutal customer objection. Type your best response." },
  { id: "myth", title: "Sales Myth Busters", emoji: "💥", blurb: "True or false? Learn what's actually true about selling." },
  { id: "reverse", title: "Reverse Selling", emoji: "🔄", blurb: "You're the buyer. Notice the pressure tactics the seller uses." },
  { id: "detective", title: "Sales Detective", emoji: "🔍", blurb: "A deal died. Figure out why from the clues." },
  { id: "confidence", title: "Confidence Meter", emoji: "📈", blurb: "Rate yourself before and after a practice rep." },
];

function Arcade() {
  const [active, setActive] = useState<string | null>(null);
  const { p } = useProgress();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNav />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Arcade</div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">🎮 Play to learn sales</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Games are free. Winning earns XP that unlocks more free info tiles below.
          </p>
        </div>

        {!active && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {GAMES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActive(g.id)}
                  className="rounded-2xl border border-border bg-card p-6 text-left transition hover:border-primary/60 hover:shadow-glow"
                >
                  <div className="text-3xl">{g.emoji}</div>
                  <div className="mt-2 font-display text-xl">{g.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{g.blurb}</p>
                  <div className="mt-3 text-xs uppercase tracking-widest text-primary">Play →</div>
                </button>
              ))}
            </div>

            <div className="mt-10">
              <h2 className="font-display text-3xl">🔓 Free info you've unlocked</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Earn XP by playing games and doing daily missions. Every threshold unlocks a free tip.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {XP_UNLOCKS.map((u) => {
                  const locked = p.xp < u.xp;
                  return (
                    <div
                      key={u.label}
                      className={`rounded-xl border p-4 ${locked ? "border-border bg-card/60 opacity-70" : "border-primary/50 bg-card shadow-glow"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-display text-lg">{u.label}</div>
                        <div className="text-xs text-primary">{u.xp} XP</div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {locked ? "🔒 Locked — earn more XP to unlock." : u.content}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Want the deep frameworks, videos, and script vault? Those live behind email enrollment (Free or Pro). Head to the enroll form on the home page.
              </p>
            </div>
          </>
        )}

        {active && (
          <div className="mt-2">
            <button
              onClick={() => setActive(null)}
              className="mb-4 text-xs text-muted-foreground hover:text-foreground"
            >
              ← Back to arcade
            </button>
            <GameHost id={active} />
          </div>
        )}
      </main>
    </div>
  );
}

function GameHost({ id }: { id: string }) {
  switch (id) {
    case "escape": return <EscapeRoom />;
    case "dotd": return <DealOfTheDay />;
    case "pitch": return <PitchBattle />;
    case "objection": return <ObjectionWeek />;
    case "myth": return <MythBusters />;
    case "reverse": return <ReverseSelling />;
    case "detective": return <Detective />;
    case "confidence": return <ConfidenceMeter />;
    default: return null;
  }
}

/* ---------- Games ---------- */

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-border bg-card p-6 shadow-card">{children}</div>;
}

function EscapeRoom() {
  const { addXp } = useProgress();
  const rooms = [
    {
      q: "The prospect says 'send me info' after a good call. What's your best move?",
      choices: [
        { t: "Send a huge PDF with everything.", ok: false },
        { t: "Say: 'Happy to — one question first so I only send what's useful.'", ok: true },
        { t: "Argue and try to close them now.", ok: false },
      ],
    },
    {
      q: "You quote the price. They go quiet for 6 seconds. Do you…",
      choices: [
        { t: "Panic-drop the price.", ok: false },
        { t: "Stay quiet. Let them think.", ok: true },
        { t: "Explain why the price is fair for another 90 seconds.", ok: false },
      ],
    },
    {
      q: "Customer: 'Your competitor is $200 cheaper.'",
      choices: [
        { t: "'We're better, trust me.'", ok: false },
        { t: "'Fair. What matters more to you — the price or the outcome?'", ok: true },
        { t: "Match the price on the spot.", ok: false },
      ],
    },
  ];
  const [room, setRoom] = useState(0);
  const [done, setDone] = useState(false);

  if (done) return <Card>🎉 You escaped! +50 XP</Card>;
  const r = rooms[room];
  return (
    <Card>
      <div className="text-xs uppercase tracking-widest text-primary">Room {room + 1} / 3</div>
      <div className="mt-2 font-display text-2xl">{r.q}</div>
      <div className="mt-4 space-y-2">
        {r.choices.map((c, i) => (
          <button
            key={i}
            onClick={() => {
              if (c.ok) {
                if (room + 1 >= rooms.length) {
                  setDone(true);
                  addXp(50, "Escape Room");
                } else setRoom(room + 1);
              } else {
                alert("Not quite — try again.");
              }
            }}
            className="block w-full rounded-md border border-border bg-background px-4 py-3 text-left text-sm hover:border-primary/60"
          >
            {c.t}
          </button>
        ))}
      </div>
    </Card>
  );
}

function DealOfTheDay() {
  const { addXp } = useProgress();
  const scenarios = [
    "A prospect ghosted you for 3 weeks. Write a one-line 'break-up' email.",
    "You have 60 seconds to explain your product to a stranger in an elevator. Write it.",
    "A hot lead says 'we already have a vendor'. Reply in 2 sentences.",
    "A friend asks 'why should I buy from you and not the cheaper option?' Answer honestly.",
    "You just closed a deal. Write the 24-hour thank-you message.",
  ];
  const day = new Date().getDate();
  const s = scenarios[day % scenarios.length];
  const [ans, setAns] = useState("");
  const [done, setDone] = useState(false);
  return (
    <Card>
      <div className="text-xs uppercase tracking-widest text-primary">Today's deal</div>
      <div className="mt-2 font-display text-2xl">{s}</div>
      <textarea
        value={ans}
        onChange={(e) => setAns(e.target.value)}
        rows={4}
        className="mt-4 w-full rounded-md border border-border bg-background p-3 text-sm outline-none focus:border-primary"
        placeholder="Type your reply…"
      />
      <button
        disabled={ans.length < 20 || done}
        onClick={() => { addXp(20, "Deal of the Day"); setDone(true); }}
        className="mt-3 rounded-md bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-40"
      >
        {done ? "Locked in ✓" : "Submit (+20 XP)"}
      </button>
    </Card>
  );
}

function PitchBattle() {
  const { addXp, bumpSkill } = useProgress();
  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(false);
  const [scores, setScores] = useState<{ clarity: number; confidence: number; ethics: number } | null>(null);

  const start = () => {
    setRunning(true);
    setScores(null);
    setSeconds(60);
    const iv = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(iv);
          setRunning(false);
          const r = { clarity: 60 + Math.floor(Math.random() * 40), confidence: 55 + Math.floor(Math.random() * 40), ethics: 70 + Math.floor(Math.random() * 30) };
          setScores(r);
          addXp(30, "Pitch Battle");
          bumpSkill("confidence", 2);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  return (
    <Card>
      <div className="text-xs uppercase tracking-widest text-primary">Pitch Battle</div>
      <div className="mt-2 font-display text-2xl">60 seconds. Pitch out loud. Go.</div>
      <div className="mt-6 text-center font-display text-7xl text-primary">{seconds}s</div>
      <div className="mt-4 flex justify-center">
        <button
          onClick={start}
          disabled={running}
          className="rounded-md bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-40"
        >
          {running ? "Pitching…" : "Start"}
        </button>
      </div>
      {scores && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3 text-center">
          {(["clarity", "confidence", "ethics"] as const).map((k) => (
            <div key={k} className="rounded-xl border border-primary/40 bg-background p-4">
              <div className="text-xs uppercase tracking-widest text-primary">{k}</div>
              <div className="mt-1 font-display text-3xl">{scores[k]}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function ObjectionWeek() {
  const { addXp } = useProgress();
  const week = Math.floor(Date.now() / (7 * 86400000));
  const objections = [
    "'Your price is way too high for what this is.'",
    "'I don't trust online courses — most are scams.'",
    "'I don't have the time to learn this right now.'",
    "'I already tried something like this and it didn't work.'",
    "'Let me talk to my partner and I'll get back to you.'",
  ];
  const o = objections[week % objections.length];
  const [ans, setAns] = useState("");
  const [done, setDone] = useState(false);
  return (
    <Card>
      <div className="text-xs uppercase tracking-widest text-primary">This week's objection</div>
      <div className="mt-2 font-display text-2xl">{o}</div>
      <textarea
        value={ans}
        onChange={(e) => setAns(e.target.value)}
        rows={4}
        className="mt-4 w-full rounded-md border border-border bg-background p-3 text-sm outline-none focus:border-primary"
        placeholder="Your honest response…"
      />
      <button
        disabled={ans.length < 30 || done}
        onClick={() => { addXp(25, "Objection of the Week"); setDone(true); }}
        className="mt-3 rounded-md bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-40"
      >
        {done ? "Submitted ✓" : "Submit (+25 XP)"}
      </button>
    </Card>
  );
}

function MythBusters() {
  const { addXp } = useProgress();
  const myths = [
    { q: "You have to be an extrovert to sell.", a: false, why: "The best sellers listen more than they talk. Introverts crush." },
    { q: "'ABC — Always Be Closing' is the golden rule.", a: false, why: "Always be Serving. If you're always closing, you're not listening." },
    { q: "Following up 5+ times is often needed.", a: true, why: "80% of sales need 5+ touches. Most give up at 2." },
    { q: "Lowering your price is usually the way to win.", a: false, why: "Discounting kills trust. Restate value instead." },
    { q: "Silence after a question is a good thing.", a: true, why: "First to talk loses. Let them think." },
  ];
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [reveal, setReveal] = useState<null | boolean>(null);
  const [finished, setFinished] = useState(false);
  const m = myths[i];
  const answer = (v: boolean) => {
    const right = v === m.a;
    if (right) setScore((s) => s + 1);
    setReveal(right);
  };
  const next = () => {
    setReveal(null);
    if (i + 1 >= myths.length) {
      setFinished(true);
      addXp(15 + score * 5, "Myth Busters");
    } else setI(i + 1);
  };
  if (finished) return <Card>Score: {score}/{myths.length}. +{15 + score * 5} XP</Card>;
  return (
    <Card>
      <div className="text-xs uppercase tracking-widest text-primary">Q {i + 1}/{myths.length}</div>
      <div className="mt-2 font-display text-2xl">{m.q}</div>
      {reveal === null ? (
        <div className="mt-4 flex gap-2">
          <button onClick={() => answer(true)} className="flex-1 rounded-md border border-border bg-background py-3 text-sm hover:border-primary/60">True</button>
          <button onClick={() => answer(false)} className="flex-1 rounded-md border border-border bg-background py-3 text-sm hover:border-primary/60">False</button>
        </div>
      ) : (
        <div className="mt-4">
          <div className={`font-display text-xl ${reveal ? "text-primary" : ""}`}>{reveal ? "Correct." : "Nope."}</div>
          <p className="mt-2 text-sm text-muted-foreground">{m.why}</p>
          <button onClick={next} className="mt-4 rounded-md bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow">Next</button>
        </div>
      )}
    </Card>
  );
}

function ReverseSelling() {
  const { addXp } = useProgress();
  const lines = [
    { line: "'This offer expires in the next 15 minutes only.'", tactic: "false urgency" },
    { line: "'You'd be crazy not to take this.'", tactic: "insult / shame" },
    { line: "'All my top clients got in at this price — you'd be joining them.'", tactic: "social pressure" },
    { line: "'Just trust me on this one.'", tactic: "no proof, appeal to authority" },
  ];
  const [flags, setFlags] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  return (
    <Card>
      <div className="text-xs uppercase tracking-widest text-primary">You are the buyer</div>
      <p className="mt-2 text-sm text-muted-foreground">Click every line that uses a sleazy pressure tactic. Then submit.</p>
      <div className="mt-4 space-y-2">
        {lines.map((l, i) => {
          const flagged = flags.includes(i);
          return (
            <button
              key={i}
              onClick={() => setFlags((f) => (f.includes(i) ? f.filter((x) => x !== i) : [...f, i]))}
              className={`block w-full rounded-md border px-4 py-3 text-left text-sm ${flagged ? "border-primary bg-primary/10" : "border-border bg-background hover:border-primary/60"}`}
            >
              {l.line} {done && <span className="ml-2 text-xs text-primary">→ {l.tactic}</span>}
            </button>
          );
        })}
      </div>
      <button
        disabled={done}
        onClick={() => { setDone(true); addXp(20, "Reverse Selling"); }}
        className="mt-4 rounded-md bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-40"
      >
        {done ? "Revealed ✓ +20 XP" : "Reveal tactics"}
      </button>
    </Card>
  );
}

function Detective() {
  const { addXp } = useProgress();
  const clues = [
    "Prospect was excited on the first call.",
    "Seller sent a 40-page PDF after the second call.",
    "Follow-up email said: 'Circling back — did you get my last email?'",
    "Third email: 'Just checking in!'",
    "Prospect ghosted after week 2.",
  ];
  const options = [
    { t: "The price was too high.", ok: false },
    { t: "Too many low-value follow-ups + generic PDF killed trust.", ok: true },
    { t: "Bad product.", ok: false },
    { t: "Wrong timezone.", ok: false },
  ];
  const [ans, setAns] = useState<number | null>(null);
  return (
    <Card>
      <div className="text-xs uppercase tracking-widest text-primary">Case file</div>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
        {clues.map((c) => <li key={c}>{c}</li>)}
      </ul>
      <div className="mt-4 space-y-2">
        {options.map((o, i) => (
          <button
            key={i}
            onClick={() => { setAns(i); if (o.ok) addXp(25, "Sales Detective"); }}
            className={`block w-full rounded-md border px-4 py-3 text-left text-sm ${ans === i ? (o.ok ? "border-primary bg-primary/10" : "border-destructive/60 bg-destructive/10") : "border-border bg-background hover:border-primary/60"}`}
          >
            {o.t} {ans === i && (o.ok ? " ✓ +25 XP" : " ✗")}
          </button>
        ))}
      </div>
    </Card>
  );
}

function ConfidenceMeter() {
  const { bumpSkill, addXp } = useProgress();
  const [before, setBefore] = useState(5);
  const [after, setAfter] = useState(5);
  const [done, setDone] = useState(false);
  const delta = useMemo(() => after - before, [before, after]);
  return (
    <Card>
      <div className="text-xs uppercase tracking-widest text-primary">Confidence Meter</div>
      <p className="mt-2 text-sm text-muted-foreground">Rate yourself before your practice rep, do the rep, then rate again.</p>
      <div className="mt-4">
        <label className="text-xs text-muted-foreground">Before: {before}/10</label>
        <input type="range" min={1} max={10} value={before} onChange={(e) => setBefore(+e.target.value)} className="w-full" />
      </div>
      <div className="mt-4">
        <label className="text-xs text-muted-foreground">After: {after}/10</label>
        <input type="range" min={1} max={10} value={after} onChange={(e) => setAfter(+e.target.value)} className="w-full" />
      </div>
      <div className="mt-4 font-display text-xl">Change: {delta >= 0 ? "+" : ""}{delta}</div>
      <button
        disabled={done}
        onClick={() => { setDone(true); addXp(10, "Confidence Meter"); if (delta > 0) bumpSkill("confidence", delta * 2); }}
        className="mt-3 rounded-md bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-40"
      >
        {done ? "Logged ✓" : "Log (+10 XP)"}
      </button>
    </Card>
  );
}
