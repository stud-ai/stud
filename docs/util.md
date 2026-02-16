# `packages/util` — Shared Utilities

The util package provides small, shared utility functions used across the monorepo.

## Overview

- **Package name**: `@stud/util`
- **Entry**: Individual file imports (e.g., `@stud/util/error`)
- **Dependencies**: None (standalone utilities)

## Modules

| Module | Import | Description |
|--------|--------|-------------|
| `array` | `@stud/util/array` | Array manipulation helpers |
| `binary` | `@stud/util/binary` | Binary data encoding/decoding |
| `encode` | `@stud/util/encode` | String encoding utilities (base64, etc.) |
| `error` | `@stud/util/error` | `NamedError` class for typed error handling |
| `fn` | `@stud/util/fn` | Function composition helpers |
| `identifier` | `@stud/util/identifier` | ID generation and validation |
| `iife` | `@stud/util/iife` | Immediately Invoked Function Expression helpers |
| `lazy` | `@stud/util/lazy` | Lazy initialization patterns |
| `path` | `@stud/util/path` | Path manipulation utilities |
| `retry` | `@stud/util/retry` | Retry logic with configurable backoff |
| `slug` | `@stud/util/slug` | URL-safe slug generation |

## Key Utilities

### NamedError

A structured error class that carries metadata:

```ts
import { NamedError } from "@stud/util/error"

throw new NamedError("ValidationError", "Invalid input", {
  field: "name",
  value: "",
})
```

### Retry

Configurable retry with exponential backoff:

```ts
import { retry } from "@stud/util/retry"

const result = await retry(() => fetchData(), {
  attempts: 3,
  delay: 1000,
})
```

### Lazy

Deferred initialization:

```ts
import { lazy } from "@stud/util/lazy"

const config = lazy(() => loadExpensiveConfig())
// Config is only loaded on first access
```
