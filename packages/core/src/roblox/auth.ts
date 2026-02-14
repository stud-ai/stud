/**
 * Roblox Authentication
 *
 * Handles authentication for Roblox APIs:
 * 1. Cookie-based auth for Toolbox API (requires .ROBLOSECURITY)
 * 2. User info validation
 */

import { Global } from "@/global"
import path from "path"
import fs from "fs/promises"
import z from "zod"

const AUTH_FILE = "roblox-auth.json"

export namespace RobloxAuth {
  export const Info = z
    .object({
      cookie: z.string().describe("The .ROBLOSECURITY cookie value"),
      userId: z.number().optional(),
      username: z.string().optional(),
      displayName: z.string().optional(),
      validated: z.number().optional().describe("Timestamp when cookie was last validated"),
    })
    .meta({ ref: "RobloxAuth" })

  export type Info = z.infer<typeof Info>

  const filepath = () => path.join(Global.Path.data, AUTH_FILE)

  /**
   * Get stored Roblox authentication
   */
  export async function get(): Promise<Info | null> {
    try {
      const file = Bun.file(filepath())
      const data = await file.json()
      const parsed = Info.safeParse(data)
      if (!parsed.success) return null
      return parsed.data
    } catch {
      return null
    }
  }

  /**
   * Store Roblox authentication
   */
  export async function set(info: Info): Promise<void> {
    const file = Bun.file(filepath())
    await Bun.write(file, JSON.stringify(info, null, 2))
    await fs.chmod(file.name!, 0o600) // Restrict permissions
  }

  /**
   * Remove stored authentication
   */
  export async function remove(): Promise<void> {
    try {
      await fs.unlink(filepath())
    } catch {
      // File doesn't exist, ignore
    }
  }

  /**
   * Validate a .ROBLOSECURITY cookie by fetching user info
   */
  export async function validate(
    cookie: string,
  ): Promise<{ valid: true; userId: number; username: string; displayName: string } | { valid: false; error: string }> {
    try {
      const response = await fetch("https://users.roblox.com/v1/users/authenticated", {
        headers: {
          Cookie: `.ROBLOSECURITY=${cookie}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          return { valid: false, error: "Invalid or expired cookie" }
        }
        return { valid: false, error: `HTTP ${response.status}: ${response.statusText}` }
      }

      const data = (await response.json()) as { id: number; name: string; displayName: string }
      return {
        valid: true,
        userId: data.id,
        username: data.name,
        displayName: data.displayName,
      }
    } catch (e) {
      return { valid: false, error: e instanceof Error ? e.message : String(e) }
    }
  }

  /**
   * Get the cookie for API requests, or null if not authenticated
   */
  export async function getCookie(): Promise<string | null> {
    const auth = await get()
    if (!auth) return null

    // Re-validate if older than 1 hour
    const oneHour = 60 * 60 * 1000
    if (!auth.validated || Date.now() - auth.validated > oneHour) {
      const result = await validate(auth.cookie)
      if (!result.valid) {
        // Cookie expired, remove it
        await remove()
        return null
      }
      // Update validation timestamp
      await set({
        ...auth,
        userId: result.userId,
        username: result.username,
        displayName: result.displayName,
        validated: Date.now(),
      })
    }

    return auth.cookie
  }

  /**
   * Check if user is authenticated
   */
  export async function isAuthenticated(): Promise<boolean> {
    const cookie = await getCookie()
    return cookie !== null
  }

  /**
   * Login with a .ROBLOSECURITY cookie
   */
  export async function login(
    cookie: string,
  ): Promise<{ success: true; username: string; displayName: string } | { success: false; error: string }> {
    // Clean up the cookie value
    const cleanCookie = cookie.trim().replace(/^\.ROBLOSECURITY=/, "")

    const result = await validate(cleanCookie)
    if (!result.valid) {
      return { success: false, error: result.error }
    }

    await set({
      cookie: cleanCookie,
      userId: result.userId,
      username: result.username,
      displayName: result.displayName,
      validated: Date.now(),
    })

    return {
      success: true,
      username: result.username,
      displayName: result.displayName,
    }
  }

  /**
   * Logout - remove stored credentials
   */
  export async function logout(): Promise<void> {
    await remove()
  }
}
