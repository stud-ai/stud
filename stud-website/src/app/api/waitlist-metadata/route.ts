import { NextRequest, NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"

// Called from the client after successful Clerk joinWaitlist
// to sync first_name and excitement to Supabase
export async function POST(request: NextRequest) {
    try {
        const { email, firstName, excitement } = await request.json()

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 })
        }

        const updateData: Record<string, string> = {}
        if (firstName) updateData.first_name = firstName
        if (excitement) updateData.excitement = excitement

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ success: true })
        }

        // Upsert — if webhook hasn't fired yet, insert the row; otherwise update it
        const { error: dbError } = await getSupabase()
            .from("waitlist")
            .upsert(
                { email: email.toLowerCase(), ...updateData },
                { onConflict: "email" }
            )

        if (dbError) {
            console.error("[waitlist-metadata] Supabase error:", dbError)
            return NextResponse.json({ error: "Database error" }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error("[waitlist-metadata] Error:", err)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}
