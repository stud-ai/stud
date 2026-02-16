# `packages/sdk` — TypeScript SDK

The SDK package provides a typed TypeScript client for interacting with the Stud server programmatically.

## Overview

- **Package name**: `@stud/sdk`
- **Location**: `packages/sdk/js/`
- **Spec**: OpenAPI-based (see `packages/sdk/openapi.json` — 308 KB)

## Directory Structure

```
packages/sdk/
├── openapi.json           # Full OpenAPI v3 specification
└── js/                    # TypeScript SDK
    ├── src/
    │   ├── client.ts      # Generated API client
    │   ├── server.ts      # Server connection helper
    │   ├── v2/            # V2 API client variant
    │   └── index.ts       # Public exports
    └── package.json
```

## Usage

```ts
import { createOpencodeClient } from "@stud/sdk"

const client = createOpencodeClient({
  baseUrl: "http://localhost:1557",
  password: "your-server-password",
})

// List sessions
const sessions = await client.session.list()

// Create a new session
const session = await client.session.create({
  model: { providerID: "anthropic", modelID: "claude-sonnet-4-20250514" }
})

// Subscribe to events (SSE)
const events = client.event.subscribe()
for await (const event of events) {
  console.log(event.type, event.data)
}
```

## Key Types

The SDK exports types used across the codebase:

| Type | Description |
|------|-------------|
| `Event` | Server-sent event payload |
| `Session` | Chat session metadata |
| `Message` | User or assistant message |
| `Part` | Message content part (text, tool call, tool result) |
| `Model` | AI model specification |
| `Provider` | AI provider configuration |
| `Permission` | Tool permission request |
| `Auth` | Authentication state |
| `Config` | Project configuration |
| `Project` | Project metadata |
