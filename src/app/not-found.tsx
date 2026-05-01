import Link from "next/link";

import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <main className="py-20">
      <Container>
        <div className="mx-auto max-w-md rounded-3xl border border-black/10 bg-white p-8 text-center">
          <div
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-white"
            style={{ backgroundColor: "var(--brand-green)" }}
          >
            <span className="text-lg font-bold">404</span>
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Page not found
          </h1>
          <p className="mt-2 text-sm text-black/65">
            We couldn&apos;t find what you were looking for. The page may have
            moved or never existed.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--brand-green)" }}
            >
              Back home
            </Link>
            <Link
              href="/donate"
              className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/5"
            >
              Donate
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
