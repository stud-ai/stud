import z from "zod"
import { Tool } from "../tool"

const CLOUD_API_BASE = "https://apis.roblox.com"
const TIMEOUT_MS = 30000

function getApiKey(): string | undefined {
  return process.env.ROBLOX_API_KEY
}

function getUniverseId(): string | undefined {
  return process.env.ROBLOX_UNIVERSE_ID
}

function noApiKeyError(): string {
  return `Roblox Cloud API requires authentication.

Set the ROBLOX_API_KEY environment variable with your API key from:
https://create.roblox.com/dashboard/credentials

To create an API key:
1. Go to Creator Hub > Open Cloud > API Keys
2. Click "Create API Key"
3. Add permissions for the APIs you need (DataStores, Universe, etc.)
4. Copy the key and set it as ROBLOX_API_KEY`
}

function noUniverseIdError(): string {
  return `Universe ID is required for this operation.

Set the ROBLOX_UNIVERSE_ID environment variable with your experience's Universe ID.

To find your Universe ID:
1. Go to Creator Hub > Creations
2. Click on your experience
3. The Universe ID is in the URL: create.roblox.com/dashboard/creations/experiences/UNIVERSE_ID`
}

interface CloudResponse<T> {
  success: boolean
  data?: T
  error?: string
}

