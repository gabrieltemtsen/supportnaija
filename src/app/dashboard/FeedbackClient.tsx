"use client";

import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function FeedbackClient() {
  const rows = useQuery(api.feedback.listPublicApproved, { limit: 30 });
  const submit = useMutation(api.feedback.submit);

  const [message, setMessage] = useState("");
  const [recipientAliasId, setRecipientAliasId] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const canSend = useMemo(() => message.trim().length >= 5, [message]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!canSend) return;

    setStatus("sending");
    try {
      await submit({
        message,
        recipientAliasId: recipientAliasId.trim() ? recipientAliasId.trim() : undefined,
        isPublic: true,
      });
      setStatus("sent");
      setMessage("");
      setRecipientAliasId("");

      // Keep UX snappy: return to idle shortly.
      setTimeout(() => setStatus("idle"), 1800);
    } catch (err: any) {
      setStatus("error");
      setError(err?.message ?? "Failed to submit");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="text-sm font-semibold">Drop a goodwill message</h2>
        <p className="mt-1 text-sm text-black/70">
          This is moderated before it shows publicly.
        </p>

        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
          <label className="grid gap-1">
            <span className="text-xs text-black/60">
              Recipient Alias ID (optional)
            </span>
            <input
              value={recipientAliasId}
              onChange={(e) => setRecipientAliasId(e.target.value)}
              placeholder="e.g. SNJ-8F2K"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/25"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-black/60">Message</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message…"
              rows={4}
              className="w-full resize-none rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/25"
            />
            <span className="text-xs text-black/50">
              {Math.min(message.length, 500)}/500
            </span>
          </label>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={!canSend || status === "sending"}
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {status === "sending"
              ? "Submitting…"
              : status === "sent"
              ? "Submitted (pending approval)"
              : "Submit"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="text-sm font-semibold">Public goodwill messages</h2>
        <p className="mt-1 text-sm text-black/70">
          Approved messages only.
        </p>

        <div className="mt-4 grid gap-2">
          {!rows && <div className="text-sm text-black/60">Loading…</div>}
          {rows && rows.length === 0 && (
            <div className="text-sm text-black/60">
              No messages yet. Be the first.
            </div>
          )}
          {(rows ?? []).map((r: any) => (
            <div
              key={r._id}
              className="rounded-xl border border-black/5 bg-white px-4 py-3"
            >
              <div className="text-sm text-black/80">{r.message}</div>
              <div className="mt-1 text-xs text-black/50">
                {r.recipientAliasId ? `Recipient: ${r.recipientAliasId}` : ""}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
