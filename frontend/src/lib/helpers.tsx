import { Badge } from "../components/ui/badge";
import React from "react";

/* ── Signing-link builder ──────────────────────────────────────── */

/**
 * Build a full signing-page URL for a given token.
 * Centralised so the pattern is defined in exactly one place.
 */
export function buildSigningLink(token: string): string {
  return `${window.location.origin}/sign/${token}`;
}

/* ── Status badge ──────────────────────────────────────────────── */

/**
 * Consistent document-status badge used across Dashboard, Documents
 * and any other page that displays a document's lifecycle state.
 */
export function getStatusBadge(status: string): React.ReactNode {
  switch (status) {
    case "signed":
      return (
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200">
          Signed
        </Badge>
      );
    case "sent":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">
          Sent
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100">
          Draft
        </Badge>
      );
  }
}

/* ── Envelope lookup ───────────────────────────────────────────── */

export interface EnvelopeRef {
  _id: string;
  documentId: string;
  status: string;
  signingToken: string;
  signerEmail: string;
}

/**
 * Find the most recent envelope for a document (last in insertion order).
 */
export function getEnvelopeForDoc(
  envelopes: EnvelopeRef[],
  documentId: string
): EnvelopeRef | undefined {
  return [...envelopes].reverse().find((e) => e.documentId === documentId);
}
