/**
 * Contact form email endpoint.
 *
 * POST /api/contact
 * Body: { "name": string, "email": string, "subject": string, "message": string }
 *
 * Sends an email to RESEND_SMTP_TO (info@vinayone.com) via Resend SMTP.
 * From: RESEND_SMTP_FROM (info@vinayone.com, must be verified on vinayone.com).
 * Reply-To: the form submitter's email so Vinay can reply directly.
 *
 * Configured via env (set in Coolify app config, NOT in source):
 *   RESEND_SMTP_HOST    (default: smtp.resend.com)
 *   RESEND_SMTP_PORT    (default: 587)
 *   RESEND_SMTP_USER    (default: resend)
 *   RESEND_SMTP_PASSWORD
 *   RESEND_SMTP_FROM
 *   RESEND_SMTP_TO
 *
 * Anti-abuse: simple in-memory rate limit (per-process, per-IP).
 * For production, swap for Redis/Upstash.
 */

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs"; // nodemailer needs Node.js (not Edge)

// ----- In-memory rate limiter -----
const RATE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_MAX = 3; // max 3 submissions per IP per window
const rateMap = new Map<string, number[]>();

function rateLimitOk(ip: string): { ok: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const arr = (rateMap.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_MAX) {
    const oldest = arr[0];
    return {
      ok: false,
      retryAfterSec: Math.ceil((RATE_WINDOW_MS - (now - oldest)) / 1000),
    };
  }
  arr.push(now);
  rateMap.set(ip, arr);
  return { ok: true };
}

// ----- Input validation -----
interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function validate(body: unknown): { ok: true; data: ContactInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body" };
  }
  const b = body as Record<string, unknown>;
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const subject = typeof b.subject === "string" ? b.subject.trim() : "";
  const message = typeof b.message === "string" ? b.message.trim() : "";

  if (!name) return { ok: false, error: "नाम आवश्यक है।" };
  if (name.length > 120) return { ok: false, error: "नाम बहुत लंबा है।" };
  if (!email) return { ok: false, error: "ईमेल आवश्यक है।" };
  if (email.length > 200) return { ok: false, error: "ईमेल बहुत लंबा है।" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "मान्य ईमेल पता दर्ज करें।" };
  }
  if (subject.length > 200) return { ok: false, error: "विषय बहुत लंबा है।" };
  if (!message) return { ok: false, error: "संदेश आवश्यक है।" };
  if (message.length > 4000) return { ok: false, error: "संदेश बहुत लंबा है (4000 वर्ण अधिकतम)।" };

  return {
    ok: true,
    data: { name, email, subject, message },
  };
}

// ----- HTML escape for the email body -----
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailHtml(input: ContactInput): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://khabarxp.in";
  const submittedAt = new Date().toLocaleString("hi-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "long",
    timeStyle: "short",
  });
  const subjectLine = input.subject
    ? `🔔 [Contact] ${input.subject}`
    : `🔔 [Contact] New message from ${input.name}`;
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${escapeHtml(subjectLine)}</title></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <tr>
          <td style="background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);padding:24px;color:#fff;">
            <div style="font-size:24px;font-weight:800;line-height:1;">खबर एक्सपी</div>
            <div style="font-size:14px;opacity:0.9;margin-top:4px;">New contact form submission</div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px;">
            <h2 style="margin:0 0 16px;font-size:18px;color:#18181b;">${escapeHtml(input.subject || "New contact message")}</h2>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#27272a;">
              <tr><td style="padding:6px 0;width:80px;color:#71717a;font-weight:600;">From</td><td style="padding:6px 0;"><strong>${escapeHtml(input.name)}</strong> &lt;<a href="mailto:${escapeHtml(input.email)}" style="color:#dc2626;">${escapeHtml(input.email)}</a>&gt;</td></tr>
              <tr><td style="padding:6px 0;color:#71717a;font-weight:600;">Subject</td><td style="padding:6px 0;">${escapeHtml(input.subject || "—")}</td></tr>
              <tr><td style="padding:6px 0;color:#71717a;font-weight:600;">Date</td><td style="padding:6px 0;">${escapeHtml(submittedAt)} IST</td></tr>
              <tr><td style="padding:6px 0;color:#71717a;font-weight:600;">Site</td><td style="padding:6px 0;"><a href="${site}" style="color:#dc2626;">${site}</a></td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #e4e4e7;margin:20px 0;">
            <div style="font-size:15px;line-height:1.6;color:#18181b;white-space:pre-wrap;">${escapeHtml(input.message)}</div>
            <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0 12px;">
            <p style="font-size:12px;color:#71717a;margin:0;">Reply directly to this email — your reply will go to ${escapeHtml(input.email)}.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

