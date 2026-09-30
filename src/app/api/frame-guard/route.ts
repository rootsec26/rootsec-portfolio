import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export type FramePolicyStatus = "embeddable" | "blocked" | "unknown";

export interface FramePolicy {
  status: FramePolicyStatus;
  reason: string;
}

const CACHE_TTL_MS = 10 * 60 * 1000;
const FETCH_TIMEOUT_MS = 4000;

const policyCache = new Map<string, { policy: FramePolicy; storedAt: number }>();

const PRIVATE_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "[::1]",
  "::1",
]);

const PRIVATE_IPV4 =
  /^(10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/;

function resolveTarget(raw: string | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > 2048) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    return null;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;

  const host = parsed.hostname.toLowerCase();
  if (PRIVATE_HOSTNAMES.has(host)) return null;
  if (PRIVATE_IPV4.test(host)) return null;
  if (host.endsWith(".local") || host.endsWith(".internal") || host.endsWith(".lan")) {
    return null;
  }

  return parsed.toString();
}

/**
 * Turns the response framing headers into an embeddability decision.
 * Cross-origin embeds are refused by `X-Frame-Options` and by the
 * `frame-ancestors` CSP directive, so a DENY / SAMEORIGIN / 'self'
 * policy all mean "show the fallback instead of a blank frame".
 */
function evaluatePolicy(headers: Headers): FramePolicy {
  const xFrameOptions = headers.get("x-frame-options");
  if (xFrameOptions) {
    const value = xFrameOptions.toLowerCase();
    if (value.includes("deny")) {
      return { status: "blocked", reason: "X-Frame-Options: DENY refuses all embedding." };
    }
    if (value.includes("sameorigin") || value.includes("allow-from")) {
      return {
        status: "blocked",
        reason: `X-Frame-Options: ${xFrameOptions} only allows the site's own origin.`,
      };
    }
  }

  const csp = headers.get("content-security-policy");
  if (csp) {
    const match = csp.match(/frame-ancestors\s+([^;]*)/i);
    if (match) {
      const directives = match[1].trim();
      if (!directives) {
        return { status: "blocked", reason: "Content-Security-Policy frame-ancestors is empty." };
      }
      if (directives.includes("'none'")) {
        return { status: "blocked", reason: "frame-ancestors 'none' blocks every embed." };
      }
      if (directives.includes("'self'") || !directives.includes("*")) {
        return {
          status: "blocked",
          reason: "frame-ancestors only allows approved parent origins.",
        };
      }
    }
  }

  return { status: "embeddable", reason: "No framing restrictions detected." };
}

export async function GET(request: Request) {
  const target = resolveTarget(new URL(request.url).searchParams.get("url"));

  if (!target) {
    return NextResponse.json(
      { status: "unknown", reason: "Invalid preview URL." } satisfies FramePolicy,
      { status: 400 }
    );
  }

  const cached = policyCache.get(target);
  if (cached && Date.now() - cached.storedAt < CACHE_TTL_MS) {
    return NextResponse.json(cached.policy);
  }

  try {
    const response = await fetch(target, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; portfolio-frame-guard/1.0; +https://github.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    const policy = evaluatePolicy(response.headers);
    policyCache.set(target, { policy, storedAt: Date.now() });
    return NextResponse.json(policy);
  } catch {
    const policy: FramePolicy = {
      status: "unknown",
      reason: "Embedding policy could not be verified — the frame will be probed live.",
    };
    return NextResponse.json(policy);
  }
}
