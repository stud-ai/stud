/**
 * Bridge Server for Stud <-> Roblox Studio Plugin Communication
 *
 * The Roblox Studio plugin cannot receive incoming HTTP requests, only make them.
 * This bridge server acts as an intermediary:
 *
 * 1. Stud tools POST requests to /stud/request
 * 2. Studio plugin polls /stud/poll for pending requests
 * 3. Studio plugin responds to /stud/respond with results
 * 4. The original request resolves with the result
 */

import { Log } from "../../util/log"

const log = Log.create({ service: "roblox-bridge" })
const BRIDGE_PORT = 3001
const REQUEST_TIMEOUT = 15000

interface PendingRequest {
  id: string
  request: { path: string; body?: string }
  resolve: (response: { status: number; body: string }) => void
  reject: (error: Error) => void
  timestamp: number
}

const pendingRequests = new Map<string, PendingRequest>()
let requestCounter = 0
let connected = false
let lastPollTime = 0

function generateId(): string {
  return `req_${++requestCounter}_${Date.now()}`
}

function cleanupStaleRequests() {
  const now = Date.now()
  for (const [id, pending] of pendingRequests) {
    if (now - pending.timestamp > REQUEST_TIMEOUT) {
      pending.reject(new Error("Request timed out waiting for Studio response"))
      pendingRequests.delete(id)
    }
  }
}

function tryStartServer(port: number): ReturnType<typeof Bun.serve> | null {
  try {
    return Bun.serve({
      port,
      async fetch(req) {
        const url = new URL(req.url)
        const path = url.pathname

        // CORS headers for local development
        const corsHeaders = {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }

        if (req.method === "OPTIONS") {
          return new Response(null, { headers: corsHeaders })
        }

        // Status endpoint
        if (path === "/stud/status") {
          const now = Date.now()
          connected = now - lastPollTime < 2000

          return Response.json(
            {
              connected,
              pendingRequests: pendingRequests.size,
              lastPollTime,
            },
            { headers: corsHeaders },
          )
        }

        // Stud sends requests here
        if (path === "/stud/request" && req.method === "POST") {
          cleanupStaleRequests()

          const body = await req.json()
          const id = generateId()

          const promise = new Promise<{ status: number; body: string }>((resolve, reject) => {
            pendingRequests.set(id, {
              id,
              request: body,
              resolve,
              reject,
              timestamp: Date.now(),
            })
          })

          try {
            const result = await promise
            return new Response(result.body, {
              status: result.status,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            })
          } catch (e) {
            return Response.json(
              { error: e instanceof Error ? e.message : "Unknown error" },
              { status: 500, headers: corsHeaders },
            )
          }
        }

        // Studio plugin polls here
        if (path === "/stud/poll" && req.method === "GET") {
          lastPollTime = Date.now()
          connected = true

          // Return first pending request if any
          for (const [id, pending] of pendingRequests) {
            return Response.json(
              {
                id,
                request: pending.request,
              },
              { headers: corsHeaders },
            )
          }

          // No pending requests
          return Response.json({ id: null, request: null }, { headers: corsHeaders })
        }

        // Studio plugin responds here
        if (path === "/stud/respond" && req.method === "POST") {
          const body = await req.json()
          const pending = pendingRequests.get(body.id)

          if (pending) {
            pending.resolve(body.response)
            pendingRequests.delete(body.id)
            return Response.json({ ok: true }, { headers: corsHeaders })
          }

          return Response.json({ error: "Request not found" }, { status: 404, headers: corsHeaders })
        }

        return Response.json({ error: "Not found" }, { status: 404, headers: corsHeaders })
      },
    })
  } catch {
    return null
  }
}

const server = tryStartServer(BRIDGE_PORT)

if (server) {
  log.info("listening", { port: BRIDGE_PORT })

  // Periodically cleanup stale requests
  setInterval(cleanupStaleRequests, 5000)
} else {
  log.info("skipped", { port: BRIDGE_PORT, reason: "port already in use" })
}

export { server }
