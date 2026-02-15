# @stud/util

Shared utility functions used across the Stud monorepo.

## Exports

All modules are exported via `"./*": "./src/*.ts"`:

| Module | Description |
|--------|-------------|
| `array` | Array helpers |
| `binary` | Binary data encoding/decoding |
| `encode` | Text encoding utilities |
| `error` | Typed error handling |
| `fn` | Functional programming helpers |
| `identifier` | Typed ID generation (ULID-based) |
| `iife` | Immediately-invoked function expression helper |
| `lazy` | Lazy initialization |
| `path` | Path manipulation utilities |
| `retry` | Retry logic with backoff |
| `slug` | URL-safe slug generation |

## Usage

```ts
import { Identifier } from "@stud/util/identifier"
import { retry } from "@stud/util/retry"
```

## Development

```bash
bun run typecheck
```
