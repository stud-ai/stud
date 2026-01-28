# Stud

AI-powered development tool for Roblox games. Stud connects to Roblox Studio via a plugin and allows AI to manipulate instances, scripts, properties, and more in real-time.

---

## Quick Start

```bash
# One command to set up and run
./start.sh
```

This will:

1. Install dependencies
2. Copy the Studio plugin to your Roblox plugins folder
3. Start the Stud desktop app

### In Roblox Studio

1. Enable HTTP Requests: **Game Settings > Security > Allow HTTP Requests**
2. Click the **Stud** toolbar button to connect
3. Status indicator shows connection state (red/yellow/green)

---

## Features

### Studio Tools (13 tools)

| Tool                    | Description                     |
| ----------------------- | ------------------------------- |
| `roblox_get_script`     | Read script source code         |
| `roblox_set_script`     | Replace entire script content   |
| `roblox_edit_script`    | Find-and-replace edit in script |
| `roblox_get_children`   | List children of an instance    |
| `roblox_get_properties` | Get properties of an instance   |
| `roblox_set_property`   | Set a property value            |
| `roblox_create`         | Create a new instance           |
| `roblox_delete`         | Delete an instance              |
| `roblox_clone`          | Clone an instance               |
| `roblox_move`           | Move instance to new parent     |
| `roblox_search`         | Search instances by name/class  |
| `roblox_get_selection`  | Get currently selected objects  |
| `roblox_run_code`       | Execute Luau code in Studio     |

### Bulk Operations (3 tools)

| Tool                       | Description                          |
| -------------------------- | ------------------------------------ |
| `roblox_bulk_create`       | Create multiple instances at once    |
| `roblox_bulk_delete`       | Delete multiple instances at once    |
| `roblox_bulk_set_property` | Set properties on multiple instances |

### Toolbox Tools (3 tools)

| Tool                    | Description                    |
| ----------------------- | ------------------------------ |
| `roblox_toolbox_search` | Search free assets in toolbox  |
| `roblox_asset_details`  | Get details about an asset     |
| `roblox_insert_asset`   | Insert toolbox asset into game |

**Interactive Asset Selection**: When searching the toolbox, results are displayed as clickable thumbnail cards. Click any asset to automatically insert it into your game - no need to copy/paste asset IDs!

### Cloud API Tools (9 tools)

| Tool                                 | Description                                  |
| ------------------------------------ | -------------------------------------------- |
| `roblox_universe_info`               | Get experience/universe info                 |
| `roblox_datastore_list`              | List DataStores                              |
| `roblox_datastore_get`               | Read DataStore entry                         |
| `roblox_datastore_set`               | Write DataStore entry                        |
| `roblox_publish_place`               | Publish a place version                      |
| `roblox_ordered_datastore_list`      | List OrderedDataStore entries (leaderboards) |
| `roblox_ordered_datastore_get`       | Get OrderedDataStore entry                   |
| `roblox_ordered_datastore_set`       | Set OrderedDataStore entry                   |
| `roblox_ordered_datastore_increment` | Increment OrderedDataStore entry             |

**Total: 28 Roblox tools**

---

## Architecture

```
+-----------------------------------------------------------+
|                     STUD DESKTOP                          |
+---------------------------+-------------------------------+
|  Frontend (SolidJS)       |  Sidecar (stud-core)          |
|  localhost:1420           |  localhost:random             |
|                           |                               |
|  28 Roblox Tools ---------+---> Bridge Server :3001       |
|                           |         |                     |
+---------------------------+---------+---------------------+
                                      |
                 +--------------------+--------------------+
                 |                                         |
                 v                                         v
      +--------------------+                +-------------------------+
      |  Roblox Studio     |                |  Roblox APIs            |
      |  Plugin (Luau)     |                |  - toolbox-service      |
      |  Polls :3001       |                |  - Cloud API            |
      +--------------------+                +-------------------------+
```

### How It Works

1. **Stud Desktop** runs a bridge server on `localhost:3001`
2. **Studio Plugin** polls the bridge for pending requests
3. Plugin executes requests and sends responses back
4. AI tools communicate through the bridge seamlessly

### Undo Support

All modifying operations create undo waypoints in Studio:

- Use **Ctrl+Z** to undo any AI changes
- Each tool call creates a separate waypoint

---

## Environment Variables

### Cloud API (Optional)

For DataStore and publishing operations:

```bash
export ROBLOX_API_KEY="your-api-key"
export ROBLOX_UNIVERSE_ID="your-universe-id"
```

To create an API key:

1. Go to [Creator Hub > Open Cloud > API Keys](https://create.roblox.com/dashboard/credentials)
2. Create a key with required permissions (DataStores, Universe, etc.)

---

## Development

### Prerequisites

- [Bun](https://bun.sh/) v1.3.5+
- [Rust](https://www.rust-lang.org/tools/install) (for Tauri)
- [Tauri CLI prerequisites](https://tauri.app/start/prerequisites/)

### Setup

```bash
# Install dependencies
bun install

# Run the desktop app in development mode
bun run dev
```

### Project Structure

```
stud/
├── packages/
│   ├── desktop/      # Tauri desktop app shell
│   ├── app/          # SolidJS UI components
│   ├── ui/           # Shared UI component library
│   ├── core/         # AI engine (providers, tools, sessions)
│   ├── util/         # Shared utilities
│   ├── plugin/       # Plugin system
│   └── script/       # Build scripts
├── studio-plugin/    # Roblox Studio plugin
├── start.sh          # Quick start script
└── package.json
```

### Building

```bash
# Development mode (hot reload)
bun run dev

# Build for production
bun run build

# Type checking
bun run typecheck
```

### Manual Plugin Installation

Copy `studio-plugin/Stud.server.lua` to your Roblox plugins folder:

- **Windows**: `%LOCALAPPDATA%\Roblox\Plugins\Stud.server.lua`
- **Mac**: `~/Documents/Roblox/Plugins/Stud.server.lua`

---

## Key Technologies

- **Tauri** - Cross-platform desktop app framework
- **SolidJS** - Reactive UI framework
- **Bun** - JavaScript runtime and package manager
- **AI SDK** - Multi-provider AI model integrations
- **Hono** - Lightweight web framework for local server

---

## License

MIT

## Contributors

- **improdead**
- **madebyshaurya**
