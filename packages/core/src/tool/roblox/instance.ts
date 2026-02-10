import z from "zod"
import { Tool } from "../tool"
import { studioRequest, isStudioConnected, notConnectedError } from "./client"

interface InstanceInfo {
  path: string
  name: string
  className: string
  children?: InstanceInfo[]
}

interface PropertyInfo {
  name: string
  value: string
  type: string
}

export const RobloxGetChildrenTool = Tool.define<
  z.ZodObject<{
    path: z.ZodString
    recursive: z.ZodOptional<z.ZodBoolean>
  }>,
  { path: string }
>("roblox_get_children", {
  description: `List the children of an instance in Roblox Studio.

Use this to explore the game hierarchy.
Set recursive=true to get all descendants (WARNING: can be very slow for large trees like game.Workspace).

Usage:
- Start with recursive=false (default) for large containers like Workspace. Only use recursive=true on smaller subtrees.
- Use roblox_search instead when looking for a specific instance by name or class.

Examples:
- game.Workspace
- game.ServerScriptService
- game.Players.Player1.Backpack`,
  parameters: z.object({
    path: z.string().describe("Full instance path (e.g. game.Workspace)"),
    recursive: z.boolean().optional().describe("If true, get all descendants recursively"),
  }),
  async execute(params) {
    if (!(await isStudioConnected())) {
      return { title: "Not connected", output: notConnectedError(), metadata: { path: params.path } }
    }

    const result = await studioRequest<InstanceInfo[]>("/instance/children", {
      path: params.path,
      recursive: params.recursive ?? false,
    })

    if (!result.success) {
      return { title: params.path, output: `Error: ${result.error}`, metadata: { path: params.path } }
    }

    const format = (items: InstanceInfo[], indent = 0): string => {
      return items
        .map((item) => {
          const prefix = "  ".repeat(indent)
          const line = `${prefix}- ${item.name} (${item.className})`
          if (item.children && item.children.length > 0) {
            return `${line}\n${format(item.children, indent + 1)}`
          }
          return line
        })
        .join("\n")
    }

    return {
      title: params.path,
      output: `Children of ${params.path}:\n\n${format(result.data)}`,
      metadata: { path: params.path },
    }
  },
})

export const RobloxGetPropertiesTool = Tool.define<
  z.ZodObject<{
    path: z.ZodString
  }>,
  { path: string }
>("roblox_get_properties", {
  description: `Get all properties of an instance in Roblox Studio.

Returns a list of property names, values, and types.
Useful for understanding what can be modified on an instance.`,
  parameters: z.object({
    path: z.string().describe("Full instance path"),
  }),
  async execute(params) {
    if (!(await isStudioConnected())) {
      return { title: "Not connected", output: notConnectedError(), metadata: { path: params.path } }
    }

    const result = await studioRequest<PropertyInfo[]>("/instance/properties", { path: params.path })

    if (!result.success) {
      return { title: params.path, output: `Error: ${result.error}`, metadata: { path: params.path } }
    }

    const lines = result.data.map((p) => `${p.name}: ${p.value} (${p.type})`).join("\n")

    return {
      title: params.path,
      output: `Properties of ${params.path}:\n\n${lines}`,
      metadata: { path: params.path },
    }
  },
})

export const RobloxSetPropertyTool = Tool.define<
  z.ZodObject<{
    path: z.ZodString
    property: z.ZodString
    value: z.ZodString
  }>,
  { path: string }
>("roblox_set_property", {
  description: `Set a property value on an instance in Roblox Studio.

The value is parsed based on the property type:
- Numbers: "10", "3.14"
- Booleans: "true", "false"
- Strings: "Hello World"
- Vector3: "1, 2, 3"
- Color3: "255, 128, 0" (RGB 0-255) or "#FF8800"
- BrickColor: "Bright red"
- Enum: "Enum.Material.Plastic"`,
  parameters: z.object({
    path: z.string().describe("Full instance path"),
    property: z.string().describe("Property name to set"),
    value: z.string().describe("New value for the property"),
  }),
  async execute(params) {
    if (!(await isStudioConnected())) {
      return { title: "Not connected", output: notConnectedError(), metadata: { path: params.path } }
    }

    const result = await studioRequest<{ path: string }>("/instance/set", {
      path: params.path,
      property: params.property,
      value: params.value,
    })

    if (!result.success) {
      return { title: params.path, output: `Error: ${result.error}`, metadata: { path: params.path } }
    }

    return {
      title: params.path,
      output: `Set ${params.property} = ${params.value} on ${result.data.path}`,
      metadata: { path: result.data.path },
    }
  },
})

export const RobloxCreateTool = Tool.define<
  z.ZodObject<{
    className: z.ZodString
    parent: z.ZodString
    name: z.ZodOptional<z.ZodString>
  }>,
  { path: string }