async function cloudRequest<T>(endpoint: string, options: RequestInit = {}): Promise<CloudResponse<T>> {
  const key = getApiKey()
  if (!key) {
    return { success: false, error: noApiKeyError() }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(`${CLOUD_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "x-api-key": key,
        "Content-Type": "application/json",
        ...options.headers,
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      const text = await response.text()
      return { success: false, error: `API error ${response.status}: ${text}` }
    }

    const data = await response.json()
    return { success: true, data: data as T }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { success: false, error: "Request timed out" }
    }
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  } finally {
    clearTimeout(timeout)
  }
}

interface UniverseInfo {
  path: string
  createTime: string
  updateTime: string
  displayName: string
  description: string
  user?: string
  group?: string
  visibility: string
  facebookSocialLink?: { uri: string }
  twitterSocialLink?: { uri: string }
  youtubeSocialLink?: { uri: string }
  twitchSocialLink?: { uri: string }
  discordSocialLink?: { uri: string }
  robloxGroupSocialLink?: { uri: string }
  guildedSocialLink?: { uri: string }
  voiceChat: string
  ageRating: string
  privateServerPriceRobux?: number
  desktopEnabled: boolean
  mobileEnabled: boolean
  tabletEnabled: boolean
  vrEnabled: boolean
  consoleEnabled: boolean
}

export const RobloxUniverseInfoTool = Tool.define<
  z.ZodObject<{
    universeId: z.ZodOptional<z.ZodString>
  }>,
  { universeId: string }
>("roblox_universe_info", {
  description: `Get information about a Roblox experience (universe).

Returns details like name, description, visibility, enabled platforms, and social links.
If no universeId is provided, uses the ROBLOX_UNIVERSE_ID environment variable.

Requires ROBLOX_API_KEY environment variable with universe-read permission.`,
  parameters: z.object({
    universeId: z.string().optional().describe("Universe ID (uses ROBLOX_UNIVERSE_ID env var if not provided)"),
  }),
  async execute(params) {
    const id = params.universeId || getUniverseId()
    if (!id) {
      return { title: "Universe Info", output: noUniverseIdError(), metadata: { universeId: "" } }
    }

    const result = await cloudRequest<UniverseInfo>(`/cloud/v2/universes/${id}`)
    if (!result.success) {
      return { title: "Universe Info", output: `Error: ${result.error}`, metadata: { universeId: id } }
    }

    const info = result.data!
    const output = [
      `Name: ${info.displayName}`,
      `Description: ${info.description || "(none)"}`,
      `Visibility: ${info.visibility}`,
      `Age Rating: ${info.ageRating}`,
      `Voice Chat: ${info.voiceChat}`,
      ``,
      `Platforms:`,
      `  Desktop: ${info.desktopEnabled}`,
      `  Mobile: ${info.mobileEnabled}`,
      `  Tablet: ${info.tabletEnabled}`,
      `  VR: ${info.vrEnabled}`,
      `  Console: ${info.consoleEnabled}`,
      ``,
      `Created: ${info.createTime}`,
      `Updated: ${info.updateTime}`,
    ].join("\n")

    return { title: info.displayName, output, metadata: { universeId: id } }
  },
})

interface DataStoreListResponse {
  datastores: Array<{ name: string; createdTime: string }>
  nextPageCursor?: string
}

export const RobloxDataStoreListTool = Tool.define<
  z.ZodObject<{
    universeId: z.ZodOptional<z.ZodString>
    prefix: z.ZodOptional<z.ZodString>
    limit: z.ZodOptional<z.ZodNumber>
  }>,
  { universeId: string }
>("roblox_datastore_list", {
  description: `List all DataStores in a Roblox experience.

Returns the names and creation times of DataStores.
Use prefix to filter by name prefix.

Requires ROBLOX_API_KEY with datastores-read permission.`,
  parameters: z.object({
    universeId: z.string().optional().describe("Universe ID (uses ROBLOX_UNIVERSE_ID env var if not provided)"),
    prefix: z.string().optional().describe("Filter DataStores by name prefix"),
    limit: z.number().min(1).max(100).optional().describe("Maximum number of results (1-100, default 100)"),
  }),
  async execute(params) {
    const id = params.universeId || getUniverseId()
    if (!id) {
      return { title: "DataStore List", output: noUniverseIdError(), metadata: { universeId: "" } }
    }

    const queryParams = new URLSearchParams()
    if (params.prefix) queryParams.set("prefix", params.prefix)
    if (params.limit) queryParams.set("limit", params.limit.toString())

    const query = queryParams.toString()
    const endpoint = `/datastores/v1/universes/${id}/standard-datastores${query ? `?${query}` : ""}`

    const result = await cloudRequest<DataStoreListResponse>(endpoint)
    if (!result.success) {
      return { title: "DataStore List", output: `Error: ${result.error}`, metadata: { universeId: id } }
    }

    const stores = result.data!.datastores
    if (stores.length === 0) {
      return { title: "DataStore List", output: "No DataStores found.", metadata: { universeId: id } }
    }

    const output = stores.map((s) => `- ${s.name} (created: ${s.createdTime})`).join("\n")
    return {
      title: `DataStores (${stores.length})`,
      output: `Found ${stores.length} DataStore(s):\n\n${output}`,
      metadata: { universeId: id },
    }
  },
})

interface DataStoreEntry {
  value: unknown
  version: string
  createdTime: string
  updatedTime: string
}

export const RobloxDataStoreGetTool = Tool.define<
  z.ZodObject<{
    datastoreName: z.ZodString
    key: z.ZodString
    universeId: z.ZodOptional<z.ZodString>
    scope: z.ZodOptional<z.ZodString>
  }>,
  { universeId: string; datastoreName: string; key: string }
>("roblox_datastore_get", {
  description: `Read an entry from a Roblox DataStore.

Returns the value, version, and timestamps for the specified key.
Scope defaults to "global" if not specified.

Requires ROBLOX_API_KEY with datastores-read permission.`,
  parameters: z.object({
    datastoreName: z.string().describe("Name of the DataStore"),
    key: z.string().describe("The key to read"),
    universeId: z.string().optional().describe("Universe ID (uses ROBLOX_UNIVERSE_ID env var if not provided)"),
    scope: z.string().optional().describe("DataStore scope (default: global)"),
  }),
  async execute(params) {
    const id = params.universeId || getUniverseId()
    if (!id) {
      return {
        title: "DataStore Get",
        output: noUniverseIdError(),
        metadata: { universeId: "", datastoreName: params.datastoreName, key: params.key },
      }
    }

    const scope = params.scope || "global"
    const endpoint = `/datastores/v1/universes/${id}/standard-datastores/datastore/entries/entry?datastoreName=${encodeURIComponent(params.datastoreName)}&scope=${encodeURIComponent(scope)}&entryKey=${encodeURIComponent(params.key)}`

    const result = await cloudRequest<DataStoreEntry>(endpoint)
    if (!result.success) {
      return {
        title: `${params.datastoreName}/${params.key}`,
        output: `Error: ${result.error}`,
        metadata: { universeId: id, datastoreName: params.datastoreName, key: params.key },
      }
    }

    const entry = result.data!
    const valueStr = typeof entry.value === "object" ? JSON.stringify(entry.value, null, 2) : String(entry.value)

    const output = [
      `Key: ${params.key}`,
      `Scope: ${scope}`,
      `Version: ${entry.version}`,
      `Created: ${entry.createdTime}`,
      `Updated: ${entry.updatedTime}`,
      ``,
      `Value:`,
      valueStr,
    ].join("\n")

    return {
      title: `${params.datastoreName}/${params.key}`,
      output,
      metadata: { universeId: id, datastoreName: params.datastoreName, key: params.key },
    }
  },
})

export const RobloxDataStoreSetTool = Tool.define<
  z.ZodObject<{
    datastoreName: z.ZodString
    key: z.ZodString
    value: z.ZodString
    universeId: z.ZodOptional<z.ZodString>
    scope: z.ZodOptional<z.ZodString>
  }>,
  { universeId: string; datastoreName: string; key: string }
>("roblox_datastore_set", {
  description: `Write an entry to a Roblox DataStore.

Sets the value for the specified key. The value should be valid JSON.
This will create the entry if it doesn't exist, or update it if it does.

WARNING: This modifies production data. Use with caution.

Requires ROBLOX_API_KEY with datastores-write permission.`,
  parameters: z.object({
    datastoreName: z.string().describe("Name of the DataStore"),
    key: z.string().describe("The key to write"),
    value: z.string().describe("The value to set (must be valid JSON)"),
    universeId: z.string().optional().describe("Universe ID (uses ROBLOX_UNIVERSE_ID env var if not provided)"),
    scope: z.string().optional().describe("DataStore scope (default: global)"),
  }),
  async execute(params) {
    const id = params.universeId || getUniverseId()
    if (!id) {
      return {
        title: "DataStore Set",
        output: noUniverseIdError(),
        metadata: { universeId: "", datastoreName: params.datastoreName, key: params.key },
      }
    }

    let parsedValue: unknown
    try {
      parsedValue = JSON.parse(params.value)
    } catch {
      return {
        title: "DataStore Set",
        output: `Error: Invalid JSON value. The value must be valid JSON.\n\nProvided: ${params.value}`,
        metadata: { universeId: id, datastoreName: params.datastoreName, key: params.key },
      }
    }

    const scope = params.scope || "global"
    const endpoint = `/datastores/v1/universes/${id}/standard-datastores/datastore/entries/entry?datastoreName=${encodeURIComponent(params.datastoreName)}&scope=${encodeURIComponent(scope)}&entryKey=${encodeURIComponent(params.key)}`

    const result = await cloudRequest<{ version: string }>(endpoint, {
      method: "POST",
      body: JSON.stringify(parsedValue),
    })

    if (!result.success) {
      return {
        title: `${params.datastoreName}/${params.key}`,
        output: `Error: ${result.error}`,
        metadata: { universeId: id, datastoreName: params.datastoreName, key: params.key },
      }
    }

    return {
      title: `${params.datastoreName}/${params.key}`,
      output: `Successfully set value for key "${params.key}" in DataStore "${params.datastoreName}".\n\nNew version: ${result.data!.version}`,
      metadata: { universeId: id, datastoreName: params.datastoreName, key: params.key },
    }
  },
})

interface PublishResponse {
  path: string
  revisionId: string
  revisionCreateTime: string
}

export const RobloxPublishPlaceTool = Tool.define<
  z.ZodObject<{
    placeId: z.ZodString
    versionType: z.ZodOptional<z.ZodString>
    universeId: z.ZodOptional<z.ZodString>
  }>,
  { universeId: string; placeId: string }
>("roblox_publish_place", {
  description: `Publish a place version in a Roblox experience.

This triggers a publish of the place, making the current saved version live.
Use versionType "Saved" to save without publishing, or "Published" to make it live.

WARNING: Publishing makes changes live to all players.

Requires ROBLOX_API_KEY with place-publish permission.`,
  parameters: z.object({
    placeId: z.string().describe("The Place ID to publish"),
    versionType: z.string().optional().describe("Version type: 'Saved' or 'Published' (default: Published)"),
    universeId: z.string().optional().describe("Universe ID (uses ROBLOX_UNIVERSE_ID env var if not provided)"),
  }),
  async execute(params) {
    const id = params.universeId || getUniverseId()
    if (!id) {
      return {
        title: "Publish Place",
        output: noUniverseIdError(),
        metadata: { universeId: "", placeId: params.placeId },
      }
    }

    const versionType = params.versionType || "Published"
    const endpoint = `/universes/v1/${id}/places/${params.placeId}/versions?versionType=${versionType}`

    const result = await cloudRequest<PublishResponse>(endpoint, {
      method: "POST",
    })

    if (!result.success) {
      return {
        title: `Publish ${params.placeId}`,
        output: `Error: ${result.error}`,
        metadata: { universeId: id, placeId: params.placeId },
      }
    }

    const data = result.data!
    return {
      title: `Publish ${params.placeId}`,
      output: `Successfully ${versionType === "Published" ? "published" : "saved"} place ${params.placeId}.\n\nRevision ID: ${data.revisionId}\nCreated: ${data.revisionCreateTime}`,
      metadata: { universeId: id, placeId: params.placeId },
    }
  },
})

// OrderedDataStore types
interface OrderedDataStoreListResponse {
  entries: Array<{ path: string; id: string; value: number }>
  nextPageToken?: string
}

interface OrderedDataStoreEntry {
  path: string
  id: string
  value: number
}

export const RobloxOrderedDataStoreListTool = Tool.define<
  z.ZodObject<{
    datastoreName: z.ZodString
    universeId: z.ZodOptional<z.ZodString>
    scope: z.ZodOptional<z.ZodString>
    maxPageSize: z.ZodOptional<z.ZodNumber>
    ascending: z.ZodOptional<z.ZodBoolean>
  }>,
  { universeId: string; datastoreName: string }
>("roblox_ordered_datastore_list", {
  description: `List entries from an OrderedDataStore (sorted by value).

OrderedDataStores are used for leaderboards, rankings, and sorted data.
Returns entries sorted by value (descending by default for leaderboards).

Use ascending=true to get lowest values first.

Requires ROBLOX_API_KEY with ordered-datastores-read permission.`,
  parameters: z.object({
    datastoreName: z.string().describe("Name of the OrderedDataStore"),
    universeId: z.string().optional().describe("Universe ID (uses ROBLOX_UNIVERSE_ID env var if not provided)"),
    scope: z.string().optional().describe("DataStore scope (default: global)"),
    maxPageSize: z.number().min(1).max(100).optional().describe("Max entries to return (1-100, default: 10)"),
    ascending: z.boolean().optional().describe("Sort ascending (lowest first) instead of descending"),
  }),
  async execute(params) {
    const id = params.universeId || getUniverseId()
    if (!id) {
      return {
        title: "OrderedDataStore List",
        output: noUniverseIdError(),
        metadata: { universeId: "", datastoreName: params.datastoreName },
      }
    }

    const scope = params.scope || "global"
    const maxPageSize = params.maxPageSize || 10
    const order = params.ascending ? "asc" : "desc"

    const endpoint = `/ordered-data-stores/v1/universes/${id}/orderedDataStores/${encodeURIComponent(params.datastoreName)}/scopes/${encodeURIComponent(scope)}/entries?max_page_size=${maxPageSize}&order_by=value ${order}`

    const result = await cloudRequest<OrderedDataStoreListResponse>(endpoint)
    if (!result.success) {
      return {
        title: params.datastoreName,
        output: `Error: ${result.error}`,
        metadata: { universeId: id, datastoreName: params.datastoreName },
      }
    }

    const entries = result.data!.entries || []
    if (entries.length === 0) {
      return {
        title: params.datastoreName,
        output: `No entries found in OrderedDataStore "${params.datastoreName}".`,
        metadata: { universeId: id, datastoreName: params.datastoreName },
      }
    }

    const lines = entries.map((e, i) => `${i + 1}. ${e.id}: ${e.value}`).join("\n")
    const output = [
      `OrderedDataStore: ${params.datastoreName}`,
      `Scope: ${scope}`,
      `Order: ${params.ascending ? "Ascending" : "Descending"}`,
      ``,
      `Entries:`,
      lines,
    ]

    if (result.data!.nextPageToken) {
      output.push(`\n(More entries available)`)
    }

    return {
      title: `${params.datastoreName} (${entries.length})`,
      output: output.join("\n"),
      metadata: { universeId: id, datastoreName: params.datastoreName },
    }
  },
})

export const RobloxOrderedDataStoreGetTool = Tool.define<
  z.ZodObject<{
    datastoreName: z.ZodString
    entryId: z.ZodString
    universeId: z.ZodOptional<z.ZodString>
    scope: z.ZodOptional<z.ZodString>
  }>,
  { universeId: string; datastoreName: string; entryId: string }
>("roblox_ordered_datastore_get", {
  description: `Get a specific entry from an OrderedDataStore.

Returns the numeric value for the given entry ID.

Requires ROBLOX_API_KEY with ordered-datastores-read permission.`,
  parameters: z.object({
    datastoreName: z.string().describe("Name of the OrderedDataStore"),
    entryId: z.string().describe("The entry ID (usually a player UserId)"),
    universeId: z.string().optional().describe("Universe ID (uses ROBLOX_UNIVERSE_ID env var if not provided)"),
    scope: z.string().optional().describe("DataStore scope (default: global)"),
  }),
  async execute(params) {
    const id = params.universeId || getUniverseId()
    if (!id) {
      return {
        title: "OrderedDataStore Get",
        output: noUniverseIdError(),
        metadata: { universeId: "", datastoreName: params.datastoreName, entryId: params.entryId },
      }
    }

    const scope = params.scope || "global"
    const endpoint = `/ordered-data-stores/v1/universes/${id}/orderedDataStores/${encodeURIComponent(params.datastoreName)}/scopes/${encodeURIComponent(scope)}/entries/${encodeURIComponent(params.entryId)}`

    const result = await cloudRequest<OrderedDataStoreEntry>(endpoint)
    if (!result.success) {
      return {
        title: `${params.datastoreName}/${params.entryId}`,
        output: `Error: ${result.error}`,
        metadata: { universeId: id, datastoreName: params.datastoreName, entryId: params.entryId },
      }
    }

    const entry = result.data!
    return {
      title: `${params.datastoreName}/${params.entryId}`,
      output: `Entry: ${params.entryId}\nValue: ${entry.value}`,
      metadata: { universeId: id, datastoreName: params.datastoreName, entryId: params.entryId },
    }
  },
})

export const RobloxOrderedDataStoreSetTool = Tool.define<
  z.ZodObject<{
    datastoreName: z.ZodString
    entryId: z.ZodString
    value: z.ZodNumber
    universeId: z.ZodOptional<z.ZodString>
    scope: z.ZodOptional<z.ZodString>
  }>,
  { universeId: string; datastoreName: string; entryId: string }
>("roblox_ordered_datastore_set", {
  description: `Set an entry in an OrderedDataStore.

Creates or updates an entry with the specified numeric value.
OrderedDataStores only support integer values.

WARNING: This modifies production data.

Requires ROBLOX_API_KEY with ordered-datastores-write permission.`,
  parameters: z.object({
    datastoreName: z.string().describe("Name of the OrderedDataStore"),
    entryId: z.string().describe("The entry ID (usually a player UserId)"),
    value: z.number().int().describe("The numeric value to set (must be an integer)"),
    universeId: z.string().optional().describe("Universe ID (uses ROBLOX_UNIVERSE_ID env var if not provided)"),
    scope: z.string().optional().describe("DataStore scope (default: global)"),
  }),
  async execute(params) {
    const id = params.universeId || getUniverseId()
    if (!id) {
      return {
        title: "OrderedDataStore Set",
        output: noUniverseIdError(),
        metadata: { universeId: "", datastoreName: params.datastoreName, entryId: params.entryId },
      }
    }

    const scope = params.scope || "global"
    const endpoint = `/ordered-data-stores/v1/universes/${id}/orderedDataStores/${encodeURIComponent(params.datastoreName)}/scopes/${encodeURIComponent(scope)}/entries/${encodeURIComponent(params.entryId)}`

    const result = await cloudRequest<OrderedDataStoreEntry>(endpoint, {
      method: "PATCH",
      body: JSON.stringify({ value: params.value }),
    })

    if (!result.success) {
      // Try POST if PATCH fails (create new entry)
      const createResult = await cloudRequest<OrderedDataStoreEntry>(endpoint, {
        method: "POST",
        body: JSON.stringify({ value: params.value }),
      })

      if (!createResult.success) {
        return {
          title: `${params.datastoreName}/${params.entryId}`,
          output: `Error: ${createResult.error}`,
          metadata: { universeId: id, datastoreName: params.datastoreName, entryId: params.entryId },
        }
      }
    }

    return {
      title: `${params.datastoreName}/${params.entryId}`,
      output: `Set ${params.entryId} = ${params.value} in OrderedDataStore "${params.datastoreName}"`,
      metadata: { universeId: id, datastoreName: params.datastoreName, entryId: params.entryId },
    }
  },
})

export const RobloxOrderedDataStoreIncrementTool = Tool.define<
  z.ZodObject<{
    datastoreName: z.ZodString
    entryId: z.ZodString
    increment: z.ZodNumber
    universeId: z.ZodOptional<z.ZodString>
    scope: z.ZodOptional<z.ZodString>
  }>,
  { universeId: string; datastoreName: string; entryId: string }
>("roblox_ordered_datastore_increment", {
  description: `Increment an entry in an OrderedDataStore.

Atomically increments the value by the specified amount.
Use negative numbers to decrement.

This is useful for scores, counters, and leaderboards.

Requires ROBLOX_API_KEY with ordered-datastores-write permission.`,
  parameters: z.object({
    datastoreName: z.string().describe("Name of the OrderedDataStore"),
    entryId: z.string().describe("The entry ID (usually a player UserId)"),
    increment: z.number().int().describe("Amount to increment by (use negative to decrement)"),
    universeId: z.string().optional().describe("Universe ID (uses ROBLOX_UNIVERSE_ID env var if not provided)"),
    scope: z.string().optional().describe("DataStore scope (default: global)"),
  }),
  async execute(params) {
    const id = params.universeId || getUniverseId()
    if (!id) {
      return {
        title: "OrderedDataStore Increment",
        output: noUniverseIdError(),
        metadata: { universeId: "", datastoreName: params.datastoreName, entryId: params.entryId },
      }
    }

    const scope = params.scope || "global"
    const endpoint = `/ordered-data-stores/v1/universes/${id}/orderedDataStores/${encodeURIComponent(params.datastoreName)}/scopes/${encodeURIComponent(scope)}/entries/${encodeURIComponent(params.entryId)}:increment`

    const result = await cloudRequest<OrderedDataStoreEntry>(endpoint, {
      method: "POST",
      body: JSON.stringify({ amount: params.increment }),
    })

    if (!result.success) {
      return {
        title: `${params.datastoreName}/${params.entryId}`,
        output: `Error: ${result.error}`,
        metadata: { universeId: id, datastoreName: params.datastoreName, entryId: params.entryId },
      }
    }

    const entry = result.data!
    const sign = params.increment >= 0 ? "+" : ""
    return {
      title: `${params.datastoreName}/${params.entryId}`,
      output: `Incremented ${params.entryId} by ${sign}${params.increment}\nNew value: ${entry.value}`,
      metadata: { universeId: id, datastoreName: params.datastoreName, entryId: params.entryId },
    }
  },
})
