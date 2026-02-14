const BRIDGE_URL = "http://localhost:3001"
const TIMEOUT_MS = 2000

export type StudioResult<T> = { success: true; data: T } | { success: false; error: string }

export async function studioRequest<T>(endpoint: string, data?: object): Promise<StudioResult<T>> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  return fetch(`${BRIDGE_URL}/stud/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: endpoint,
      body: data ? JSON.stringify(data) : undefined,
    }),
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        const text = await response.text()
        return { success: false as const, error: `Studio error ${response.status}: ${text}` }
      }
      const result = await response.json()
      if (result.error) {
        return { success: false as const, error: result.error }
      }
      return { success: true as const, data: result as T }
    })
    .catch((error) => {
      return { success: false as const, error: error instanceof Error ? error.message : String(error) }
    })
    .finally(() => {
      clearTimeout(timeout)
    })
}
