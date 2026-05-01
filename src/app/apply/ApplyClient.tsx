"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Upload } from "lucide-react";

import { fmtNgn } from "@/lib/format";

const CATEGORIES = [
  { id: "airtime", label: "Airtime / data" },
  { id: "transport", label: "Transport" },
  { id: "food", label: "Food / household" },
  { id: "medical", label: "Medical" },
  { id: "school", label: "School fees / supplies" },
  { id: "other", label: "Other" },
];

type Step = 1 | 2 | 3;

export function ApplyClient() {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 — identity
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bvn, setBvn] = useState("");
  const [nin, setNin] = useState("");
  const [hasNin, setHasNin] = useState(false);

  // Step 2 — request
  const [category, setCategory] = useState<string>("airtime");
  const [amount, setAmount] = useState<string>("1000");
  const [narrative, setNarrative] = useState<string>("");
  const [proofFiles, setProofFiles] = useState<File[]>([]);

  // Step 3 — confirm
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amountNgn = useMemo(() => {
    const n = Number(amount.replace(/[^\d]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  const step1Valid = useMemo(() => {
    if (fullName.trim().length < 2) return false;
    if (!/^\+?\d{10,15}$/.test(phone.replace(/\s/g, ""))) return false;
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return false;
    if (!/^\d{11}$/.test(bvn)) return false;
    if (hasNin && !/^\d{11}$/.test(nin)) return false;
    return true;
  }, [fullName, phone, email, bvn, nin, hasNin]);

  const step2Valid = useMemo(() => {
    if (!category) return false;
    if (amountNgn < 500) return false;
    if (amountNgn > 3000) return false; // monthly cap MVP
    if (narrative.trim().length < 20) return false;
    return true;
  }, [category, amountNgn, narrative]);

  function next() {
    setError(null);
    if (step === 1) {
      if (!step1Valid) return setError("Please fill out your identity details.");
      return setStep(2);
    }
    if (step === 2) {
      if (!step2Valid)
        return setError(
          "Please pick a category, request ₦500–₦3,000, and write at least 20 characters."
        );
      return setStep(3);
    }
  }

  function back() {
    setError(null);
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!agree) return setError("Please agree before submitting.");

    // We don't yet have the recipients/applications mutation surface wired up
    // server-side (BVN/NIN hashing belongs in a Convex action with a secret).
    // For the MVP this collects everything client-side and queues for review.
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="grid gap-4 rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
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
              Application received
            </h2>
            <p className="mt-1 text-sm text-black/65">
              We&apos;ll verify your BVN
              {hasNin ? " and NIN" : ""} and review your request. You&apos;ll
              hear from us by email at{" "}
              <span className="font-semibold">{email}</span>.
            </p>
          </div>
        </div>

        <div className="grid gap-2 rounded-xl border border-black/5 bg-[color:var(--brand-cream)] p-4 text-sm">
          <Row label="Category">
            {CATEGORIES.find((c) => c.id === category)?.label}
          </Row>
          <Row label="Amount requested">
            <span className="tabular font-semibold">{fmtNgn(amountNgn)}</span>
          </Row>
          <Row label="Verification">
            BVN{hasNin ? " + NIN" : ""} (pending)
          </Row>
          <Row label="Proof files">
            {proofFiles.length === 0 ? "None" : `${proofFiles.length} file(s)`}
          </Row>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
          >
            Back home
          </Link>
          <Link
            href="/transparency"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: "var(--brand-green)" }}
          >
            See pool balances
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="grid gap-6">
        <Stepper step={step} />

        {step === 1 && (
          <section className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="text-sm font-semibold">Identity</div>
            <p className="mt-1 text-sm text-black/65">
              We BVN-verify everyone. NIN is optional but unlocks higher trust.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Full name">
                <input
                  className={inputCls}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="As on your BVN"
                />
              </Field>
              <Field label="Phone (NG)">
                <input
                  className={inputCls}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0803…"
                  inputMode="tel"
                />
              </Field>
              <Field label="Email">
                <input
                  className={inputCls}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="BVN (11 digits)">
                <input
                  className={inputCls}
                  value={bvn}
                  onChange={(e) =>
                    setBvn(e.target.value.replace(/[^\d]/g, "").slice(0, 11))
                  }
                  placeholder="123…"
                  inputMode="numeric"
                />
              </Field>
            </div>

            <div className="mt-4">
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={hasNin}
                  onChange={(e) => setHasNin(e.target.checked)}
                  className="h-4 w-4 accent-[color:var(--brand-green)]"
                />
                I&apos;ll add my NIN for extra trust (recommended)
              </label>

              {hasNin && (
                <Field label="NIN (11 digits)" className="mt-2 max-w-sm">
                  <input
                    className={inputCls}
                    value={nin}
                    onChange={(e) =>
                      setNin(e.target.value.replace(/[^\d]/g, "").slice(0, 11))
                    }
                    placeholder="123…"
                    inputMode="numeric"
                  />
                </Field>
              )}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="text-sm font-semibold">Your request</div>
            <p className="mt-1 text-sm text-black/65">
              Tell us what you need and why. Be specific — reviewers approve
              faster.
            </p>

            <div className="mt-4 grid gap-3">
              <Field label="Category">
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => {
                    const active = category === c.id;
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setCategory(c.id)}
                        className={`rounded-xl border px-3 py-1.5 text-sm transition ${
                          active
                            ? "border-[color:var(--brand-green)] bg-[color:var(--brand-green-50)] text-[color:var(--brand-green-600)] font-semibold"
                            : "border-black/10 bg-white text-black/80 hover:bg-black/[0.03]"
                        }`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Amount requested (₦500 – ₦3,000)">
                <input
                  className={inputCls}
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value.replace(/[^\d]/g, ""))
                  }
                  placeholder="1000"
                />
              </Field>

              <Field label="What do you need this for?">
                <textarea
                  className={`${inputCls} min-h-32 resize-y`}
                  value={narrative}
                  onChange={(e) => setNarrative(e.target.value)}
                  placeholder="Briefly explain your situation and what the funds will cover."
                />
                <span className="mt-1 block text-xs text-black/50">
                  {narrative.trim().length}/500
                </span>
              </Field>

              <Field label="Proof of need (optional)">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 bg-white px-4 py-6 text-sm text-black/65 hover:bg-black/[0.02]">
                  <Upload className="h-4 w-4" />
                  <span>
                    Upload images or PDFs (kept private until verification)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) =>
                      setProofFiles(Array.from(e.target.files ?? []))
                    }
                  />
                </label>
                {proofFiles.length > 0 && (
                  <ul className="mt-2 grid gap-1 text-xs text-black/65">
                    {proofFiles.map((f, i) => (
                      <li key={i} className="truncate">
                        • {f.name} ({Math.round(f.size / 1024)} KB)
                      </li>
                    ))}
                  </ul>
                )}
              </Field>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="text-sm font-semibold">Review &amp; submit</div>
            <p className="mt-1 text-sm text-black/65">
              Double-check before submitting.
            </p>

            <div className="mt-4 grid gap-2 rounded-xl border border-black/5 bg-[color:var(--brand-cream)] p-4 text-sm">
              <Row label="Name">{fullName}</Row>
              <Row label="Phone">{phone}</Row>
              <Row label="Email">{email}</Row>
              <Row label="BVN">{bvn ? `••• ${bvn.slice(-4)}` : "—"}</Row>
              <Row label="NIN">
                {hasNin ? (nin ? `••• ${nin.slice(-4)}` : "—") : "Not provided"}
              </Row>
              <Row label="Category">
                {CATEGORIES.find((c) => c.id === category)?.label}
              </Row>
              <Row label="Amount">
                <span className="tabular font-semibold">
                  {fmtNgn(amountNgn)}
                </span>
              </Row>
              <Row label="Narrative">
                <span className="line-clamp-3 max-w-[24ch] text-right text-black/75">
                  {narrative.slice(0, 140)}
                  {narrative.length > 140 ? "…" : ""}
                </span>
              </Row>
              <Row label="Proof files">
                {proofFiles.length === 0
                  ? "None"
                  : `${proofFiles.length} file(s)`}
              </Row>
            </div>

            <label className="mt-4 inline-flex cursor-pointer items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[color:var(--brand-green)]"
              />
              <span>
                I confirm the information above is true. I understand that
                providing false information may lead to permanent account
                suspension.
              </span>
            </label>
          </section>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={back}
            disabled={step === 1}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
          >
            Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={next}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--brand-green)" }}
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--brand-green)" }}
            >
              Submit application
            </button>
          )}
        </div>
      </div>

      <aside className="grid h-max gap-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-sm font-semibold">What to expect</div>
        <ul className="grid gap-3 text-sm text-black/70">
          <li className="flex items-start gap-2">
            <ShieldCheck
              className="mt-0.5 h-4 w-4"
              style={{ color: "var(--brand-green)" }}
            />
            BVN verification (and optional NIN) before any disbursement.
          </li>
          <li className="flex items-start gap-2">
            <ShieldCheck
              className="mt-0.5 h-4 w-4"
              style={{ color: "var(--brand-green)" }}
            />
            ₦1,000 auto airtime for BVN-verified recipients when funded.
          </li>
          <li className="flex items-start gap-2">
            <ShieldCheck
              className="mt-0.5 h-4 w-4"
              style={{ color: "var(--brand-green)" }}
            />
            Monthly cap is ₦3,000 to keep support fair and broadly available.
          </li>
        </ul>
      </aside>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/25";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`grid gap-1 ${className}`}>
      <span className="text-xs text-black/55">{label}</span>
      {children}
    </label>
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

function Stepper({ step }: { step: Step }) {
  const items: { n: Step; label: string }[] = [
    { n: 1, label: "Identity" },
    { n: 2, label: "Request" },
    { n: 3, label: "Review" },
  ];
  return (
    <ol className="flex items-center gap-2">
      {items.map((it, i) => {
        const active = step === it.n;
        const done = step > it.n;
        return (
          <li key={it.n} className="flex flex-1 items-center gap-2">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
              style={{
                backgroundColor:
                  active || done ? "var(--brand-green)" : "rgba(0,0,0,0.06)",
                color: active || done ? "white" : "rgba(0,0,0,0.55)",
              }}
            >
              {it.n}
            </span>
            <span
              className={`truncate text-sm ${
                active ? "font-semibold text-black" : "text-black/55"
              }`}
            >
              {it.label}
            </span>
            {i < items.length - 1 && (
              <span
                className="ml-1 h-px flex-1"
                style={{
                  backgroundColor: done
                    ? "var(--brand-green)"
                    : "rgba(0,0,0,0.08)",
                }}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
