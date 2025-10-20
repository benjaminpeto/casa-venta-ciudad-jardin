"use server";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,     // e.g. "Luxury Estate <no-reply@example.com>"
  CONTACT_EMAIL, // where inquiries should land
} = process.env;

function isNonEmptyString(v: unknown) {
  return typeof v === "string" && v.trim().length > 0;
}

function basicEmailLooksOk(email: string) {
  const at = email.indexOf("@");
  return at > 0 && email.indexOf(".", at + 2) > 0;
}

function buildTransport() {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_FROM || !CONTACT_EMAIL) return null;

  const port = Number(SMTP_PORT);
  const secure = port === 465; // common convention; adjust if needed

  // If SMTP_USER/PASS are missing, attempt unauthenticated (some ISP relays allow this on LAN/VPN).
  const auth =
    SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure,
    auth,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    // Honeypot field—add a hidden input named "company" on the form; bots will fill it.
    const botTrap = typeof body?.company === "string" && body.company.trim() !== "";
    if (botTrap) {
      // Pretend success to not tip bots off.
      return NextResponse.json({ message: "Message received" }, { status: 200 });
    }

    const name = isNonEmptyString(body?.name) ? body.name.trim() : "";
    const email = isNonEmptyString(body?.email) ? body.email.trim() : "";
    const phone = isNonEmptyString(body?.phone) ? body.phone.trim() : undefined;
    const message = isNonEmptyString(body?.message) ? body.message.trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }
    if (!basicEmailLooksOk(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const transporter = buildTransport();
    if (!transporter) {
      // Don’t crash the app; return a clear 503 so the client can show a friendly toast.
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }

    const subject = `New Property Inquiry from ${name}`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h1 style="color:#000;border-bottom:2px solid #000;padding-bottom:10px">New Property Inquiry</h1>
        <div style="margin-top:20px">
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
          <p><strong>Message:</strong></p>
          <pre style="white-space:pre-wrap;padding:15px;background:#f5f5f5;border-left:4px solid #000">${escapeHtml(
            message
          )}</pre>
        </div>
        <div style="margin-top:30px;padding-top:20px;border-top:1px solid #e5e5e5;color:#666;font-size:12px">
          <p>This inquiry was submitted through your luxury property landing page.</p>
        </div>
      </div>
    `.trim();

    const text = [
      "New Property Inquiry",
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      "",
      "Message:",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    await transporter.sendMail({
      from: SMTP_FROM!,
      to: CONTACT_EMAIL!,
      subject,
      replyTo: email, // convenient for hitting "Reply"
      text,
      html,
    });

    return NextResponse.json({ message: "Message received" }, { status: 200 });
  } catch (err) {
    console.error("[contact] email send failed:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

// Simple HTML escaper to avoid HTML injection in the email body
function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
