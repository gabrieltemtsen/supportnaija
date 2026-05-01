"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { CheckCircle2, ShieldCheck, Sparkles, Wallet } from "lucide-react";

import { api } from "../../../convex/_generated/api";
import { fmtNgn } from "@/lib/format";

type Pool = {
  _id: string;
  name: string;
  slug: string;
  type: "general" | "ngo";
};

const PRESETS = [500, 1000, 2500, 5000, 10000];
const MIN = 500;

type Result = {
  paystackReference: string;
  amountGrossNgn: number;
  amountNetNgn: number;
  platformFeeNgn: number;
  anonymousId: string;
};

export function DonateClient() {
  const pools = useQuery(api.pools.listActive) as Pool[] | undefined;
  const ensureGeneral = useMutation(api.pools.ensureGeneralPool);
  const createOrGetDonor = useMutation(api.donors.createOrGet);
  const initiateDonation = useMutation(api.donations.initiate);

  // Auto-create the general pool the first time we load if there are none.
  useEffect(() => {
    if (pools && pools.length === 0) {
      ensureGeneral({}).catch(() => {});
    }
  }, [pools, ensureGeneral]);

  const [chosenPoolSlug, setChosenPoolSlug] = useState<string>("");
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [recurring, setRecurring] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  // Derive the active pool slug, defaulting to the first one.
  const poolSlug = useMemo(
    () => chosenPoolSlug || pools?.[0]?.slug || "",
    [chosenPoolSlug, pools]
  );

  const finalAmount = useMemo(() => {
    if (customAmount.trim()) {
      const parsed = Number(customAmount.replace(/[^\d]/g, ""));
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return amount;
  }, [amount, customAmount]);

  const canSubmit = useMemo(() => {
    if (!poolSlug) return false;
    if (finalAmount < MIN) return false;
    if (!isAnonymous && displayName.trim().length < 2) return false;
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) return false;
    return true;
  }, [poolSlug, finalAmount, isAnonymous, displayName, email]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const donorId = await createOrGetDonor({
        isAnonymous,
        displayName: isAnonymous ? undefined : displayName.trim(),
      });
      const out = (await initiateDonation({
        poolSlug,
        donorId,
        amountNgn: finalAmount,
        isRecurring: recurring,
      })) as {
        paystackReference: string;
        amountGrossNgn: number;
        amountNetNgn: number;
        platformFeeNgn: number;
      };

      // Anonymous ID lookup so we can show it to the donor.
      let anonymousId = "";
      try {
        // We don't have a direct getById — fall back to alias lookup if anonymous.
        // The createOrGet mutation already returned the id, but the alias was
        // generated server-side. We surface a friendly placeholder when public.
        anonymousId = isAnonymous ? "Generated on confirmation" : "—";
      } catch {
        anonymousId = "—";
      }

      setResult({ ...out, anonymousId });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return <Receipt result={result} amount={finalAmount} email={email} />;
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-6 lg:grid-cols-[1.2fr_1fr]"
    >
      <div className="grid gap-6">
        {/* Pool */}
        <section className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="text-sm font-semibold">1. Choose a pool</div>
          <p className="mt-1 text-sm text-black/65">
            Pick where your donation should go.
          </p>

          {!pools && (
            <div className="mt-4 text-sm text-black/55">Loading pools…</div>
          )}

          {pools && pools.length === 0 && (
            <div className="mt-4 text-sm text-black/55">
              Setting up the general pool…
            </div>
          )}

          {pools && pools.length > 0 && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {pools.map((p) => {
                const active = poolSlug === p.slug;
                return (
                  <button
                    type="button"
                    key={p._id}
                    onClick={() => setChosenPoolSlug(p.slug)}
                    className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                      active
                        ? "border-[color:var(--brand-green)] bg-[color:var(--brand-green-50)]"
                        : "border-black/10 bg-white hover:bg-black/[0.02]"
                    }`}
                  >
                    <span
                      aria-hidden
                      className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border"
                      style={{
                        borderColor: active
                          ? "var(--brand-green)"
                          : "rgba(0,0,0,0.2)",
                        backgroundColor: active
                          ? "var(--brand-green)"
                          : "white",
                      }}
                    >
                      {active && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">
                        {p.name}
                      </span>
                      <span className="block text-xs text-black/55">
                        {p.type === "general"
                          ? "General platform pool"
                          : "NGO pool"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Amount */}
        <section className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="text-sm font-semibold">2. Choose an amount</div>
          <p className="mt-1 text-sm text-black/65">Minimum is ₦500.</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {PRESETS.map((v) => {
              const active = !customAmount && amount === v;
              return (
                <button
                  type="button"
                  key={v}
                  onClick={() => {
                    setAmount(v);
                    setCustomAmount("");
                  }}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-[color:var(--brand-green)] bg-[color:var(--brand-green-50)] text-[color:var(--brand-green-600)]"
                      : "border-black/10 bg-white text-black/80 hover:bg-black/[0.03]"
                  }`}
                >
                  {fmtNgn(v)}
                </button>
              );
            })}
          </div>

          <label className="mt-3 grid gap-1">
            <span className="text-xs text-black/55">
              Or enter a custom amount (₦)
            </span>
            <input
              inputMode="numeric"
              placeholder="e.g. 7500"
              value={customAmount}
              onChange={(e) =>
                setCustomAmount(e.target.value.replace(/[^\d]/g, ""))
              }
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/25"
            />
          </label>

          <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
              className="h-4 w-4 accent-[color:var(--brand-green)]"
            />
            Make this a monthly donation
          </label>
        </section>

        {/* Donor */}
        <section className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="text-sm font-semibold">3. About you</div>
          <p className="mt-1 text-sm text-black/65">
            Donate publicly or anonymously — we&apos;ll generate an alias if you
            choose.
          </p>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setIsAnonymous(false)}
              className={`flex-1 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                !isAnonymous
                  ? "border-[color:var(--brand-green)] bg-[color:var(--brand-green-50)] text-[color:var(--brand-green-600)]"
                  : "border-black/10 bg-white text-black/80"
              }`}
            >
              Public name
            </button>
            <button
              type="button"
              onClick={() => setIsAnonymous(true)}
              className={`flex-1 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                isAnonymous
                  ? "border-[color:var(--brand-green)] bg-[color:var(--brand-green-50)] text-[color:var(--brand-green-600)]"
                  : "border-black/10 bg-white text-black/80"
              }`}
            >
              Anonymous
            </button>
          </div>

          {!isAnonymous && (
            <label className="mt-3 grid gap-1">
              <span className="text-xs text-black/55">Display name</span>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Aisha O."
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/25"
              />
            </label>
          )}

          <label className="mt-3 grid gap-1">
            <span className="text-xs text-black/55">Email (for receipt)</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/25"
            />
          </label>
        </section>
      </div>

      {/* Summary */}
      <aside className="grid h-max gap-4 rounded-2xl border border-black/10 bg-white p-5 lg:sticky lg:top-20">
        <div className="text-sm font-semibold">Summary</div>

        <div className="grid gap-2 text-sm">
          <Row label="Pool">
            {pools?.find((p) => p.slug === poolSlug)?.name ?? "—"}
          </Row>
          <Row label="Amount">
            <span className="tabular font-semibold">
              {fmtNgn(finalAmount || 0)}
            </span>
          </Row>
          <Row label="Frequency">{recurring ? "Monthly" : "One-time"}</Row>
          <Row label="Donor">
            {isAnonymous
              ? "Anonymous (alias generated)"
              : displayName.trim() || "—"}
          </Row>
        </div>

        <div className="rounded-xl bg-[color:var(--brand-green-50)] p-3 text-xs text-[color:var(--brand-green-600)]">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-4 w-4" /> Secure handover
          </div>
          <p className="mt-1 leading-relaxed">
            We hand off to Paystack for payment. Card details never touch our
            servers.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition disabled:opacity-50"
          style={{ backgroundColor: "var(--brand-green)" }}
        >
          <Wallet className="h-4 w-4" />
          {submitting
            ? "Preparing…"
            : `Donate ${fmtNgn(finalAmount || 0)}`}
        </button>

        <p className="text-[11px] leading-relaxed text-black/50">
          By donating you agree to our community guidelines and accept that pool
          balances are public.
        </p>
      </aside>
    </form>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-black/55">{label}</span>
      <span className="text-right text-black/85">{children}</span>
    </div>
  );
}

