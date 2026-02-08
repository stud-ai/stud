import { NextRequest, NextResponse } from "next/server"
import { validate } from "deep-email-validator"
import { Resend } from "resend"
import { getSupabase } from "@/lib/supabase"
import { renderWaitlistEmail } from "@/components/emails/waitlist-confirmation"

export async function POST(request: NextRequest) {
  let body: { email?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    )
  }

  const email = body.email?.trim().toLowerCase()
  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 }
    )
  }

  // Deep email validation (SMTP disabled — port 25 blocked on Vercel)
  const validation = await validate({
    email,
    validateRegex: true,
    validateMx: true,
    validateTypo: true,
    validateDisposable: true,
    validateSMTP: false,
  })

  if (!validation.valid) {
    const messages: Record<string, string> = {
      regex: "That doesn't look like a valid email address.",
      typo: "Did you mean a different email? Check for typos.",
      disposable: "Please use a permanent email address.",
      mx: "We couldn't verify that email domain. Check for typos.",
    }
    const reason = validation.reason ?? "regex"
    return NextResponse.json(
      { error: messages[reason] ?? "Invalid email address." },
      { status: 422 }
    )
  }

  // Geo metadata from Vercel headers
  const metadata = {
    country: request.headers.get("x-vercel-ip-country"),
    city: request.headers.get("x-vercel-ip-city"),
    region: request.headers.get("x-vercel-ip-region"),
    timezone: request.headers.get("x-vercel-ip-timezone"),
    user_agent: request.headers.get("user-agent"),
    referrer: request.headers.get("referer"),
  }

  // Insert into Supabase
  const { error: dbError } = await getSupabase()
    .from("waitlist")
    .insert({ email, ...metadata })

  if (dbError) {
    if (dbError.code === "23505") {
      return NextResponse.json(
        { error: "You're already on the waitlist!" },
        { status: 409 }
      )
    }
    console.error("[waitlist] Supabase insert error:", dbError)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }

  // Send confirmation email (fire-and-forget)
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!)
    await resend.emails.send({
      from: "Stud <onboarding@resend.dev>",
      to: [email],
      subject: "You're on the Stud waitlist",
      html: renderWaitlistEmail(email),
    })
  } catch (emailError) {
    console.error("[waitlist] Resend email error:", emailError)
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
