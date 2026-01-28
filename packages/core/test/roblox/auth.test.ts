import { describe, test, expect, beforeAll, afterAll } from "bun:test"
import { RobloxAuth } from "../../src/roblox/auth"
import fs from "fs/promises"
import path from "path"
import { Global } from "../../src/global"

describe("RobloxAuth", () => {
  const testAuthFile = path.join(Global.Path.data, "roblox-auth.json")

  describe("get/set/remove", () => {
    test("get returns null when no auth exists", async () => {
      // Backup existing auth if present
      let backup: string | null = null
      try {
        backup = await Bun.file(testAuthFile).text()
        await fs.unlink(testAuthFile)
      } catch {}

      const result = await RobloxAuth.get()
      expect(result).toBeNull()

      // Restore backup
      if (backup) {
        await Bun.write(testAuthFile, backup)
      }
    })

    test("set stores auth and get retrieves it", async () => {
      // Backup existing auth
      let backup: string | null = null
      try {
        backup = await Bun.file(testAuthFile).text()
      } catch {}

      const testAuth = {
        cookie: "test-cookie-12345",
        userId: 123456,
        username: "TestUser",
        displayName: "Test Display",
        validated: Date.now(),
      }

      await RobloxAuth.set(testAuth)
      const result = await RobloxAuth.get()

      expect(result).not.toBeNull()
      expect(result!.cookie).toBe(testAuth.cookie)
      expect(result!.userId).toBe(testAuth.userId)
      expect(result!.username).toBe(testAuth.username)

      // Cleanup and restore
      await RobloxAuth.remove()
      if (backup) {
        await Bun.write(testAuthFile, backup)
      }
    })
  })

  describe("validate", () => {
    test("returns invalid for bad cookie", async () => {
      const result = await RobloxAuth.validate("invalid-cookie")
      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.error).toContain("Invalid")
      }
    })

    test("returns valid for real cookie (if available)", async () => {
      const auth = await RobloxAuth.get()
      if (!auth) {
        console.log("Skipping - no auth stored")
        return
      }

      const result = await RobloxAuth.validate(auth.cookie)
      expect(result.valid).toBe(true)
      if (result.valid) {
        expect(result.userId).toBeGreaterThan(0)
        expect(result.username).toBeTruthy()
      }
    })
  })

  describe("getCookie", () => {
    test("returns cookie when auth exists", async () => {
      const auth = await RobloxAuth.get()
      if (!auth) {
        console.log("Skipping - no auth stored")
        return
      }

      const cookie = await RobloxAuth.getCookie()
      expect(cookie).not.toBeNull()
      expect(cookie!.length).toBeGreaterThan(100)
    })
  })

  describe("login", () => {
    test("fails with invalid cookie", async () => {
      const result = await RobloxAuth.login("bad-cookie")
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeTruthy()
      }
    })
  })
})