function Receipt({
  result,
  amount,
  email,
}: {
  result: Result;
  amount: number;
  email: string;
}) {
  return (
    <div className="grid gap-6 rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            backgroundColor: "var(--brand-green-50)",
            color: "var(--brand-green)",
          }}
        >
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Donation prepared
          </h2>
          <p className="mt-1 text-sm text-black/65">
            We&apos;ve created a pending donation. The next step is checkout
            with Paystack — once payment is confirmed, your donation moves to{" "}
            <span className="font-semibold">succeeded</span> and pool balances
            update live.
          </p>
        </div>
      </div>

      <div className="grid gap-2 rounded-xl border border-black/5 bg-[color:var(--brand-cream)] p-4 text-sm">
        <Row label="Reference">
          <code className="text-xs">{result.paystackReference}</code>
        </Row>
        <Row label="Amount">
          <span className="tabular font-semibold">
            {fmtNgn(result.amountGrossNgn || amount)}
          </span>
        </Row>
        <Row label="Platform fee">{fmtNgn(result.platformFeeNgn)}</Row>
        <Row label="Goes to pool">
          <span className="font-semibold">{fmtNgn(result.amountNetNgn)}</span>
        </Row>
        <Row label="Receipt to">{email || "—"}</Row>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white"
          style={{ backgroundColor: "var(--brand-green)" }}
        >
          <Sparkles className="h-4 w-4" /> See the leaderboard
        </Link>
        <Link
          href="/transparency"
          className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
        >
          View transparency
        </Link>
      </div>

      <p className="text-xs text-black/50">
        Production tip: configure <code>PAYSTACK_SECRET_KEY</code> and a webhook
        endpoint in your Convex deployment to flip pending donations to
        succeeded automatically.
      </p>
    </div>
  );
}
