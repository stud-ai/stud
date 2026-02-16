import { NextRequest, NextResponse } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"
import { checkBotId } from "botid/server"
import { getSupabase } from "@/lib/supabase"

type ClerkError = {
    status?: number
    errors?: Array<{
        code?: string
        longMessage?: string
    }>
}

const existingCodes = new Set([
    "form_identifier_exists",
    "waitlist_entry_already_exists",
])

const mail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

const message = (v: unknown) => {
    const e = v as ClerkError
    return e.errors?.[0]?.longMessage || "Failed to join waitlist"
}

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
        const verify = await checkBotId()

        if (verify.isBot) {
            console.warn("[join-waitlist] BotID blocked request")
            return NextResponse.json({ error: "Request blocked" }, { status: 403 })
        }

        const { email, firstName, excitement } = await request.json()

        if (!email || typeof email !== "string") {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        const normalizedEmail = email.trim().toLowerCase()
        if (!mail(normalizedEmail)) {
            return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 })
        }
        const clerk = await clerkClient()

        // 1) Create in Clerk (server-side — no client SDK dependency)
        const alreadyExists = await (async () => {
            try {
                await clerk.waitlistEntries.create({
                    emailAddress: normalizedEmail,
                    notify: true,
                })
                return false
            } catch (err: unknown) {
                const e = err as ClerkError
                const code = e.errors?.[0]?.code

                if (!code || !existingCodes.has(code)) {
                    console.error("[join-waitlist] Clerk error:", JSON.stringify(e.errors || e))
                    throw new Error(message(err))
                }

                const list = await clerk.waitlistEntries.list({
                    query: normalizedEmail,
                    limit: 10,
                })

                const found = list.data.find((v) => v.emailAddress.toLowerCase() === normalizedEmail)
                if (!found) {
                    return true
                }

                if (found.status !== "rejected") {
                    return true
                }

                await clerk.waitlistEntries.delete(found.id)
                await clerk.waitlistEntries.create({
                    emailAddress: normalizedEmail,
                    notify: true,
                })
                return false
            }
        })().catch((err: unknown) => {
            const text = err instanceof Error ? err.message : "Failed to join waitlist"
            throw new Error(text)
        })

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
    } catch (err: unknown) {
        console.error("[join-waitlist] Unexpected error:", err)
        const text = err instanceof Error ? err.message : "Internal error"
        return NextResponse.json({ error: text }, { status: 500 })
    }
}
