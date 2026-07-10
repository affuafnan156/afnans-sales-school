import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AppNav } from "@/components/AppNav";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "Sales Lab — Practice with AI customers" },
      { name: "description", content: "Practice real sales conversations with AI customers of different personalities. Get instant feedback." },
    ],
  }),
  component: Lab,
});

type Msg = { role: "user" | "assistant"; content: string };
type Personality = "friendly" | "skeptical" | "busy" | "difficult";

const PERSONALITIES: { code: Personality; label: string; desc: string; emoji: string; xp: number }[] = [
  { code: "friendly", label: "Friendly", desc: "Warm, curious, easy conversation.", emoji: "😊", xp: 10 },
  { code: "skeptical", label: "Skeptical", desc: "Pushes back, wants proof.", emoji: "🤨", xp: 20 },
  { code: "busy", label: "Busy exec", desc: "60 seconds. No small talk.", emoji: "⏱️", xp: 30 },
  { code: "difficult", label: "Difficult", desc: "Rude objections, hard sell.", emoji: "😠", xp: 40 },
];

function Lab() {
  const { addXp, bumpSkill } = useProgress();
  const [personality, setPersonality] = useState<Personality>("friendly");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const start = () => {
    const p = PERSONALITIES.find((x) => x.code === personality)!;
    setMessages([{ role: "assistant", content: `(${p.label} customer) Hi. What did you want to talk about?` }]);
    setFeedback(null);
  };

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
        body: JSON.stringify({ messages: next, mode: "roleplay", personality }),
      });
      if (!res.ok) {
        const errText = await res.text();
        setMessages((m) => [...m, { role: "assistant", content: `⚠️ ${errText}` }]);
      } else {
        const data = (await res.json()) as { reply: string };
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "⚠️ Network error." }]);
    } finally {
      setLoading(false);
    }
  };

  const getFeedback = async () => {
    if (messages.length < 4 || loading) return;
    setLoading(true);
    try {
      const transcript = messages
        .map((m) => `${m.role === "user" ? "STUDENT" : "AI CUSTOMER"}: ${m.content}`)
        .join("\n");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "feedback",
          messages: [{ role: "user", content: transcript }],
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { reply: string };
        setFeedback(data.reply);
        const p = PERSONALITIES.find((x) => x.code === personality)!;
        addXp(p.xp, `Sales Lab: ${p.label}`);
        // rough skill bumps from feedback keywords
        const t = data.reply.toLowerCase();
        if (t.includes("confidence")) bumpSkill("confidence", 3);
        if (t.includes("discovery") || t.includes("question")) bumpSkill("discovery", 3);
        if (t.includes("objection")) bumpSkill("objections", 3);
        if (t.includes("clos")) bumpSkill("closing", 3);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNav />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Sales Lab</div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">🎤 Practice with an AI customer</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Pick a personality. Pitch, ask, close. Then hit <strong>Get feedback</strong> for a coached score.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {PERSONALITIES.map((p) => (
            <button
              key={p.code}
              onClick={() => setPersonality(p.code)}
              className={`rounded-xl border p-4 text-left transition ${
                personality === p.code
                  ? "border-primary bg-primary/10 shadow-glow"
                  : "border-border bg-card hover:border-primary/60"
              }`}
            >
              <div className="text-2xl">{p.emoji}</div>
              <div className="mt-1 font-display text-lg">{p.label}</div>
              <div className="text-xs text-muted-foreground">{p.desc}</div>
              <div className="mt-2 text-[10px] uppercase tracking-widest text-primary">+{p.xp} XP</div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={start}
            className="rounded-md bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90"
          >
            {messages.length ? "Restart" : "Start conversation"}
          </button>
          <button
            onClick={getFeedback}
            disabled={messages.length < 4 || loading}
            className="rounded-md border border-primary/60 px-5 py-2 text-sm font-semibold text-primary hover:bg-primary/10 disabled:opacity-40"
          >
            Get feedback (+XP)
          </button>
        </div>

        {messages.length > 0 && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div ref={scrollRef} className="max-h-[420px] min-h-[280px] space-y-3 overflow-y-auto p-5">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                      m.role === "user"
                        ? "bg-gradient-primary text-primary-foreground"
                        : "border border-border bg-background text-foreground"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && <p className="text-xs text-muted-foreground">…thinking</p>}
            </div>
            <form onSubmit={send} className="flex gap-2 border-t border-border bg-background p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Your reply as the seller…"
                maxLength={600}
                className="flex-1 rounded-md border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-md bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-40"
              >
                Send
              </button>
            </form>
          </div>
        )}

        {feedback && (
          <div className="mt-6 whitespace-pre-wrap rounded-2xl border border-primary/50 bg-card p-6 text-sm shadow-glow">
            <div className="mb-2 text-xs uppercase tracking-widest text-primary">Coach feedback</div>
            {feedback}
          </div>
        )}
      </main>
    </div>
  );
}