>("roblox_create", {
  description: `Create a new instance in Roblox Studio.

Common class names:
- Scripts: Script, LocalScript, ModuleScript
- Parts: Part, MeshPart, UnionOperation
- UI: ScreenGui, Frame, TextLabel, TextButton
- Values: StringValue, IntValue, BoolValue, ObjectValue
- Other: Folder, Model, RemoteEvent, RemoteFunction`,
  parameters: z.object({
    className: z.string().describe("The class name of the instance to create"),
    parent: z.string().describe("Full path to the parent instance"),
    name: z.string().optional().describe("Name for the new instance"),
  }),
  async execute(params) {
    if (!(await isStudioConnected())) {
      return { title: "Not connected", output: notConnectedError(), metadata: { path: params.parent } }
    }

    const result = await studioRequest<{ path: string }>("/instance/create", {
      className: params.className,
      parent: params.parent,
      name: params.name,
    })

    if (!result.success) {
      return { title: params.parent, output: `Error: ${result.error}`, metadata: { path: params.parent } }
    }

    return {
      title: result.data.path,
      output: `Created ${params.className} at ${result.data.path}`,
      metadata: { path: result.data.path },
    }
  },
})

export const RobloxDeleteTool = Tool.define<
  z.ZodObject<{
    path: z.ZodString
  }>,
  { path: string }
>("roblox_delete", {
  description: `Delete an instance from Roblox Studio.

This permanently removes the instance and all its descendants.
Use with caution - this cannot be undone through the tool.`,
  parameters: z.object({
    path: z.string().describe("Full instance path to delete"),
  }),
  async execute(params, ctx) {
    if (!(await isStudioConnected())) {
      return { title: "Not connected", output: notConnectedError(), metadata: { path: params.path } }
    }

    await ctx.ask({
      permission: "write",
      patterns: [params.path],
      always: [],
      metadata: {},
    })

    const result = await studioRequest<{ deleted: string }>("/instance/delete", { path: params.path })

    if (!result.success) {
      return { title: params.path, output: `Error: ${result.error}`, metadata: { path: params.path } }
    }

    return {
      title: params.path,
      output: `Deleted ${result.data.deleted}`,
      metadata: { path: result.data.deleted },
    }
  },
})

export const RobloxCloneTool = Tool.define<
  z.ZodObject<{
    path: z.ZodString
    parent: z.ZodOptional<z.ZodString>
  }>,
  { path: string }
>("roblox_clone", {
  description: `Clone an instance in Roblox Studio.

Creates a deep copy of the instance and all its descendants.
If parent is not specified, the clone is placed in the same parent as the original.`,
  parameters: z.object({
    path: z.string().describe("Full instance path to clone"),
    parent: z.string().optional().describe("Optional new parent path for the clone"),
  }),
  async execute(params) {
    if (!(await isStudioConnected())) {
      return { title: "Not connected", output: notConnectedError(), metadata: { path: params.path } }
    }

    const result = await studioRequest<{ path: string }>("/instance/clone", {
      path: params.path,
      parent: params.parent,
    })

    if (!result.success) {
      return { title: params.path, output: `Error: ${result.error}`, metadata: { path: params.path } }
    }

    return {
      title: result.data.path,
      output: `Cloned to ${result.data.path}`,
      metadata: { path: result.data.path },
    }
  },
})

export const RobloxSearchTool = Tool.define<
  z.ZodObject<{
    root: z.ZodOptional<z.ZodString>
    name: z.ZodOptional<z.ZodString>
    className: z.ZodOptional<z.ZodString>
    limit: z.ZodOptional<z.ZodNumber>
  }>,
  { count: number }
>("roblox_search", {
  description: `Search for instances in Roblox Studio by name or class.

At least one of name or className must be provided.
Name matching is case-insensitive and supports partial matches.`,
  parameters: z.object({
    root: z.string().optional().describe("Root path to search from (default: game)"),
    name: z.string().optional().describe("Name pattern to match"),
    className: z.string().optional().describe("Class name to filter by"),
    limit: z.number().optional().describe("Maximum results (default: 50)"),
  }),
  async execute(params) {
    if (!params.name && !params.className) {
      return {
        title: "Search",
        output: "Error: At least one of name or className must be provided",
        metadata: { count: 0 },
      }
    }

    if (!(await isStudioConnected())) {
      return { title: "Not connected", output: notConnectedError(), metadata: { count: 0 } }
    }

    const result = await studioRequest<InstanceInfo[]>("/instance/search", {
      root: params.root ?? "game",
      name: params.name,
      className: params.className,
      limit: params.limit ?? 50,
    })

    if (!result.success) {
      return { title: "Search", output: `Error: ${result.error}`, metadata: { count: 0 } }
    }

    if (result.data.length === 0) {
      return { title: "Search", output: "No instances found matching criteria", metadata: { count: 0 } }
    }

    const lines = result.data.map((item) => `- ${item.path} (${item.className})`).join("\n")

    return {
      title: `Found ${result.data.length}`,
      output: `Found ${result.data.length} instance(s):\n\n${lines}`,
      metadata: { count: result.data.length },
    }
  },
})

