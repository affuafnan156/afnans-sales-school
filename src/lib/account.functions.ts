import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type MyAccount = {
  id: string;
  email: string | null;
  fullName: string | null;
  tier: "free" | "pro" | "invest";
  isAdmin: boolean;
  createdAt: string | null;
};

/** The signed-in user's own profile + role. RLS scopes everything to them. */
export const getMyAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<MyAccount> => {
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("id, full_name, email, tier, created_at")
      .eq("id", context.userId)
      .maybeSingle();

    const { data: role } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();

    return {
      id: context.userId,
      email: profile?.email ?? (context.claims['email'] as string | undefined) ?? null,
      fullName: profile?.full_name ?? null,
      tier: (profile?.tier as MyAccount["tier"]) ?? "free",
      isAdmin: Boolean(role),
      createdAt: profile?.created_at ?? null,
    };
  });

/** Users may edit their own display name only — never their role or tier. */
export const updateMyName = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { fullName: string }) =>
    z.object({ fullName: z.string().trim().min(1).max(80) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update({ full_name: data.fullName })
      .eq("id", context.userId);
    if (error) throw error;
    return { ok: true };
  });
