import React from "react"
import { NextResponse } from "next/server"
import { Resend } from "resend"
import { EmailTemplate } from "@/components/email-template"

// Fail fast if required env vars are not present. This avoids attempting to call
// external services without proper configuration.
const RESEND_API_KEY = process.env.RESEND_API_KEY
const CONTACT_EMAIL = process.env.CONTACT_EMAIL
const SENDER_EMAIL = process.env.SENDER_EMAIL

if (!RESEND_API_KEY) {
  // Throw at module load so CI/deploy will fail fast instead of runtime surprises.
  throw new Error("Missing RESEND_API_KEY environment variable")
}

if (!CONTACT_EMAIL) {
  throw new Error("Missing CONTACT_EMAIL environment variable")
}

if (!SENDER_EMAIL) {
  throw new Error("Missing SENDER_EMAIL environment variable")
}

const resend = new Resend(RESEND_API_KEY)

function isNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const name = isNonEmptyString(body?.name) ? body.name.trim() : ""
    const email = isNonEmptyString(body?.email) ? body.email.trim() : ""
    const phone = isNonEmptyString(body?.phone) ? body.phone.trim() : undefined
    const message = isNonEmptyString(body?.message) ? body.message.trim() : ""

    // Validate required fields and basic email shape.
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    // Basic email format check (KISS): ensure there's an @ and a dot somewhere after it.
    const atIndex = email.indexOf("@")
    if (atIndex < 1 || email.indexOf(".", atIndex) === -1) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Build the React email template safely via React.createElement
    const reactElement = React.createElement(EmailTemplate, { name, email, phone, message })

    // Send the email. Keep logs minimal and avoid returning the full provider response
    // to the client to prevent leaking internal IDs or addresses.
    await resend.emails.send({
      from: `Luxury Estate <${SENDER_EMAIL!}>`,
      to: [CONTACT_EMAIL!],
      subject: `⚠️🏡 New Property Inquiry from ${name}`,
      react: reactElement,
    })

    // Return a generic success message.
    return NextResponse.json({ message: "Message received" }, { status: 200 })
  } catch (err) {
    // Log error server-side; don't leak internal errors to clients.
    console.error("[contact] error sending email:", err)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
