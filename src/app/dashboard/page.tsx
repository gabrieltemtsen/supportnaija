import Link from "next/link";

import { Container } from "@/components/Container";
import { LeaderboardClient } from "./LeaderboardClient";
import { FeedbackClient } from "./FeedbackClient";

export const metadata = {
  title: "Leaderboard — SupportNaija",
  description:
    "Top donors this month and all time. Public goodwill messages from the community.",
};

export default function DashboardPage() {
  return (
    <main className="py-10">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wide text-black/55">
              Leaderboard
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              The givers powering Naija.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-black/70">
              Ranked by total donated (succeeded donations only). Anonymous
              donors appear under their alias.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/donate"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--brand-green)" }}
            >
              Donate
            </Link>
            <Link
              href="/transparency"
              className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/5"
            >
              Transparency
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
          <p className="mt-1 text-sm text-black/65">
            Curated recognition for top and consistent donors. Privacy controls
            let public donors toggle visibility.
          </p>
          <div className="mt-4 rounded-xl border border-dashed border-black/15 p-4 text-sm text-black/55">
            Coming next: featured donors, streak badges, and shoutouts.
          </div>
        </div>
      </Container>
    </main>
  );
}