export const RobloxGetSelectionTool = Tool.define<z.ZodObject<{}>, { count: number }>("roblox_get_selection", {
  description: `Get the currently selected objects in Roblox Studio.

Returns the paths and class names of all selected instances.
Useful for operating on what the user has selected in the Explorer.`,
  parameters: z.object({}),
  async execute() {
    if (!(await isStudioConnected())) {
      return { title: "Not connected", output: notConnectedError(), metadata: { count: 0 } }
    }

    const result = await studioRequest<InstanceInfo[]>("/selection/get")

    if (!result.success) {
      return { title: "Selection", output: `Error: ${result.error}`, metadata: { count: 0 } }
    }

    if (result.data.length === 0) {
      return { title: "Selection", output: "No objects selected in Studio", metadata: { count: 0 } }
    }

    const lines = result.data.map((item) => `- ${item.path} (${item.className})`).join("\n")

    return {
      title: `${result.data.length} selected`,
      output: `Selected objects:\n\n${lines}`,
      metadata: { count: result.data.length },
    }
  },
})

export const RobloxRunCodeTool = Tool.define<
  z.ZodObject<{
    code: z.ZodString
  }>,
  { executed: boolean }
>("roblox_run_code", {
  description: `Execute Luau code in Roblox Studio.

The code runs in the command bar context with full access to game services.
Use print() to output results — they will be captured and returned.

Usage:
- This is a powerful and token-efficient tool. Use it freely for complex-yet-safe operations: building structures, batch-modifying instances with logic, positioning models, reading runtime state, or any task that would require many individual tool calls.
- For simple single-instance operations (create one part, set one property), prefer the dedicated tools for clarity.
- NEVER use this to edit script source code. Use roblox_edit_script or roblox_set_script instead.

Examples:
- print(game.Workspace:GetChildren())
- game.Players.LocalPlayer.Character:MoveTo(Vector3.new(0, 10, 0))
- for _, part in game.Workspace:GetDescendants() do if part:IsA("BasePart") then part.Anchored = true end end`,
  parameters: z.object({
    code: z.string().describe("Luau code to execute"),
  }),
  async execute(params, ctx) {
    if (!(await isStudioConnected())) {
      return { title: "Not connected", output: notConnectedError(), metadata: { executed: false } }
    }

    await ctx.ask({
      permission: "write",
      patterns: ["roblox:execute"],
      always: [],
      metadata: {},
    })

    const result = await studioRequest<{ output: string; error?: string }>("/code/run", { code: params.code })

    if (!result.success) {
      return { title: "Run code", output: `Error: ${result.error}`, metadata: { executed: false } }
    }

    if (result.data.error) {
      return {
        title: "Run code",
        output: `Script error:\n${result.data.error}`,
        metadata: { executed: false },
      }
    }

    return {
      title: "Run code",
      output: result.data.output || "Code executed successfully (no output)",
      metadata: { executed: true },
    }
  },
})

export const RobloxMoveTool = Tool.define<
  z.ZodObject<{
    path: z.ZodString
    newParent: z.ZodString
  }>,
  { path: string }
>("roblox_move", {
  description: `Move an instance to a new parent (reparent).

Changes the Parent property of the instance to the new location.
The instance keeps all its properties and children.

Examples:
- Move a part to a folder: path="game.Workspace.Part1", newParent="game.Workspace.MyFolder"
- Move a script to ServerScriptService: path="game.Workspace.Script", newParent="game.ServerScriptService"`,
  parameters: z.object({
    path: z.string().describe("Full instance path to move"),
    newParent: z.string().describe("Full path to the new parent"),
  }),
  async execute(params) {
    if (!(await isStudioConnected())) {
      return { title: "Not connected", output: notConnectedError(), metadata: { path: params.path } }
    }

    const result = await studioRequest<{ path: string }>("/instance/move", {
      path: params.path,
      newParent: params.newParent,
    })

    if (!result.success) {
      return { title: params.path, output: `Error: ${result.error}`, metadata: { path: params.path } }
    }

    return {
      title: result.data.path,
      output: `Moved to ${result.data.path}`,
      metadata: { path: result.data.path },
    }
  },
})

interface BulkCreateItem {
  className: string
  parent: string
  name?: string
}

