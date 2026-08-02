import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

function b64url(input: string) {
  const bytes = new TextEncoder().encode(input);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sendGmail(to: string, subject: string, html: string, text: string) {
  const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
  const GOOGLE_MAIL_API_KEY = process.env.GOOGLE_MAIL_API_KEY;
  if (!LOVABLE_API_KEY || !GOOGLE_MAIL_API_KEY) {
    console.warn("[enrollment] Gmail not configured; skipping confirmation email");
    return;
  }
  const boundary = `bnd_${Math.random().toString(36).slice(2)}`;
  const raw = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    ``,
    text,
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
  if (!res.ok) console.error(`[enrollment] gmail send failed ${res.status}: ${await res.text()}`);
}

/** Public: check whether an email has an admin-confirmed enrollment. */
export const checkEnrollmentStatus = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string }) => z.object({ email: z.string().email() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("enrollments")
      .select("granted_tier, status, confirmed_at")
      .ilike("email", data.email)
      .eq("status", "confirmed")
      .order("confirmed_at", { ascending: false })
      .limit(1);
    if (error) {
      console.error(error);
      return { unlockedTier: null as null | "free" | "pro" };
    }
    const row = rows?.[0];
    const tier = row?.granted_tier;
    return { unlockedTier: tier === "pro" || tier === "free" ? tier : null };
  });

/** Admin: list all enrollments. */
export const listEnrollments = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { data, error } = await context.supabase
      .from("enrollments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    return data ?? [];
  });

/** Admin: confirm an enrollment and unlock a tier. Also emails the user. */
export const confirmEnrollment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; grantedTier: "free" | "pro"; note?: string }) =>
    z.object({
      id: z.string().uuid(),
      grantedTier: z.enum(["free", "pro"]),
      note: z.string().max(1000).optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { data: row, error } = await context.supabase
      .from("enrollments")
      .update({
        status: "confirmed",
        granted_tier: data.grantedTier,
        admin_note: data.note ?? null,
        confirmed_at: new Date().toISOString(),
        confirmed_by: context.userId,
      })
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;

    const tierLabel = data.grantedTier === "pro" ? "Pro" : "Free";
    const text = `Hi ${row.name || "there"},\n\nGood news — your SellForge enrollment has been confirmed. Your ${tierLabel} tier is unlocked.\n\nJust visit https://sellforge.com in the same browser you signed up from and everything opens automatically. Or open the site and everything will unlock within a few seconds.\n\nDiscord community: https://discord.gg/fsfPArVRg\n\n— SellForge`;
    const html = `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#111">
      <h2>You're in — ${tierLabel} tier unlocked ✅</h2>
      <p>Hi ${row.name || "there"},</p>
      <p>Your SellForge enrollment has been confirmed. Your <strong>${tierLabel}</strong> tier is now unlocked.</p>
      <p>Open the site in the same browser you signed up from — everything unlocks automatically.</p>
      <p><a href="https://discord.gg/fsfPArVRg">Join the Discord community →</a></p>
      <hr><p style="color:#666;font-size:12px">SellForge</p>
    </div>`;
    await sendGmail(row.email, `Your ${tierLabel} access is unlocked — SellForge`, html, text);

    return { ok: true, row };
  });

/** Admin: reject/delete an enrollment. */
export const rejectEnrollment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { error } = await context.supabase
      .from("enrollments")
      .update({ status: "rejected" })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
