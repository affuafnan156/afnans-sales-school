import { createFileRoute } from "@tanstack/react-router";

const GATEWAY = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";
const TO_EMAIL = "affuafnan156@gmail.com";

function b64url(input: string) {
  // UTF-8 safe base64url
  const bytes = new TextEncoder().encode(input);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!),
  );
}

export const Route = createFileRoute("/api/enroll")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
        const GOOGLE_MAIL_API_KEY = process.env.GOOGLE_MAIL_API_KEY;
        if (!LOVABLE_API_KEY || !GOOGLE_MAIL_API_KEY) {
          return Response.json({ error: "Email service not configured." }, { status: 500 });
        }

        let body: {
          name?: string;
          email?: string;
          tier?: string;
          region?: string;
          instructor?: string;
          message?: string;
          kind?: string;
        };
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON." }, { status: 400 });
        }

        const email = (body.email || "").trim();
        const name = (body.name || "").trim().slice(0, 120);
        const tier = (body.tier || "").trim().slice(0, 40);
        const region = (body.region || "").trim().slice(0, 80);
        const instructor = (body.instructor || "").trim().slice(0, 120);
        const message = (body.message || "").trim().slice(0, 2000);
        const kind = (body.kind || "enroll").trim().slice(0, 40);

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return Response.json({ error: "Please enter a valid email." }, { status: 400 });
        }

        const subject =
          kind === "invest"
            ? `Investor inquiry — ${name || email}`
            : `New ${tier || "signup"} (${region || "—"}) — ${name || email}`;

        const textLines = [
          `New ${kind === "invest" ? "investor inquiry" : "signup"} from afnansales.com`,
          ``,
          `Name: ${name || "(not provided)"}`,
          `Email: ${email}`,
          `Tier: ${tier || "—"}`,
          `Region: ${region || "—"}`,
          `Instructor: ${instructor || "—"}`,
          ``,
          message ? `Message:\n${message}` : "",
        ].join("\n");

        const html = `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#111">
          <h2 style="margin:0 0 12px">${escapeHtml(subject)}</h2>
          <p><strong>Name:</strong> ${escapeHtml(name || "(not provided)")}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          <p><strong>Tier:</strong> ${escapeHtml(tier || "—")}</p>
          <p><strong>Region:</strong> ${escapeHtml(region || "—")}</p>
          <p><strong>Instructor:</strong> ${escapeHtml(instructor || "—")}</p>
          ${message ? `<p><strong>Message:</strong><br>${escapeHtml(message).replace(/\n/g, "<br>")}</p>` : ""}
          <hr><p style="color:#666;font-size:12px">Sent from afnansales.com</p>
        </div>`;

        const boundary = `bnd_${Math.random().toString(36).slice(2)}`;
        const raw = [
          `To: ${TO_EMAIL}`,
          `Reply-To: ${name ? `${name} <${email}>` : email}`,
          `Subject: ${subject}`,
          `MIME-Version: 1.0`,
          `Content-Type: multipart/alternative; boundary="${boundary}"`,
          ``,
          `--${boundary}`,
          `Content-Type: text/plain; charset="UTF-8"`,
          ``,
          textLines,
          `--${boundary}`,
          `Content-Type: text/html; charset="UTF-8"`,
          ``,
          html,
          `--${boundary}--`,
          ``,
        ].join("\r\n");

        const res = await fetch(`${GATEWAY}/users/me/messages/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": GOOGLE_MAIL_API_KEY,
          },
          body: JSON.stringify({ raw: b64url(raw) }),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error(`Gmail send failed [${res.status}]: ${errText}`);
          return Response.json(
            { error: "Failed to send email. Please try again." },
            { status: 502 },
          );
        }

        return Response.json({ ok: true });
      },
    },
  },
});
