import { Hono } from "hono"
import { describeRoute, resolver, validator } from "hono-openapi"
import z from "zod"
import { lazy } from "../../util/lazy"
import { RojoParser } from "../../roblox/project-parser"
import { Instance } from "../../project/instance"
import { studioRequest, isStudioConnected } from "../../tool/roblox/client"

interface StudioInstanceInfo {
  path: string
  name: string
  className: string
  children?: StudioInstanceInfo[]
}

interface InstanceNode {
  name: string
  className: string
  path: string
  filePath?: string
  children?: InstanceNode[]
}

// Note: Using z.any() for the response schema because z.lazy() recursive schemas
// don't serialize properly to OpenAPI. The actual TypeScript types are correct.
const InstanceNodeSchema = z
  .object({
    name: z.string(),
    className: z.string(),
    path: z.string(),
    filePath: z.string().optional(),
    children: z.array(z.any()).optional().describe("Child instance nodes"),
  })
  .meta({ ref: "InstanceNode" })

/**
 * Convert Studio instance tree to our InstanceNode format
 */
function studioToInstanceNode(instance: StudioInstanceInfo): InstanceNode {
  return {
    name: instance.name,
    className: instance.className,
    path: instance.path,
    children: instance.children?.map(studioToInstanceNode),
  }
}

/**
 * Merge Rojo file paths into a Studio tree
 * This lets us show the full Studio tree but still know which instances have source files
 */
function mergeRojoFilePaths(studioNode: InstanceNode, rojoTree: InstanceNode | null): InstanceNode {
  if (!rojoTree) return studioNode

  // Find matching Rojo node by path
  const findRojoNode = (node: InstanceNode | null, path: string): InstanceNode | null => {
    if (!node) return null
    if (node.path === path) return node
    if (node.children) {
      for (const child of node.children) {
        const found = findRojoNode(child, path)
        if (found) return found
      }
    }
    return null
  }

  const rojoNode = findRojoNode(rojoTree, studioNode.path)

  return {
    ...studioNode,
    filePath: rojoNode?.filePath,
    children: studioNode.children?.map((child) => mergeRojoFilePaths(child, rojoTree)),
  }
}

/**
 * Fetch the full game tree from Studio
 */
async function fetchStudioTree(): Promise<InstanceNode | null> {
  const result = await studioRequest<StudioInstanceInfo[]>("/instance/children", {
    path: "game",
    recursive: true,
  })

  if (!result.success) {
    return null
  }

  // Build the DataModel node with children
  return {
    name: "game",
    className: "DataModel",
    path: "game",
    children: result.data.map(studioToInstanceNode),
  }
}

export const InstanceTreeRoutes = lazy(() =>
  new Hono()
    .get(
      "/tree",
      describeRoute({
        summary: "Get instance tree",
        description: "Get the parsed Rojo project instance tree for the current directory",
        operationId: "instance.tree",
        responses: {
          200: {
            description: "Instance tree",
            content: {
              "application/json": {
                schema: resolver(
                  z.object({
                    tree: InstanceNodeSchema.nullable(),
                    projectFile: z.string().nullable(),
                    source: z.enum(["studio", "rojo"]).optional(),
                  }),
                ),
              },
            },
          },
        },
      }),
      async (c) => {
        const directory = Instance.directory
        const useStudio = c.req.query("source") === "studio"

        // Get Rojo tree for file paths
        const rojoTree = await RojoParser.parse(directory)
        const projectFile = await RojoParser.findProjectFile(directory)

        // If studio mode requested and connected, fetch from Studio
        if (useStudio && (await isStudioConnected())) {
          const studioTree = await fetchStudioTree()
          if (studioTree) {
            // Merge Rojo file paths into Studio tree
            const mergedTree = mergeRojoFilePaths(studioTree, rojoTree)
            return c.json({ tree: mergedTree, projectFile, source: "studio" as const })
          }
        }

        // Fall back to Rojo tree
        return c.json({ tree: rojoTree, projectFile, source: "rojo" as const })
      },
    )
    .get(
      "/tree/:directory",
      describeRoute({
        summary: "Get instance tree for directory",
        description: "Get the parsed Rojo project instance tree for a specific directory",
        operationId: "instance.tree.directory",
        responses: {
          200: {
            description: "Instance tree",
            content: {
              "application/json": {
                schema: resolver(
                  z.object({
                    tree: InstanceNodeSchema.nullable(),
                    projectFile: z.string().nullable(),
                  }),
                ),
              },
            },
          },
        },
      }),
      validator("param", z.object({ directory: z.string() })),
      async (c) => {
        const directory = decodeURIComponent(c.req.valid("param").directory)
        const tree = await RojoParser.parse(directory)
        const projectFile = await RojoParser.findProjectFile(directory)
        return c.json({ tree, projectFile })
      },
    ),
)
