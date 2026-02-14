import { describe, test, expect } from "bun:test"
import { Hono } from "hono"
import { PickerRoutes } from "../../src/server/routes/picker"

/**
 * Tests for Picker API Routes
 *
 * Note: These tests check route configuration and structure.
 * Full integration tests require the instance context to be set up.
 */

describe("Picker Routes", () => {
  describe("Route Configuration", () => {
    test("should be a function that returns a Hono app", () => {
      expect(typeof PickerRoutes).toBe("function")
    })

    test("should return a Hono instance", () => {
      const routes = PickerRoutes()
      expect(routes).toBeInstanceOf(Hono)
    })

    test("should have routes property", () => {
      const routes = PickerRoutes()
      expect(routes.routes).toBeDefined()
    })
  })

  describe("List Route (GET /)", () => {
    test("should have GET / route", () => {
      const routes = PickerRoutes()
      const hasGetRoot = routes.routes.some((r) => r.method === "GET" && r.path === "/")
      expect(hasGetRoot).toBe(true)
    })
  })

  describe("Reply Route (POST /:requestID/reply)", () => {
    test("should have POST /:requestID/reply route", () => {
      const routes = PickerRoutes()
      const hasReplyRoute = routes.routes.some((r) => r.method === "POST" && r.path === "/:requestID/reply")
      expect(hasReplyRoute).toBe(true)
    })
  })

  describe("Reject Route (POST /:requestID/reject)", () => {
    test("should have POST /:requestID/reject route", () => {
      const routes = PickerRoutes()
      const hasRejectRoute = routes.routes.some((r) => r.method === "POST" && r.path === "/:requestID/reject")
      expect(hasRejectRoute).toBe(true)
    })
  })

  describe("Route Count", () => {
    test("should have routes for list, reply, and reject", () => {
      const routes = PickerRoutes()
      // Hono adds multiple handlers per route (validators, etc)
      // Just verify we have the 3 paths we expect
      const paths = new Set(routes.routes.map((r) => r.path))
      expect(paths.has("/")).toBe(true)
      expect(paths.has("/:requestID/reply")).toBe(true)
      expect(paths.has("/:requestID/reject")).toBe(true)
    })
  })
})
