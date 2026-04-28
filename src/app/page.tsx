import { ArrowRight, ShieldCheck, Wallet, Zap } from "lucide-react";
import Link from "next/link";

const NIGERIA_GREEN = "#008753";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white/70 px-4 py-3 backdrop-blur">
      <div className="text-xl font-semibold tracking-tight">{value}</div>
      <div className="text-xs text-black/60">{label}</div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-0px)] bg-white text-black">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            background:
              "radial-gradient(circle at 20% 15%, rgba(0,135,83,0.35), transparent 40%), radial-gradient(circle at 80% 30%, rgba(0,135,83,0.25), transparent 35%), radial-gradient(circle at 50% 90%, rgba(0,135,83,0.18), transparent 45%)",
          }}
        />
        <div className="absolute inset-x-0 top-[-120px] mx-auto h-[260px] w-[1100px] max-w-[94vw] rounded-full bg-[linear-gradient(90deg,rgba(0,135,83,0.22),rgba(255,255,255,0.0),rgba(0,135,83,0.22))] blur-3xl" />
      </div>

      {/* Header */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-xl"
            style={{ backgroundColor: NIGERIA_GREEN }}
          />
          <div className="font-semibold tracking-tight">SupportNaija</div>
        </div>
        <nav className="flex items-center gap-2">
          <Link
            href="/donate"
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
          >
            Donate
          </Link>
          <Link
            href="/apply"
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-black/5"
          >
            Apply for support
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/70">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: NIGERIA_GREEN }}
              />
              Transparent support for Nigerians — mobile-first.
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Support Naija.
              <span className="block text-black/70">
                Verified help, public balances, optional anonymous giving.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-black/70">
              Donate from ₦500. Beneficiaries are BVN-verified (with optional NIN for
              extra protection). Pool balances are visible, disbursements are tracked,
              and we keep things simple.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90"
              >
                Donate now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/transparency"
                className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
              >
                View transparency
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <Stat label="Min donation" value="₦500" />
              <Stat label="Auto airtime (BVN)" value="₦1,000" />
              <Stat label="Monthly cap" value="₦3,000" />
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white/70 p-6 backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/5 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Wallet className="h-4 w-4" style={{ color: NIGERIA_GREEN }} />
                  Donations
                </div>
                <p className="mt-2 text-sm text-black/70">
                  One-time or recurring. Donate publicly or get an Anonymous ID.
                </p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck className="h-4 w-4" style={{ color: NIGERIA_GREEN }} />
                  Verification
                </div>
                <p className="mt-2 text-sm text-black/70">
                  BVN-first verification to reduce fraud. Optional NIN for extra trust.
                </p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Zap className="h-4 w-4" style={{ color: NIGERIA_GREEN }} />
                  Fast support
                </div>
                <p className="mt-2 text-sm text-black/70">
                  Auto-approve ₦1,000 airtime for BVN-verified recipients when funded.
                </p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck className="h-4 w-4" style={{ color: NIGERIA_GREEN }} />
                  NGO pools
                </div>
                <p className="mt-2 text-sm text-black/70">
                  NGOs can create pools and choose NGO-controlled or platform-controlled approvals.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[linear-gradient(90deg,rgba(0,135,83,0.12),rgba(0,135,83,0.02))] p-4">
              <div className="text-sm font-semibold">SEO-ready from day one</div>
              <p className="mt-1 text-sm text-black/70">
                Proper metadata, OpenGraph, fast mobile performance, and clean, indexable pool pages.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto w-full max-w-6xl px-4 pb-10 text-xs text-black/60">
        © {new Date().getFullYear()} SupportNaija. Built for transparency.
      </footer>
    </main>
  );
}