export const RobloxBulkCreateTool = Tool.define<
  z.ZodObject<{
    instances: z.ZodArray<
      z.ZodObject<{
        className: z.ZodString
        parent: z.ZodString
        name: z.ZodOptional<z.ZodString>
      }>
    >
  }>,
  { count: number }
>("roblox_bulk_create", {
  description: `Create multiple instances at once.

More efficient than calling roblox_create multiple times.
Each item specifies className, parent, and optional name.

Example: Create 5 parts in workspace
[
  { className: "Part", parent: "game.Workspace", name: "Part1" },
  { className: "Part", parent: "game.Workspace", name: "Part2" },
  ...
]`,
  parameters: z.object({
    instances: z
      .array(
        z.object({
          className: z.string().describe("Class name of the instance"),
          parent: z.string().describe("Parent path"),
          name: z.string().optional().describe("Optional name"),
        }),
      )
      .describe("Array of instances to create"),
  }),
  async execute(params) {
    if (!(await isStudioConnected())) {
      return { title: "Not connected", output: notConnectedError(), metadata: { count: 0 } }
    }

    const result = await studioRequest<{ created: string[] }>("/instance/bulk-create", {
      instances: params.instances,
    })

    if (!result.success) {
      return { title: "Bulk create", output: `Error: ${result.error}`, metadata: { count: 0 } }
    }

    const paths = result.data.created
    return {
      title: `Created ${paths.length}`,
      output: `Created ${paths.length} instance(s):\n${paths.map((p) => `- ${p}`).join("\n")}`,
      metadata: { count: paths.length },
    }
  },
})

export const RobloxBulkDeleteTool = Tool.define<
  z.ZodObject<{
    paths: z.ZodArray<z.ZodString>
  }>,
  { count: number }
>("roblox_bulk_delete", {
  description: `Delete multiple instances at once.

More efficient than calling roblox_delete multiple times.
All specified instances and their descendants will be destroyed.

WARNING: This cannot be undone through the tool.`,
  parameters: z.object({
    paths: z.array(z.string()).describe("Array of instance paths to delete"),
  }),
  async execute(params, ctx) {
    if (!(await isStudioConnected())) {
      return { title: "Not connected", output: notConnectedError(), metadata: { count: 0 } }
    }

    await ctx.ask({
      permission: "write",
      patterns: params.paths,
      always: [],
      metadata: {},
    })

    const result = await studioRequest<{ deleted: string[] }>("/instance/bulk-delete", {
      paths: params.paths,
    })

    if (!result.success) {
      return { title: "Bulk delete", output: `Error: ${result.error}`, metadata: { count: 0 } }
    }

    const deleted = result.data.deleted
    return {
      title: `Deleted ${deleted.length}`,
      output: `Deleted ${deleted.length} instance(s):\n${deleted.map((p) => `- ${p}`).join("\n")}`,
      metadata: { count: deleted.length },
    }
  },
})

interface BulkSetItem {
  path: string
  property: string
  value: string
}

export const RobloxBulkSetPropertyTool = Tool.define<
  z.ZodObject<{
    operations: z.ZodArray<
      z.ZodObject<{
        path: z.ZodString
        property: z.ZodString
        value: z.ZodString
      }>
    >
  }>,
  { count: number }
>("roblox_bulk_set_property", {
  description: `Set properties on multiple instances at once.

More efficient than calling roblox_set_property multiple times.
Each operation specifies path, property name, and value.

Example: Make all parts red and anchored
[
  { path: "game.Workspace.Part1", property: "BrickColor", value: "Bright red" },
  { path: "game.Workspace.Part1", property: "Anchored", value: "true" },
  { path: "game.Workspace.Part2", property: "BrickColor", value: "Bright red" },
  ...
]`,
  parameters: z.object({
    operations: z
      .array(
        z.object({
          path: z.string().describe("Instance path"),
          property: z.string().describe("Property name"),
          value: z.string().describe("New value"),
        }),
      )
      .describe("Array of property set operations"),
  }),
  async execute(params) {
    if (!(await isStudioConnected())) {
      return { title: "Not connected", output: notConnectedError(), metadata: { count: 0 } }
    }

    const result = await studioRequest<{ updated: number; errors?: string[] }>("/instance/bulk-set", {
      operations: params.operations,
    })

    if (!result.success) {
      return { title: "Bulk set", output: `Error: ${result.error}`, metadata: { count: 0 } }
    }

    const output = [`Updated ${result.data.updated} properties`]
    if (result.data.errors && result.data.errors.length > 0) {
      output.push(`\nErrors:\n${result.data.errors.map((e) => `- ${e}`).join("\n")}`)
    }

    return {
      title: `Set ${result.data.updated} properties`,
      output: output.join("\n"),
      metadata: { count: result.data.updated },
    }
  },
})
