/**
 * Roblox Authentication Routes
 */

import { Hono } from "hono"
import { describeRoute, validator, resolver } from "hono-openapi"
import { z } from "zod"
import { RobloxAuth } from "@/roblox/auth"

export namespace RobloxRoutes {
  export function routes() {
    const app = new Hono()

    app.get(
      "/status",
      describeRoute({
        summary: "Roblox auth status",
        description: "Check if the user is authenticated with Roblox",
        operationId: "roblox.auth.status",
        responses: {
          200: {
            description: "Authentication status",
            content: {
              "application/json": {
                schema: resolver(
                  z.object({
                    authenticated: z.boolean(),
                    username: z.string().optional(),
                    displayName: z.string().optional(),
                    userId: z.number().optional(),
                  }),
                ),
              },
            },
          },
        },
      }),
      async (c) => {
        const auth = await RobloxAuth.get()
        if (!auth) {
          return c.json({ authenticated: false })
        }
        return c.json({
          authenticated: true,
          username: auth.username,
          displayName: auth.displayName,
          userId: auth.userId,
        })
      },
    )

    app.post(
      "/login",
      describeRoute({
        summary: "Login to Roblox",
        description:
          "Authenticate with Roblox using a .ROBLOSECURITY cookie. The cookie is validated and stored securely.",
        operationId: "roblox.auth.login",
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: resolver(
                  z.object({
                    success: z.literal(true),
                    username: z.string(),
                    displayName: z.string(),
                  }),
                ),
              },
            },
          },
          400: {
            description: "Login failed",
            content: {
              "application/json": {
                schema: resolver(
                  z.object({
                    success: z.literal(false),
                    error: z.string(),
                  }),
                ),
              },
            },
          },
        },
      }),
      validator(
        "json",
        z.object({
          cookie: z.string().describe("The .ROBLOSECURITY cookie value"),
        }),
      ),
      async (c) => {
        const { cookie } = c.req.valid("json")
        const result = await RobloxAuth.login(cookie)

        if (!result.success) {
          return c.json({ success: false as const, error: result.error }, 400)
        }

        return c.json({
          success: true as const,
          username: result.username,
          displayName: result.displayName,
        })
      },
    )

    app.post(
      "/logout",
      describeRoute({
        summary: "Logout from Roblox",
        description: "Remove stored Roblox credentials",
        operationId: "roblox.auth.logout",
        responses: {
          200: {
            description: "Logout successful",
            content: {
              "application/json": {
                schema: resolver(
                  z.object({
                    success: z.boolean(),
                  }),
                ),
              },
            },
          },
        },
      }),
      async (c) => {
        await RobloxAuth.logout()
        return c.json({ success: true })
      },
    )

    return app
  }
}
