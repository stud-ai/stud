export * from "./gen/types.gen.js"

import { createClient } from "./gen/client/client.gen.js"
import { type Config } from "./gen/client/types.gen.js"
import { OpencodeClient } from "./gen/sdk.gen.js"

// Export with new name as primary, old name as alias
export { OpencodeClient as StudClient }
export { OpencodeClient }
export { type Config as StudClientConfig }
export { type Config as OpencodeClientConfig }

export function createStudClient(config?: Config & { directory?: string }) {
  if (!config?.fetch) {
    const customFetch: any = (req: any) => {
      // @ts-ignore
      req.timeout = false
      return fetch(req)
    }
    config = {
      ...config,
      fetch: customFetch,
    }
  }

  if (config?.directory) {
    config.headers = {
      ...config.headers,
      "x-stud-directory": config.directory,
    }
  }

  const client = createClient(config)
  return new OpencodeClient({ client })
}

/** @deprecated Use createStudClient instead */
export const createOpencodeClient = createStudClient
