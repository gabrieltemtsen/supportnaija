"use client";

import { useQuery } from "convex/react";
import { ArrowDownToLine, ArrowUpToLine, Coins, Users } from "lucide-react";

import { api } from "../../../convex/_generated/api";
import { fmtNgn, fmtNumber } from "@/lib/format";

type PoolStat = {
  _id: string;
  name: string;
  slug: string;
  type: "general" | "ngo";
  totalRaisedNgn: number;
  donationCount: number;
  uniqueDonors: number;
  payoutsNgn: number;
  balanceNgn: number;
};

type Totals = {
  totalRaisedNgn: number;
  donationCount: number;
  uniqueDonors: number;
  payoutsSucceededNgn: number;
  payoutCount: number;
  activePoolCount: number;
};

export function TransparencyClient() {
  const totals = useQuery(api.pools.platformTotals) as Totals | undefined;
  const pools = useQuery(api.pools.listWithStats) as PoolStat[] | undefined;

  return (
    <div className="grid gap-6">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total raised"
          value={totals ? fmtNgn(totals.totalRaisedNgn) : "—"}
          hint={totals ? `${fmtNumber(totals.donationCount)} donations` : ""}
          icon={ArrowDownToLine}
          loading={!totals}
        />
        <KpiCard
          label="Disbursed"
          value={totals ? fmtNgn(totals.payoutsSucceededNgn) : "—"}
          hint={totals ? `${fmtNumber(totals.payoutCount)} payouts` : ""}
          icon={ArrowUpToLine}
          loading={!totals}
        />
        <KpiCard
          label="Unique donors"
          value={totals ? fmtNumber(totals.uniqueDonors) : "—"}
          hint="Anonymous + public"
          icon={Users}
          loading={!totals}
        />
        <KpiCard
          label="Active pools"
          value={totals ? fmtNumber(totals.activePoolCount) : "—"}
          hint="General + NGO"
          icon={Coins}
          loading={!totals}
        />
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold">Pool balances</h2>
            <p className="mt-1 text-sm text-black/65">
              Live balance = total raised (net) − payouts disbursed.
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-black/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/[0.02] text-xs uppercase tracking-wide text-black/55">
              <tr>
                <th className="px-4 py-3 font-medium">Pool</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 text-right font-medium">Raised</th>
                <th className="px-4 py-3 text-right font-medium">Disbursed</th>
                <th className="px-4 py-3 text-right font-medium">Balance</th>
                <th className="px-4 py-3 text-right font-medium">Donors</th>
              </tr>
            </thead>
            <tbody>
              {!pools && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-sm text-black/55"
                  >
                    Loading pool data…
                  </td>
                </tr>
              )}
              {pools && pools.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-sm text-black/55"
                  >
                    No active pools yet.
                  </td>
                </tr>
              )}
              {(pools ?? []).map((p) => (
                <tr
                  key={p._id}
                  className="border-t border-black/5 align-middle"
                >
                  <td className="px-4 py-3 font-medium text-black/85">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-black/65">
                    {p.type === "general" ? "General" : "NGO"}
                  </td>
                  <td className="px-4 py-3 text-right tabular text-black/85">
                    {fmtNgn(p.totalRaisedNgn)}
                  </td>
                  <td className="px-4 py-3 text-right tabular text-black/65">
                    {fmtNgn(p.payoutsNgn)}
                  </td>
                  <td className="px-4 py-3 text-right tabular font-semibold">
                    {fmtNgn(p.balanceNgn)}
                  </td>
                  <td className="px-4 py-3 text-right tabular text-black/65">
                    {fmtNumber(p.uniqueDonors)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="text-sm font-semibold">Transparency+</h2>
        <p className="mt-1 text-sm text-black/65">
          A detailed ledger with downloadable CSVs and time-windowed reports is
          available for ₦100. This funds platform operations.
        </p>
        <div className="mt-4 rounded-xl border border-dashed border-black/15 p-4 text-sm text-black/60">
          Coming next: per-pool ledger views, recipient-level audit trail (privacy
          preserving), and webhooks for verifiable receipts.
        </div>
      </section>
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  loading,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wide text-black/55">
          {label}
        </div>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            backgroundColor: "var(--brand-green-50)",
            color: "var(--brand-green)",
          }}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 tabular text-2xl font-semibold tracking-tight">
        {loading ? "…" : value}
      </div>
      {hint && (
        <div className="mt-1 text-xs text-black/55">{loading ? "" : hint}</div>
      )}
    </div>
  );
}