function buildEmailText(input: ContactInput): string {
  const subjectLine = input.subject
    ? `[Contact] ${input.subject}`
    : `[Contact] New message from ${input.name}`;
  return [
    `खबर एक्सपी — ${subjectLine}`,
    "",
    `From:    ${input.name} <${input.email}>`,
    `Subject: ${input.subject || "—"}`,
    `Date:    ${new Date().toISOString()}`,
    `Site:    ${process.env.NEXT_PUBLIC_SITE_URL || "https://khabarxp.in"}`,
    "",
    "----- Message -----",
    input.message,
    "",
    "----- End -----",
    "Reply to this email to respond to the sender directly.",
  ].join("\n");
}

// ----- Handler -----
export async function POST(req: Request) {
  // 1. IP-based rate limit
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const rl = rateLimitOk(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: `बहुत अधिक प्रयास। ${rl.retryAfterSec ?? 60} सेकंड बाद पुनः प्रयास करें।` },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSec ?? 60) },
      }
    );
  }

  // 2. Parse and validate
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const v = validate(body);
  if (!v.ok) {
    return NextResponse.json({ ok: false, error: v.error }, { status: 400 });
  }
  const input = v.data;

  // 3. SMTP config
  const host = process.env.RESEND_SMTP_HOST || "smtp.resend.com";
  const port = Number(process.env.RESEND_SMTP_PORT || 587);
  const user = process.env.RESEND_SMTP_USER || "resend";
  const pass = process.env.RESEND_SMTP_PASSWORD;
  const fromAddr = process.env.RESEND_SMTP_FROM;
  const toAddr = process.env.RESEND_SMTP_TO;

  if (!pass || !fromAddr || !toAddr) {
    console.error("[contact] SMTP env missing", {
      hasPass: !!pass,
      hasFrom: !!fromAddr,
      hasTo: !!toAddr,
    });
    return NextResponse.json(
      { ok: false, error: "सर्वर कॉन्फ़िगरेशन त्रुटि — कृपया बाद में पुनः प्रयास करें।" },
      { status: 500 }
    );
  }

  // 4. Send
  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 = SSL, 587 = STARTTLS
      auth: { user, pass },
      // Don't fail on self-signed certs in dev (Resend is properly signed).
      tls: { rejectUnauthorized: true },
    });

    const subjectLine = input.subject
      ? `[Contact] ${input.subject}`
      : `[Contact] New message from ${input.name}`;

    const info = await transporter.sendMail({
      from: `"Khabar Xpress — Contact" <${fromAddr}>`,
      to: toAddr,
      replyTo: `${input.name} <${input.email}>`,
      subject: subjectLine,
      text: buildEmailText(input),
      html: buildEmailHtml(input),
    });

    console.log("[contact] Email sent", { messageId: info.messageId, ip });
    return NextResponse.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[contact] SMTP send failed", { err: msg, ip });
    return NextResponse.json(
      {
        ok: false,
        error:
          "ईमेल भेजने में विफल — कृपया बाद में पुनः प्रयास करें, या सीधे info@vinayone.com पर लिखें।",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } }
  );
}
