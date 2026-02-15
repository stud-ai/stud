# @stud/sdk

TypeScript SDK for interacting with a running Stud instance programmatically.

## Installation

```bash
bun add @stud/sdk
```

## Quick Start

```ts
import { createStud } from "@stud/sdk"

const stud = await createStud()

// Create a session
const session = await stud.client.session.create({
  directory: "/path/to/project",
})

// Send a prompt
await stud.client.session.prompt(session.id, {
  content: "Create a part in Workspace",
})
```

## Exports

| Export | Description |
|--------|-------------|
| `@stud/sdk` | Main entry — `createStud()` helper |
| `@stud/sdk/client` | `createStudClient()` — HTTP client for an existing server |
| `@stud/sdk/server` | `createStudServer()` — starts a local Stud server |
| `@stud/sdk/v2` | V2 API entry point |
| `@stud/sdk/v2/client` | V2 client |
| `@stud/sdk/v2/server` | V2 server |

## How It Works

`createStud()` starts a local Stud server and returns a client connected to it. If you already have a server running, use `createStudClient()` directly:

```ts
import { createStudClient } from "@stud/sdk/client"

const client = createStudClient({
  baseUrl: "http://localhost:4096",
})
```

## Development

```bash
# Typecheck
bun run typecheck

# Regenerate client from OpenAPI spec
bun run build
```

The client is auto-generated from `openapi.json` using `@hey-api/openapi-ts`.
