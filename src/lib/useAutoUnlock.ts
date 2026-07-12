import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useProgress } from "@/lib/progress";
import { checkEnrollmentStatus } from "@/lib/enrollment.functions";

/**
 * Polls the server for a confirmed enrollment tied to the stored email.
 * When the admin confirms it, this auto-unlocks the tier locally.
 */
export function useAutoUnlock() {
  const { p, update } = useProgress();
  const check = useServerFn(checkEnrollmentStatus);

  useEffect(() => {
    if (!p.email) return;
    if (p.unlockedTier === "pro") return; // already max

    let cancelled = false;
    const tick = async () => {
      try {
        const res = await check({ data: { email: p.email! } });
        if (cancelled) return;
        const t = res.unlockedTier;
        if (t && t !== p.unlockedTier && !(p.unlockedTier === "pro" && t === "free")) {
          update({ unlockedTier: t, pendingEnrollment: false });
        }
      } catch {
        /* ignore */
      }
    };
    tick();
    const id = window.setInterval(tick, 20000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [p.email, p.unlockedTier, check, update]);
}
