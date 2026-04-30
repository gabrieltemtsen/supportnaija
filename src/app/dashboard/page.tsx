import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-sm text-black/70">
            MVP: Donor leaderboard + hall of fame will live here.
          </p>
        </div>
        <Link
          href="/donate"
          className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
        >
          Donate
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold">Donor leaderboard</h2>
          <p className="mt-1 text-sm text-black/70">
            Ranking by total donated (gross) — succeeded donations only.
          </p>
          <div className="mt-4 rounded-xl border border-dashed border-black/15 p-4 text-sm text-black/60">
            Coming next: Convex query → show this month + all-time.
          </div>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold">Hall of fame</h2>
          <p className="mt-1 text-sm text-black/70">
            Curated recognition for top and consistent donors.
          </p>
          <div className="mt-4 rounded-xl border border-dashed border-black/15 p-4 text-sm text-black/60">
            Coming next: featured donors + privacy controls.
          </div>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold">Recipient feedback / goodwill messages</h2>
          <p className="mt-1 text-sm text-black/70">
            Public messages (moderated). We’ll mark messages tied to successful payouts as “verified payout”.
          </p>
          <div className="mt-4 rounded-xl border border-dashed border-black/15 p-4 text-sm text-black/60">
            Coming next: submit form + public feed.
          </div>
        </section>
      </div>
    </main>
  );
}
