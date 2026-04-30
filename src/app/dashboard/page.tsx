import Link from "next/link";
import { LeaderboardClient } from "./LeaderboardClient";
import { FeedbackClient } from "./FeedbackClient";

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leaderboard</h1>
          <p className="mt-2 text-sm text-black/70">
            Ranked by <span className="font-medium">total donated</span> (succeeded donations only).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/donate"
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
          >
            Donate
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <LeaderboardClient />
      </div>

      <div className="mt-10">
        <FeedbackClient />
      </div>

      <div className="mt-10 rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="text-sm font-semibold">Hall of fame</h2>
        <p className="mt-1 text-sm text-black/70">
          Curated recognition for top and consistent donors.
        </p>
        <div className="mt-4 rounded-xl border border-dashed border-black/15 p-4 text-sm text-black/60">
          Next: featured donors + privacy controls.
        </div>
      </div>
    </main>
  );
}
