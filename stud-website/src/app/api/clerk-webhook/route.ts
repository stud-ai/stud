import { NextRequest, NextResponse } from "next/server"
import { Webhook } from "svix"
import { getSupabase } from "@/lib/supabase"

// Clerk sends webhook events as JSON; we need the raw body for signature verification
export async function POST(request: NextRequest) {
    const secret = process.env.CLERK_WEBHOOK_SECRET
    if (!secret) {
        console.error("[clerk-webhook] Missing CLERK_WEBHOOK_SECRET")
        return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
    }

    // Get headers required for Svix verification
    const svixId = request.headers.get("svix-id")
    const svixTimestamp = request.headers.get("svix-timestamp")
    const svixSignature = request.headers.get("svix-signature")

    if (!svixId || !svixTimestamp || !svixSignature) {
        return NextResponse.json({ error: "Missing svix headers" }, { status: 400 })
    }

    const body = await request.text()

    // Verify the webhook signature
    let event: any
    try {
        const wh = new Webhook(secret)
        event = wh.verify(body, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature,
        })
    } catch (err) {
        console.error("[clerk-webhook] Signature verification failed:", err)
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Handle waitlist events
    const eventType = event.type as string
    const email = event.data?.email_address?.toLowerCase()

    if (!email) {
        console.log("[clerk-webhook] Ignoring event without email:", eventType)
        return NextResponse.json({ success: true }, { status: 200 })
    }

    if (eventType === "waitlistEntry.created") {
        // Insert into Supabase (ignore duplicates)
        const { error: dbError } = await getSupabase()
            .from("waitlist")
            .upsert({ email, status: "pending" }, { onConflict: "email" })

        if (dbError) {
            console.error("[clerk-webhook] Supabase insert error:", dbError)
            return NextResponse.json({ error: "Database error" }, { status: 500 })
        }

        console.log("[clerk-webhook] Waitlist entry synced:", email)
    }

    if (eventType === "waitlistEntry.updated") {
        const status = event.data?.status // "approved", "denied", etc.

        const { error: dbError } = await getSupabase()
            .from("waitlist")
            .update({ status })
            .eq("email", email)

        if (dbError) {
            console.error("[clerk-webhook] Supabase update error:", dbError)
            return NextResponse.json({ error: "Database error" }, { status: 500 })
        }

        console.log("[clerk-webhook] Waitlist status updated:", email, "→", status)
    }

    return NextResponse.json({ success: true }, { status: 200 })
}
