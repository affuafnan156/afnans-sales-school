import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppNav } from "@/components/AppNav";
import {
  listEnrollments,
  confirmEnrollment,
  rejectEnrollment,
} from "@/lib/enrollment.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Enrollment Confirmations" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Enrollment = {
  id: string;
  name: string | null;
  email: string;
  tier: "free" | "pro" | "invest";
  region: string | null;
  instructor: string | null;
  message: string | null;
  kind: string;
  status: "pending" | "confirmed" | "rejected";
  granted_tier: "free" | "pro" | "invest" | null;
  admin_note: string | null;
  confirmed_at: string | null;
  created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const listFn = useServerFn(listEnrollments);
  const confirmFn = useServerFn(confirmEnrollment);
  const rejectFn = useServerFn(rejectEnrollment);

  const [filter, setFilter] = useState<"pending" | "confirmed" | "rejected" | "all">("pending");

  const q = useQuery({
    queryKey: ["admin", "enrollments"],
    queryFn: async () => (await listFn()) as Enrollment[],
    refetchInterval: 15000,
  });

  const confirmMut = useMutation({
    mutationFn: (vars: { id: string; grantedTier: "free" | "pro" }) => confirmFn({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "enrollments"] }),
  });

  const rejectMut = useMutation({
    mutationFn: (id: string) => rejectFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "enrollments"] }),
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const rows = (q.data ?? []).filter((r) => (filter === "all" ? true : r.status === filter));

  const forbidden =
    q.error instanceof Error && /forbidden|unauthorized/i.test(q.error.message);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNav />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary">Admin</div>
            <h1 className="mt-1 font-display text-4xl">Enrollment confirmations</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Confirm a submission to auto-unlock that person's tier on their next visit.
            </p>
          </div>
          <button
            onClick={signOut}
            className="rounded-md border border-border px-3 py-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Sign out
          </button>
        </div>

        {forbidden && (
          <div className="mt-6 rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-sm text-destructive">
            This account is not an admin. Sign in as <strong>affuafnan156@gmail.com</strong> to
            access this page.
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          {(["pending", "confirmed", "rejected", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md border px-3 py-1.5 uppercase tracking-widest ${
                filter === f
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ["admin", "enrollments"] })}
            className="ml-auto rounded-md border border-border px-3 py-1.5 uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Refresh
          </button>
        </div>

        {q.isLoading ? (
          <div className="mt-8 text-sm text-muted-foreground">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="mt-8 rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No {filter} submissions.
          </div>
        ) : (
          <div className="mt-6 grid gap-3">
            {rows.map((r) => (
              <EnrollmentCard
                key={r.id}
                row={r}
                onConfirm={(tier) => confirmMut.mutate({ id: r.id, grantedTier: tier })}
                onReject={() => rejectMut.mutate(r.id)}
                pending={confirmMut.isPending || rejectMut.isPending}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function EnrollmentCard({
  row,
  onConfirm,
  onReject,
  pending,
}: {
  row: Enrollment;
  onConfirm: (t: "free" | "pro") => void;
  onReject: () => void;
  pending: boolean;
}) {
  const badge =
    row.status === "confirmed"
      ? "bg-primary/20 text-primary border-primary/40"
      : row.status === "rejected"
        ? "bg-muted text-muted-foreground border-border"
        : "border-border";
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-display text-lg">
            {row.name || "(no name)"}{" "}
            <span className="text-sm text-muted-foreground">&lt;{row.email}&gt;</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {new Date(row.created_at).toLocaleString()} · {row.kind} · requested{" "}
            <strong className="uppercase text-foreground">{row.tier}</strong>
            {row.region ? <> · {row.region}</> : null}
            {row.instructor ? <> · {row.instructor}</> : null}
          </div>
        </div>
        <span
          className={`rounded-md border px-2 py-1 text-[10px] uppercase tracking-widest ${badge}`}
        >
          {row.status}
          {row.granted_tier ? ` · ${row.granted_tier}` : ""}
        </span>
      </div>

      {row.message && (
        <pre className="mt-3 whitespace-pre-wrap rounded-md border border-border bg-background p-3 text-xs text-muted-foreground">
          {row.message}
        </pre>
      )}

      {row.status === "pending" && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            disabled={pending}
            onClick={() => onConfirm("free")}
            className="rounded-md border border-primary/50 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary hover:bg-primary/20 disabled:opacity-60"
          >
            ✅ Confirm — unlock Free
          </button>
          <button
            disabled={pending}
            onClick={() => onConfirm("pro")}
            className="rounded-md bg-gradient-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-glow disabled:opacity-60"
          >
            ⭐ Confirm — unlock Pro
          </button>
          <button
            disabled={pending}
            onClick={onReject}
            className="ml-auto rounded-md border border-border px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground disabled:opacity-60"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
