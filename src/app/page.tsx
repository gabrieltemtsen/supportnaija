import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/Container";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      <div className="tabular text-xl font-semibold tracking-tight">{value}</div>
      <div className="text-xs text-black/55">{label}</div>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl"
        style={{
          backgroundColor: "var(--brand-green-50)",
          color: "var(--brand-green)",
        }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 text-sm font-semibold">{title}</div>
      <p className="mt-1 text-sm leading-relaxed text-black/65">{body}</p>
    </div>
  );
}

function Step({
  n,
  title,
  body,
}: {
  n: number;
  title: string;
  body: string;
}) {
  return (
    <div className="relative rounded-2xl border border-black/5 bg-white p-5">
      <div
        className="absolute -top-3 left-5 inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-semibold text-white"
        style={{ backgroundColor: "var(--brand-green)" }}
      >
        {n}
      </div>
      <div className="mt-2 text-sm font-semibold">{title}</div>
      <p className="mt-1 text-sm leading-relaxed text-black/65">{body}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="relative">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            background:
              "radial-gradient(circle at 20% 15%, rgba(0,135,83,0.35), transparent 40%), radial-gradient(circle at 80% 30%, rgba(0,135,83,0.25), transparent 35%), radial-gradient(circle at 50% 90%, rgba(0,135,83,0.15), transparent 45%)",
          }}
        />
        <div className="absolute inset-x-0 top-[-120px] mx-auto h-[260px] w-[1100px] max-w-[94vw] rounded-full bg-[linear-gradient(90deg,rgba(0,135,83,0.22),rgba(255,255,255,0),rgba(0,135,83,0.22))] blur-3xl" />
      </div>

      {/* Hero */}
      <Container className="pb-12 pt-10 sm:pt-14">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/70">
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: "var(--brand-green)" }}
              />
              Transparent support for Nigerians — mobile-first
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Support Naija.
              <span className="block text-black/65">
                Verified help. Public balances. Optional anonymous giving.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-black/70">
              Donate from ₦500. Beneficiaries are BVN-verified (with optional
              NIN for extra protection). Pool balances are visible,
              disbursements are tracked, and we keep things simple.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
                style={{ backgroundColor: "var(--brand-green)" }}
              >
                Donate now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/transparency"
                className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
              >
                View transparency
              </Link>
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
              >
                Apply for support
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <Stat label="Min donation" value="₦500" />
              <Stat label="Auto airtime (BVN)" value="₦1,000" />
              <Stat label="Monthly cap" value="₦3,000" />
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white/80 p-6 backdrop-blur">
            <div className="grid gap-3 sm:grid-cols-2">
              <Feature
                icon={Wallet}
                title="Donations"
                body="One-time or recurring. Donate publicly or get an Anonymous ID."
              />
              <Feature
                icon={ShieldCheck}
                title="Verification"
                body="BVN-first verification reduces fraud. Optional NIN for extra trust."
              />
              <Feature
                icon={Zap}
                title="Fast support"
                body="Auto-approve ₦1,000 airtime for BVN-verified recipients when funded."
              />
              <Feature
                icon={HeartHandshake}
                title="NGO pools"
                body="NGOs create pools and choose NGO- or platform-controlled approvals."
              />
            </div>

            <div
              className="mt-5 rounded-2xl p-4"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,135,83,0.12), rgba(0,135,83,0.02))",
              }}
            >
              <div className="text-sm font-semibold">SEO-ready from day one</div>
              <p className="mt-1 text-sm text-black/70">
                Proper metadata, OpenGraph, fast mobile performance, and clean,
                indexable pool pages.
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* How it works */}
      <Container className="py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-black/55">
              How it works
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Three steps. No paperwork drama.
            </h2>
          </div>
          <Link
            href="/apply"
            className="hidden text-sm font-semibold text-black hover:underline sm:inline-flex"
          >
            Apply for support →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Step
            n={1}
            title="Donor gives ₦500+"
            body="Choose a pool, optionally stay anonymous, and check out securely."
          />
          <Step
            n={2}
            title="Beneficiary verified"
            body="BVN-first verification. NIN optional for extra trust and higher caps."
          />
          <Step
            n={3}
            title="Disbursed transparently"
            body="Funds disbursed as airtime or cash. Every move is logged on a public ledger."
          />
        </div>
      </Container>

      {/* Trust band */}
      <Container className="py-12">
        <div
          className="rounded-3xl border border-black/5 p-6 sm:p-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,135,83,0.10), rgba(0,135,83,0.02))",
          }}
        >
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <ShieldCheck
                className="mt-1 h-5 w-5"
                style={{ color: "var(--brand-green)" }}
              />
              <div>
                <div className="text-sm font-semibold">Verified beneficiaries</div>
                <p className="mt-1 text-sm text-black/65">
                  BVN- and NIN-backed checks reduce duplicate and fraudulent
                  applications.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Wallet
                className="mt-1 h-5 w-5"
                style={{ color: "var(--brand-green)" }}
              />
              <div>
                <div className="text-sm font-semibold">Public balances</div>
                <p className="mt-1 text-sm text-black/65">
                  Pool balances and totals are visible. No black boxes.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users
                className="mt-1 h-5 w-5"
                style={{ color: "var(--brand-green)" }}
              />
              <div>
                <div className="text-sm font-semibold">Built for Nigeria</div>
                <p className="mt-1 text-sm text-black/65">
                  Naira-native, mobile-first, and tuned for low-bandwidth
                  networks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Final CTA */}
      <Container className="pb-16">
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-black/10 bg-white p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <div className="text-xl font-semibold tracking-tight">
              Ready to make a difference?
            </div>
            <p className="mt-1 text-sm text-black/65">
              Donate from ₦500, or apply for verified support today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--brand-green)" }}
            >
              Donate <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
            >
              View leaderboard
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
