import { createFileRoute } from "@tanstack/react-router";
import { AppNav, GatedNotice } from "@/components/AppNav";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "30-Day Beginner Roadmap — SellForge" },
      { name: "description", content: "Day 1 → Day 30 sales roadmap. Exactly what to learn each day, in 15 minutes." },
    ],
  }),
  component: Roadmap,
});

const DAYS: { title: string; body: string; pro?: boolean }[] = [
  { title: "The mindset shift: sell to serve", body: "You're not 'pushing' anything. You're helping someone reach a goal faster. If they don't need it, don't sell it. Journaling prompt: write one product/service you 100% believe in." },
  { title: "The 3 pillars: Sidq, Amanah, Ihsan", body: "Truth. Trust. Excellence. Every deal has to pass all three. If a script violates any, we don't teach it." },
  { title: "Know your customer better than they know themselves", body: "Interview 3 potential customers. Ask about their day, their frustration, their dream outcome. Do not pitch." },
  { title: "The one-line opener", body: "Learn the 'question opener': 'Hey, quick one — do you handle [X] at [company]? Not selling, just checking.' Send 10 today." },
  { title: "Discovery questions that don't feel like an interview", body: "Learn the SPIN-lite: Situation, Problem, Impact, Ideal. Practice with a friend for 10 min." },
  { title: "The silence rule", body: "After you ask a discovery question — shut up. Count to 5 in your head. The first one to talk loses." },
  { title: "First week review + streak check", body: "Journal: what surprised you? Which pillar was hardest? Rest well. Come back stronger." },
  { title: "Cold email that doesn't sound like a cold email", body: "Template: 1 line context, 1 line question, 1 line CTA. No 'I hope this email finds you well'. Send 5." },
  { title: "Cold DM on LinkedIn / X / IG", body: "The 'name-drop opener': reference something they posted. Ask one specific question. That's it." },
  { title: "The follow-up rhythm", body: "Day 1, Day 3, Day 7, Day 14, Day 30. Value in every touch — never guilt." },
  { title: "Objection handling: 'too expensive'", body: "Never defend price. Restate value → ask what specifically feels too high → offer options." },
  { title: "Objection handling: 'I need to think about it'", body: "Real translation: 'you didn't sell me clearly enough'. Ask: 'what part isn't clear yet?'" },
  { title: "Objection handling: 'send me info'", body: "Usually a polite no. Say: 'Happy to — one question first so I only send what's useful.'" },
  { title: "The ethical close", body: "'Based on what you told me, this fits. Want to move forward, or is there a reason not to?'" },
  { title: "Second week review", body: "Score yourself 1-10 on confidence, discovery, objections, closing. Which is weakest? Focus there next." },
  { title: "Storytelling in sales", body: "One 60-second customer success story. Structure: problem → what they tried → the shift → the result." },
  { title: "Building your pipeline", body: "Track every prospect: name, stage, next step, next date. Simple sheet, updated daily." },
  { title: "The daily 5-touch rule", body: "5 outbound touches per day. Compound over 30 days = 150 touches = deals." },
  { title: "Handling ghosting", body: "The 'break-up email': 'Should I close your file?' Works ~30% of the time." },
  { title: "Reading buying signals", body: "Questions about implementation, pricing details, contract terms — those are buying signals. Move to close." },
  { title: "Week 3 review", body: "How many meaningful conversations this week? How many next steps? Streak status?" },
  { title: "Pricing psychology (ethical)", body: "Anchor high, offer 2-3 options, let them choose. Never pressure. Never hide fees." },
  { title: "Negotiation without lying", body: "'That's the best I can do. If it's not right, that's OK.' Walking away is negotiation." },
  { title: "Closing over the phone / call", body: "Recap → benefit → assumptive close. 'So we'd start Monday — want me to send the paperwork?'" },
  { title: "Handling the 'yes' — don't oversell", body: "The moment they say yes, stop selling. Confirm next step. Shut up." },
  { title: "Post-sale: turning customers into referrers", body: "24hr after close, send a thank-you. 7 days later, ask for a referral. Never demand." },
  { title: "The 'reverse pitch' exercise", body: "Play the customer. Have someone pitch you. Notice what feels good and what feels sleazy." },
  { title: "Your personal script vault", body: "Save your top 5 openers, top 3 objection responses, top 2 closes. This is your foundation." },
  { title: "The pro tier deep-dive", body: "This is where advanced enterprise deals, retainers, and high-ticket frameworks live.", pro: true },
  { title: "Day 30: teach it", body: "Write a 300-word post explaining what you learned. Teaching = mastery. Congrats on Level 1 of many." },
];

function Roadmap() {
  const { p, completeDay } = useProgress();
  const unlocked = p.unlockedTier !== "none";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNav />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">30-Day Roadmap</div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">Day 1 → Day 30</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            15 minutes a day. Read the lesson, do the mini-mission, mark it done. Miss a day, streak resets.
          </p>
        </div>

        {!unlocked && (
          <div className="mb-6">
            <GatedNotice tier="free" />
          </div>
        )}

        <ol className="space-y-3">
          {DAYS.map((d, i) => {
            const day = i + 1;
            const done = p.completedDays.includes(day);
            const proLocked = d.pro && p.unlockedTier !== "pro";
            const infoLocked = !unlocked;
            return (
              <li
                key={day}
                className={`rounded-xl border p-5 transition ${
                  done
                    ? "border-primary/60 bg-primary/5 shadow-glow"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
                      Day {day}
                      {d.pro && <span className="rounded-full bg-gradient-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">PRO</span>}
                      {done && <span>· ✅ done</span>}
                    </div>
                    <div className="mt-1 font-display text-xl">{d.title}</div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {infoLocked
                        ? "🔒 Enroll (free is fine) to read the lesson."
                        : proLocked
                          ? "🔒 Pro-only. Enroll in Pro to unlock."
                          : d.body}
                    </p>
                  </div>
                  <button
                    disabled={done || infoLocked || proLocked}
                    onClick={() => completeDay(day)}
                    className="shrink-0 rounded-md border border-primary/50 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10 disabled:opacity-40"
                  >
                    {done ? "Done" : "Mark done +25 XP"}
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}
