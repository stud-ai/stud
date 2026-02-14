export * from "./client.js"
export * from "./server.js"

import { createStudClient } from "./client.js"
import { createStudServer } from "./server.js"
import type { ServerOptions } from "./server.js"

export async function createStud(options?: ServerOptions) {
  const server = await createStudServer({
    ...options,
  })

  const client = createStudClient({
    baseUrl: server.url,
  })

  return {
    client,
    server,
  }
}

/** @deprecated Use createStud instead */
export const createOpencode = createStud
