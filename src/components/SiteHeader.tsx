"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/donate", label: "Donate" },
  { href: "/apply", label: "Apply" },
  { href: "/dashboard", label: "Leaderboard" },
  { href: "/transparency", label: "Transparency" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm"
            style={{ backgroundColor: "var(--brand-green)" }}
          >
            <span className="text-sm font-bold tracking-tight">SN</span>
          </span>
          <span className="text-base font-semibold tracking-tight">
            SupportNaija
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-black/5 font-semibold text-black"
                    : "text-black/70 hover:bg-black/5 hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/donate"
            className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            style={{ backgroundColor: "var(--brand-green)" }}
          >
            Donate
          </Link>
        </div>

        <button
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-black/5 bg-white md:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-3">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? "bg-black/5 font-semibold text-black"
                      : "text-black/70 hover:bg-black/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/donate"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--brand-green)" }}
            >
              Donate now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
