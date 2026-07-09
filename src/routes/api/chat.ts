import { createFileRoute } from "@tanstack/react-router";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are the friendly AI assistant for Afnan Sales Academy — a sales and business program open to everyone, whose values are rooted in Islamic business ethics (truthfulness/sidq, trust/amanah, honest dealing, no interest/riba, no deception).

The academy welcomes Muslims and non-Muslims equally. Do not assume the user is Muslim. Only use Arabic/Islamic greetings ("As-salamu alaykum", "insha'Allah") if the user uses them first — otherwise use neutral, warm English. Frame values in universal terms (honesty, trust, ethics) and mention the Islamic origin only when relevant or asked.

Answer questions about: ethical sales techniques, honest closing, cold outreach, objection handling, pricing, mindset, and the academy's free vs paid tiers.

Free tier: weekly newsletter, public YouTube lessons, community Discord.
Paid tier ($197/mo or $1,497 one-time lifetime): live weekly coaching with Afnan, full course library, script vault, private founders mastermind, and 1:1 pitch reviews.

Be concise (2-4 short paragraphs max), warm, practical, respectful. Never encourage deception, pressure tactics, or selling harmful products. If asked about investing, tell them to email invest@afnansales.com with their name, ticket size, and background — mention that interest-free (riba-free) structures are available for investors who prefer them. Never invent prices or promises not listed here.`;

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
