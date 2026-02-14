# Stud Plugin for Roblox Studio

This plugin allows Stud to communicate with Roblox Studio for live editing.

## Installation

1. **Copy the plugin file** to your Roblox Plugins folder:
   - **Windows**: `%LOCALAPPDATA%\Roblox\Plugins\Stud.server.lua`
   - **Mac**: `~/Documents/Roblox/Plugins/Stud.server.lua`

2. **Restart Roblox Studio**

3. **Enable HTTP Requests**:
   - Open Game Settings > Security
   - Enable "Allow HTTP Requests"

## How It Works

The plugin uses a polling mechanism to communicate with the Stud desktop app:

1. Stud desktop runs a local HTTP server on `localhost:3001`
2. The plugin polls `/stud/poll` for pending requests
3. When a request is received, the plugin executes it and sends the response to `/stud/respond`

## Available Endpoints

| Endpoint               | Description                  |
| ---------------------- | ---------------------------- |
| `/ping`                | Check if plugin is running   |
| `/script/get`          | Read script source code      |
| `/script/set`          | Replace script source        |
| `/script/edit`         | Find/replace in script       |
| `/instance/children`   | List children of an instance |
| `/instance/properties` | Get instance properties      |
| `/instance/set`        | Set a property value         |
| `/instance/create`     | Create new instance          |
| `/instance/delete`     | Delete an instance           |
| `/instance/clone`      | Clone an instance            |
| `/instance/search`     | Search by name/class         |
| `/selection/get`       | Get selected objects         |
| `/code/run`            | Execute Luau code            |

## Toolbar

The plugin adds a "Stud" toolbar with a toggle button to enable/disable the connection.

## Troubleshooting

- **Plugin not loading**: Make sure the file is named `Stud.server.lua` (the `.server` suffix is important)
- **HTTP errors**: Enable HTTP Requests in Game Settings > Security
- **Connection issues**: Make sure Stud desktop is running on `localhost:3001`
