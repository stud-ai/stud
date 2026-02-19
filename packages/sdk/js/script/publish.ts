#!/usr/bin/env bun

import { Script } from "@opencode-ai/script"
import { $ } from "bun"

const dir = new URL("..", import.meta.url).pathname
process.chdir(dir)

await import("./build")

const pkg = (await import("../package.json").then((m) => m.default)) as { exports?: Record<string, unknown> }
const original = JSON.parse(JSON.stringify(pkg))

function transformExports(exports: Record<string, unknown>) {
  for (const [key, value] of Object.entries(exports)) {
    if (typeof value === "string") {
      const file = value.replace("./src/", "./dist/").replace(".ts", "")
      exports[key] = {
        import: file + ".js",
        types: file + ".d.ts",
      }
      continue
    }

    if (!value || typeof value !== "object" || Array.isArray(value)) {
      continue
    }

    transformExports(value as Record<string, unknown>)
  }
}

if (pkg.exports && typeof pkg.exports === "object" && !Array.isArray(pkg.exports)) {
  transformExports(pkg.exports)
}

await Bun.write("package.json", JSON.stringify(pkg, null, 2))
await $`bun pm pack`
await $`npm publish *.tgz --tag ${Script.channel} --access public`
await Bun.write("package.json", JSON.stringify(original, null, 2))
