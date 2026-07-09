import { createFileRoute } from "@tanstack/react-router";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are the friendly AI assistant for Afnan Sales Academy — a sales and business program built for Muslims who want to earn halal income with barakah.
Answer questions about: ethical sales techniques, halal closing, honest cold outreach, objection handling, pricing, mindset rooted in Islamic values (sidq/truthfulness, amanah/trust, avoiding riba and deception), and the academy's free vs paid tiers.

Free tier: weekly newsletter, public YouTube lessons, community Discord.
Paid tier ($197/mo or $1,497 one-time lifetime): live weekly coaching with Afnan, full course library, halal script vault, private brothers & sisters mastermind, and 1:1 pitch reviews.

Be concise (2-4 short paragraphs max), warm, practical, and respectful. You may use greetings like "As-salamu alaykum" when natural. Never encourage haram sales practices (riba, deception, selling haram products). If asked about investing in the business, tell them to email invest@afnansales.com with their name, ticket size, and background — note the round is structured to avoid riba. Never invent prices or promises not listed here.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const body = (await request.json()) as { messages?: ChatMessage[] };
        if (!Array.isArray(body.messages)) {
          return new Response("messages required", { status: 400 });
        }

        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": key,
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...body.messages],
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
