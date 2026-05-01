import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-black/5 bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: "var(--brand-green)" }}
            >
              <span className="text-sm font-bold tracking-tight">SN</span>
            </span>
            <span className="text-base font-semibold tracking-tight">
              SupportNaija
            </span>
          </div>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-black/65">
            Transparent support for Nigerians. Donate from ₦500. Beneficiaries
            are BVN-verified, pool balances are public, and disbursements are
            tracked.
          </p>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-black/50">
            Product
          </div>
          <ul className="mt-3 grid gap-2 text-sm">
            <li>
              <Link href="/donate" className="text-black/70 hover:text-black">
                Donate
              </Link>
            </li>
            <li>
              <Link href="/apply" className="text-black/70 hover:text-black">
                Apply for support
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="text-black/70 hover:text-black">
                Leaderboard
              </Link>
            </li>
            <li>
              <Link
                href="/transparency"
                className="text-black/70 hover:text-black"
              >
                Transparency
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-black/50">
            Trust
          </div>
          <ul className="mt-3 grid gap-2 text-sm">
            <li className="text-black/70">BVN-first verification</li>
            <li className="text-black/70">Optional NIN for extra trust</li>
            <li className="text-black/70">Public pool balances</li>
            <li className="text-black/70">Anonymous giving supported</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-black/5">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-2 px-4 py-4 text-xs text-black/55 sm:flex-row sm:items-center">
          <div>© {year} SupportNaija. Built for transparency.</div>
          <div className="flex items-center gap-4">
            <span>Made in Nigeria 🇳🇬</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
