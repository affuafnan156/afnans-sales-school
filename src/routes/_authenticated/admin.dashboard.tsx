import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  listEnrollments,
  confirmEnrollment,
  rejectEnrollment,
} from "@/lib/enrollment.functions";
import {
  getMyAdminStatus,
  listUsers,
  setUserRole,
  deleteUser,
  getPlatformStats,
  type AdminUser,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — SellForge" },
      { name: "description", content: "SellForge internal administration dashboard." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboardPage,
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

function AdminDashboardPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const statusFn = useServerFn(getMyAdminStatus);
  const listFn = useServerFn(listEnrollments);
  const confirmFn = useServerFn(confirmEnrollment);
  const rejectFn = useServerFn(rejectEnrollment);
  const usersFn = useServerFn(listUsers);
  const roleFn = useServerFn(setUserRole);
  const deleteFn = useServerFn(deleteUser);
  const statsFn = useServerFn(getPlatformStats);

  const [tab, setTab] = useState<"overview" | "submissions" | "users" | "content">("overview");
  const [filter, setFilter] = useState<"pending" | "confirmed" | "rejected" | "all">("pending");

  const gate = useQuery({ queryKey: ["admin", "status"], queryFn: () => statusFn() });
  const isAdmin = gate.data?.isAdmin === true;

  const stats = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => statsFn(),
    enabled: isAdmin,
  });
  const enrollmentsQ = useQuery({
    queryKey: ["admin", "enrollments"],
    queryFn: async () => (await listFn()) as Enrollment[],
    enabled: isAdmin,
    refetchInterval: 20000,
  });
  const usersQ = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => (await usersFn()) as AdminUser[],
    enabled: isAdmin,
  });

  const confirmMut = useMutation({
    mutationFn: (vars: { id: string; grantedTier: "free" | "pro" }) => confirmFn({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "enrollments"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
  const rejectMut = useMutation({
    mutationFn: (id: string) => rejectFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "enrollments"] }),
  });
  const roleMut = useMutation({
    mutationFn: (vars: { userId: string; role: "admin" | "customer" }) => roleFn({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
  const deleteMut = useMutation({
    mutationFn: (userId: string) => deleteFn({ data: { userId } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (gate.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Checking permissions…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <div className="max-w-md rounded-xl border border-destructive/50 bg-destructive/10 p-8 text-center">
          <div className="font-display text-3xl text-destructive">Access denied</div>
          <p className="mt-3 text-sm text-muted-foreground">
            This account does not have administrator permissions.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => navigate({ to: "/" })}
              className="rounded-md bg-gradient-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-glow"
            >
              Back to homepage
            </button>
            <button
              onClick={signOut}
              className="rounded-md border border-border px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const rows = (enrollmentsQ.data ?? []).filter((r) =>
    filter === "all" ? true : r.status === filter,
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-2 font-display text-xl">
            <span className="inline-block h-3 w-3 rounded-full bg-primary shadow-glow" />
            SELL <span className="text-primary">FORGE</span>
            <span className="ml-2 rounded-md border border-primary/50 px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary">
              Admin
            </span>
          </div>
          <button
            onClick={signOut}
            className="rounded-md border border-border px-3 py-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-display text-4xl">Admin dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage users, review submissions, and track platform activity.
        </p>

        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          {(["overview", "submissions", "users", "content"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md border px-3 py-1.5 uppercase tracking-widest ${
                tab === t
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Stat label="Registered users" value={stats.data?.users} />
            <Stat label="Total submissions" value={stats.data?.submissions} />
            <Stat label="Pending review" value={stats.data?.pending} />
            <Stat label="Confirmed" value={stats.data?.confirmed} />
            <Stat label="Pro unlocked" value={stats.data?.proUnlocked} />
            <Stat label="New (7 days)" value={stats.data?.last7Days} />
          </div>
        )}

        {tab === "submissions" && (
          <>
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
            </div>
            {enrollmentsQ.isLoading ? (
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
          </>
        )}

        {tab === "users" && (
          <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card shadow-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Last sign in</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(usersQ.data ?? []).map((u) => (
                  <tr key={u.id} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-3">{u.email ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-md border px-2 py-1 text-[10px] uppercase tracking-widest ${
                          u.role === "admin"
                            ? "border-primary/50 bg-primary/15 text-primary"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {u.lastSignInAt ? new Date(u.lastSignInAt).toLocaleDateString() : "never"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          disabled={roleMut.isPending}
                          onClick={() =>
                            roleMut.mutate({
                              userId: u.id,
                              role: u.role === "admin" ? "customer" : "admin",
                            })
                          }
                          className="rounded-md border border-border px-3 py-1.5 text-[10px] uppercase tracking-widest hover:border-primary/60 disabled:opacity-60"
                        >
                          {u.role === "admin" ? "Revoke admin" : "Make admin"}
                        </button>
                        <button
                          disabled={deleteMut.isPending}
                          onClick={() => deleteMut.mutate(u.id)}
                          className="rounded-md border border-destructive/50 px-3 py-1.5 text-[10px] uppercase tracking-widest text-destructive hover:bg-destructive/10 disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(roleMut.error || deleteMut.error) && (
              <div className="border-t border-border px-4 py-3 text-xs text-destructive">
                {(roleMut.error as Error)?.message ?? (deleteMut.error as Error)?.message}
              </div>
            )}
          </div>
        )}

        {tab === "content" && (
          <div className="mt-6 rounded-xl border border-border bg-card p-8 text-sm text-muted-foreground shadow-card">
            <div className="font-display text-xl text-foreground">Content management</div>
            <p className="mt-2">
              Reserved for editing lessons, roadmap days, arcade scenarios, and pricing copy from
              the dashboard. Content is currently defined in the site source.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-4xl text-primary">{value ?? "—"}</div>
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
        <span className={`rounded-md border px-2 py-1 text-[10px] uppercase tracking-widest ${badge}`}>
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
