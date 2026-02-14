# Stud

<a href="https://trystud.me"><img src="https://img.shields.io/badge/Try-Stud-blue?style=flat&logo=robux&color=00A2FF" alt="Try Stud at trystud.me" /></a>

Stud is an AI-powered desktop tool for Roblox development.  
It connects to Roblox Studio through a local plugin, so an AI agent can inspect and modify scripts, instances, and properties in real time.

## Highlights

- Live Roblox Studio integration through `studio-plugin/Stud.server.lua`
- AI tooling for script edits, instance operations, toolbox workflows, and cloud APIs
- Desktop app with Tauri + SolidJS
- Local-first architecture (plugin communicates with a local bridge server)
- Optional Cloud API support for DataStores and publishing flows

## Quick Start

```bash
./start.sh
```

`start.sh` handles setup and launch:

1. Checks prerequisites
2. Installs workspace dependencies
3. Installs or updates the Studio plugin
4. Starts the desktop app

### Roblox Studio Setup

1. Open Roblox Studio.
2. Enable `Game Settings -> Security -> Allow HTTP Requests`.
3. Open the `Plugins` tab and click `Stud`.
4. Keep the desktop app running while you work.

## Try without installing

Visit **[trystud.me](https://trystud.me)** to see Stud in action — no setup required.

## Requirements

- [Bun](https://bun.sh/) (`1.0+`, repo uses `bun@1.3.5`)
- [Rust](https://www.rust-lang.org/tools/install) (for Tauri)
- Roblox Studio

Optional:

- [Rojo](https://rojo.space/) for project synchronization workflows

## Common Commands

```bash
# Start development app (Tauri + Vite)
bun run dev

# Build desktop app
bun run build

# Typecheck workspace
bun run typecheck
```

`start.sh` also supports:

- `./start.sh --check` to validate prerequisites only
- `./start.sh --build` to run a production build flow
- `./start.sh --skip-plugin` to skip Studio plugin install/update
- `./start.sh --help` for all options

## Manual Plugin Installation

Copy `studio-plugin/Stud.server.lua` into your Roblox plugins directory:

- macOS: `~/Documents/Roblox/Plugins/Stud.server.lua`
- Windows: `%LOCALAPPDATA%\Roblox\Plugins\Stud.server.lua`
- Linux: `~/.local/share/roblox/plugins/Stud.server.lua`

Then restart Roblox Studio.

## Optional Cloud API Configuration

For DataStore and publishing-related operations:

```bash
export ROBLOX_API_KEY="your-api-key"
export ROBLOX_UNIVERSE_ID="your-universe-id"
```

Create API keys in [Roblox Creator Hub](https://create.roblox.com/dashboard/credentials).

## SDK (Workspace Package)

The monorepo includes a TypeScript SDK at `packages/sdk/js` (`@stud/sdk`):

```ts
import { createStud } from "@stud/sdk"

const stud = await createStud()
const session = await stud.client.session.create({
  directory: "/path/to/project",
})

await stud.client.session.prompt(session.id, {
  content: "Create a part in Workspace",
})
```

## Architecture

```text
Desktop App (Tauri + SolidJS)
  -> Local bridge server (localhost)
    -> Studio plugin (Luau, polling bridge endpoints)
    -> Roblox web APIs (toolbox/cloud operations)
```

## Repository Layout

```text
stud/
├── packages/
│   ├── app/          # Main UI package
│   ├── core/         # Tools, sessions, providers, server
│   ├── desktop/      # Tauri shell
│   ├── sdk/          # TypeScript SDK sources
│   ├── ui/           # Shared UI components
│   └── util/         # Shared utilities
├── studio-plugin/    # Roblox Studio plugin
├── stud-website/     # Marketing website
└── start.sh          # Setup and launch script
```

## Troubleshooting

- `Could not connect to server`: ensure the desktop app is running, the plugin is installed as `Stud.server.lua`, and Studio HTTP requests are enabled.
- Plugin not appearing: verify the plugin path above and restart Roblox Studio.
- Setup issues: run `./start.sh --check` to validate prerequisites.

## Contributing

- Before opening a PR, run:

```bash
bun run typecheck
```

## License

MIT
