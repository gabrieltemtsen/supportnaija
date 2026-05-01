"use client";

import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { MessageCircle, Send, ShieldCheck } from "lucide-react";

import { api } from "../../../convex/_generated/api";

type Msg = {
  _id: string;
  message: string;
  recipientAliasId?: string;
};

export function FeedbackClient() {
  const rows = useQuery(api.feedback.listPublicApproved, { limit: 30 }) as
    | Msg[]
    | undefined;
  const submit = useMutation(api.feedback.submit);

  const [message, setMessage] = useState("");
  const [recipientAliasId, setRecipientAliasId] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const canSend = useMemo(
    () => message.trim().length >= 5 && message.trim().length <= 500,
    [message]
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!canSend) return;

    setStatus("sending");
    try {
      await submit({
        message,
        recipientAliasId: recipientAliasId.trim()
          ? recipientAliasId.trim()
          : undefined,
        isPublic: true,
      });
      setStatus("sent");
      setMessage("");
      setRecipientAliasId("");
      setTimeout(() => setStatus("idle"), 1800);
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to submit");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2">
          <Send className="h-4 w-4" style={{ color: "var(--brand-green)" }} />
          <h2 className="text-sm font-semibold">Drop a goodwill message</h2>
        </div>
        <p className="mt-1 text-sm text-black/65">
          Moderated before it shows publicly. Optionally tag a recipient by
          alias.
        </p>

        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
          <label className="grid gap-1">
            <span className="text-xs text-black/55">
              Recipient alias ID (optional)
            </span>
            <input
              value={recipientAliasId}
              onChange={(e) => setRecipientAliasId(e.target.value)}
              placeholder="e.g. SNJ-8F2K"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/25"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-black/55">Message</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 500))}
              placeholder="Your message…"
              rows={4}
              className="w-full resize-none rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/25"
            />
            <span className="text-xs text-black/45">
              {Math.min(message.length, 500)}/500
            </span>
          </label>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSend || status === "sending"}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: "var(--brand-green)" }}
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
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-black/65" />
          <h2 className="text-sm font-semibold">Public goodwill messages</h2>
        </div>
        <p className="mt-1 text-sm text-black/65">
          Approved messages only.
        </p>

        <div className="mt-4 grid gap-2">
          {!rows && (
            <div className="grid gap-2">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-xl bg-black/[0.04]"
                />
              ))}
            </div>
          )}
          {rows && rows.length === 0 && (
            <div className="rounded-xl border border-dashed border-black/15 p-4 text-sm text-black/55">
              No messages yet. Be the first.
            </div>
          )}
          {(rows ?? []).map((r) => (
            <article
              key={r._id}
              className="rounded-xl border border-black/5 bg-white px-4 py-3"
            >
              <p className="text-sm text-black/85">{r.message}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-black/50">
                <ShieldCheck className="h-3 w-3" />
                <span>Moderated</span>
                {r.recipientAliasId && (
                  <span>· To {r.recipientAliasId}</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
