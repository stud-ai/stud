import type { Hooks, PluginInput } from "@stud/plugin"
import { RobloxAuth } from "@/roblox/auth"

// Roblox Open Cloud OAuth configuration
// To use this, you need to register an app at https://create.roblox.com/credentials
const OAUTH_CONFIG = {
  authorizationUrl: "https://apis.roblox.com/oauth/v1/authorize",
  tokenUrl: "https://apis.roblox.com/oauth/v1/token",
  userInfoUrl: "https://apis.roblox.com/oauth/v1/userinfo",
  scopes: ["openid", "profile"],
}

// Generate PKCE code verifier
function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}

export async function RobloxAuthPlugin(_input: PluginInput): Promise<Hooks> {
  return {
    auth: {
      provider: "roblox",
      async loader(getAuth) {
        const info = await getAuth()

        // Check if we have OAuth tokens
        if (info && info.type === "oauth") {
          return {
            apiKey: info.access,
            async fetch(request: RequestInfo | URL, init?: RequestInit) {
              const currentInfo = await getAuth()
              if (currentInfo.type !== "oauth") return fetch(request, init)

              const headers: Record<string, string> = {
                ...(init?.headers as Record<string, string>),
                Authorization: `Bearer ${currentInfo.access}`,
              }

              return fetch(request, { ...init, headers })
            },
          }
        }

        // Fall back to cookie-based auth
        const cookie = await RobloxAuth.getCookie()
        if (cookie) {
          return {
            apiKey: "",
            async fetch(request: RequestInfo | URL, init?: RequestInit) {
              const currentCookie = await RobloxAuth.getCookie()
              if (!currentCookie) return fetch(request, init)

              const headers: Record<string, string> = {
                ...(init?.headers as Record<string, string>),
                Cookie: `.ROBLOSECURITY=${currentCookie}`,
              }

              return fetch(request, { ...init, headers })
            },
          }
        }

        return {}
      },
      methods: [
        {
          type: "api" as const,
          label: "Login with Roblox Cookie",
          prompts: [
            {
              type: "text" as const,
              key: "cookie",
              message: "Enter your .ROBLOSECURITY cookie",
              placeholder: "_|WARNING:-DO-NOT-SHARE-THIS...",
              validate: (value) => {
                if (!value) return "Cookie is required"
                if (!value.startsWith("_|")) return "Invalid cookie format. Should start with _|"
                return undefined
              },
            },
          ],
          async authorize(inputs = {}) {
            const cookie = inputs.cookie as string
            if (!cookie) {
              return { type: "failed" as const }
            }

            // Use the existing login method
            const result = await RobloxAuth.login(cookie)
            if (!result.success) {
              return { type: "failed" as const }
            }

            return {
              type: "success" as const,
              key: cookie,
            }
          },
        },
        {
          type: "oauth" as const,
          label: "Login with Roblox OAuth (Open Cloud)",
          prompts: [
            {
              type: "text" as const,
              key: "clientId",
              message: "Enter your Roblox OAuth Client ID",
              placeholder: "Your app's client ID from create.roblox.com",
              validate: (value) => {
                if (!value) return "Client ID is required"
                return undefined
              },
            },
            {
              type: "text" as const,
              key: "clientSecret",
              message: "Enter your Roblox OAuth Client Secret (optional)",
              placeholder: "Leave empty for public clients",
            },
          ],
          async authorize(inputs = {}) {
            const clientId = inputs.clientId as string
            const clientSecret = inputs.clientSecret as string | undefined

            if (!clientId) {
              throw new Error("Client ID is required")
            }

            // Generate PKCE
            const verifier = generateCodeVerifier()
            const state = crypto.randomUUID()

            // Build authorization URL
            const redirectUri = `http://localhost:19876/roblox/oauth/callback`
            const authUrl = new URL(OAUTH_CONFIG.authorizationUrl)
            authUrl.searchParams.set("client_id", clientId)
            authUrl.searchParams.set("redirect_uri", redirectUri)
            authUrl.searchParams.set("response_type", "code")
            authUrl.searchParams.set("scope", OAUTH_CONFIG.scopes.join(" "))
            authUrl.searchParams.set("state", state)
            authUrl.searchParams.set("code_challenge", verifier)
            authUrl.searchParams.set("code_challenge_method", "plain")

            return {
              url: authUrl.toString(),
              instructions: "Complete login in browser",
              method: "code" as const,
              async callback(code: string) {
                // Exchange code for tokens
                const tokenResponse = await fetch(OAUTH_CONFIG.tokenUrl, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: new URLSearchParams({
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: redirectUri,
                    client_id: clientId,
                    code_verifier: verifier,
                    ...(clientSecret ? { client_secret: clientSecret } : {}),
                  }),
                })

                if (!tokenResponse.ok) {
                  return { type: "failed" as const }
                }

                const tokens = (await tokenResponse.json()) as {
                  access_token: string
                  refresh_token?: string
                  expires_in: number
                }

                return {
                  type: "success" as const,
                  access: tokens.access_token,
                  refresh: tokens.refresh_token || tokens.access_token,
                  expires: Date.now() + tokens.expires_in * 1000,
                }
              },
            }
          },
        },
      ],
    },
  }
}
