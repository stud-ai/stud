import { NextRequest, NextResponse } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"
import { getSupabase } from "@/lib/supabase"

/**
 * Server-side waitlist endpoint.
 * Creates the entry in Clerk (which triggers the confirmation email)
 * and upserts metadata to Supabase — all in one request.
 *
 * This replaces the old client-side clerk.joinWaitlist() flow which
 * was unreliable due to CORS / SDK loading issues on custom domains.
 */
export async function POST(request: NextRequest) {
    try {
        const { email, firstName, excitement } = await request.json()

        if (!email || typeof email !== "string") {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        const normalizedEmail = email.trim().toLowerCase()

        // 1) Create in Clerk (server-side — no client SDK dependency)
        let alreadyExists = false
        try {
            const clerk = await clerkClient()
            await clerk.waitlistEntries.create({
                emailAddress: normalizedEmail,
                notify: true,
            })
        } catch (err: any) {
            const code = err?.errors?.[0]?.code
            const status = err?.status

            // Clerk returns 422 with specific codes when the email already exists
            if (
                code === "form_identifier_exists" ||
                code === "waitlist_entry_already_exists" ||
                status === 422
            ) {
                alreadyExists = true
            } else {
                console.error("[join-waitlist] Clerk error:", JSON.stringify(err?.errors || err))
                return NextResponse.json(
                    { error: err?.errors?.[0]?.longMessage || "Failed to join waitlist" },
                    { status: 500 }
                )
            }
        }

        // 2) Upsert to Supabase (name, excitement, status)
        try {
            const upsertData: Record<string, string> = {
                email: normalizedEmail,
                status: "pending",
            }
            if (firstName?.trim()) upsertData.first_name = firstName.trim()
            if (excitement?.trim()) upsertData.excitement = excitement.trim()

            const { error: dbError } = await getSupabase()
                .from("waitlist")
                .upsert(upsertData, { onConflict: "email" })

            if (dbError) {
                console.error("[join-waitlist] Supabase error:", dbError)
                // Non-fatal — Clerk entry was already created
            }
        } catch (dbErr) {
            console.error("[join-waitlist] Supabase exception:", dbErr)
        }

        return NextResponse.json({
            success: true,
            alreadyExists,
        })
    } catch (err) {
        console.error("[join-waitlist] Unexpected error:", err)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}
