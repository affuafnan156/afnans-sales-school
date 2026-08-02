import { createFileRoute } from "@tanstack/react-router";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };
type Mode = "default" | "roleplay" | "feedback";
type Personality = "friendly" | "skeptical" | "busy" | "difficult";

const BASE_PROMPT = `You are Kai – Your Personal AI Assistant, the friendly AI assistant for SellForge — a sales and business program open to everyone, whose values are rooted in Islamic business ethics (truthfulness/sidq, trust/amanah, honest dealing, no interest/riba, no deception).

The academy welcomes Muslims and non-Muslims equally. Do not assume the user is Muslim. Only use Arabic/Islamic greetings if the user uses them first — otherwise use neutral, warm English.

Answer questions about ethical sales techniques, cold outreach, objection handling, pricing, mindset, and the academy's free vs paid tiers.

Free (Starter, $0): weekly newsletter, YouTube library, script pack, Discord community, monthly Q&A.
Pro ($10/mo): full course library, weekly live coaching with Afnan, private mastermind, 1:1 pitch reviews, complete script vault, AI Sales Lab access.

Be concise (2-4 short paragraphs max), warm, practical, respectful. Never encourage deception or pressure tactics. For investing, direct them to invest@sellforge.com.`;

const ROLEPLAY_PROMPTS: Record<Personality, string> = {
  friendly:
    "You are a FRIENDLY potential customer being pitched to. You're warm, curious, ask reasonable questions, and give the seller a fair chance. You have small realistic objections about price and time. Stay in character as the customer. Never break character. Keep replies to 1-3 sentences.",
  skeptical:
    "You are a SKEPTICAL potential customer. You've been pitched a lot. You push back on claims, ask for proof, and dislike hype. You're not rude, just cautious. Stay in character as the customer. Keep replies to 1-3 sentences.",
  busy:
    "You are a BUSY executive. You have 60 seconds. You interrupt, ask 'so what's the bottom line?', and hate small talk. If they waste your time you say you have to go. Stay in character. Keep replies to 1-2 sentences.",
  difficult:
    "You are a DIFFICULT customer. You're skeptical, a little rude, and throw hard objections ('too expensive', 'I don't trust you', 'your competitor is cheaper'). You will only warm up if the seller stays calm, listens, and gives honest answers. Never break character. Keep replies to 1-3 sentences.",
};

const FEEDBACK_PROMPT = `You are a sales coach. You will receive a transcript of a practice sales conversation between a STUDENT (seller) and an AI CUSTOMER. Give the student concise, actionable feedback.

Return your answer in this exact structure using markdown:

**Overall score: X/100**

**What worked:**
- (2-3 short bullets)

**What to improve:**
- (2-3 short bullets)

**Skill ratings (0-100):**
- Confidence: X
- Discovery (asking good questions): X
- Objection handling: X
- Closing: X

**One thing to try next time:** (one sentence)

Be honest but encouraging. Never reward pressure tactics or dishonesty — mark them down.`;

function systemFor(mode: Mode, personality?: Personality) {
  if (mode === "roleplay") {
    const p = personality && ROLEPLAY_PROMPTS[personality] ? personality : "friendly";
    return ROLEPLAY_PROMPTS[p];
  }
  if (mode === "feedback") return FEEDBACK_PROMPT;
  return BASE_PROMPT;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const body = (await request.json()) as {
          messages?: ChatMessage[];
          mode?: Mode;
          personality?: Personality;
        };
        if (!Array.isArray(body.messages)) {
          return new Response("messages required", { status: 400 });
        }

        const system = systemFor(body.mode ?? "default", body.personality);

        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": key,
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [{ role: "system", content: system }, ...body.messages],
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          if (res.status === 429) return new Response("Rate limit. Try again shortly.", { status: 429 });
          if (res.status === 402) return new Response("AI credits exhausted.", { status: 402 });
          return new Response(`AI error: ${text}`, { status: 500 });
        }

        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't answer that.";
        return Response.json({ reply });
      },
    },
  },
});
