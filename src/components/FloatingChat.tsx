import { useEffect, useRef, useState, type FormEvent } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm Kai – Your Personal AI Assistant. Ask me anything about sales, the courses, or how to enroll." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

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
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="flex h-[460px] w-[340px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-glow">
          <div className="flex items-center justify-between border-b border-border bg-gradient-primary px-4 py-3 text-primary-foreground">
            <div>
              <div className="font-display text-base leading-none">Ask the Academy</div>
              <div className="text-[10px] opacity-80">We usually reply instantly</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-lg leading-none hover:opacity-80">×</button>
          </div>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-xs ${m.role === "user" ? "bg-gradient-primary text-primary-foreground" : "border border-border bg-background text-foreground"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <p className="text-[11px] text-muted-foreground">…thinking</p>}
          </div>
          <form onSubmit={send} className="flex gap-1.5 border-t border-border bg-background p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              maxLength={500}
              className="flex-1 rounded-md border border-border bg-card px-3 py-2 text-xs outline-none focus:border-primary"
            />
            <button type="submit" disabled={loading || !input.trim()} className="rounded-md bg-gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-glow disabled:opacity-40">Send</button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close help chat" : "Open help chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-2xl text-primary-foreground shadow-glow transition hover:scale-105"
      >
        {open ? "×" : "💬"}
      </button>
    </div>
  );
}
