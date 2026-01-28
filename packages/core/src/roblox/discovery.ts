import fs from "fs/promises"
import path from "path"
import os from "os"
import { Log } from "../util/log"
import z from "zod"

const log = Log.create({ service: "roblox-discovery" })

export namespace RobloxDiscovery {
  export const ProjectType = z.enum(["rojo", "wally", "rbxl", "rbxlx", "rbxm", "unknown"])
  export type ProjectType = z.infer<typeof ProjectType>

  export const Project = z.object({
    path: z.string(),
    name: z.string(),
    type: ProjectType,
    lastModified: z.number(),
    indicators: z.array(z.string()),
  })
  export type Project = z.infer<typeof Project>

  const ROBLOX_INDICATORS = {
    "default.project.json": "rojo",
    "*.project.json": "rojo",
    "wally.toml": "wally",
    "aftman.toml": "toolchain",
    "selene.toml": "linter",
    "sourcemap.json": "rojo-sourcemap",
    ".luaurc": "luau-config",
    "rotriever.toml": "rotriever",
  } as const

  const ROBLOX_FILE_EXTENSIONS = [".rbxl", ".rbxlx", ".rbxm", ".rbxmx"] as const

  async function exists(p: string): Promise<boolean> {
    try {
      await fs.access(p)
      return true
    } catch {
      return false
    }
  }

  async function getLastModified(p: string): Promise<number> {
    try {
      const stat = await fs.stat(p)
      return stat.mtimeMs
    } catch {
      return 0
    }
  }

  async function detectProjectType(dir: string): Promise<{ type: ProjectType; indicators: string[] }> {
    const indicators: string[] = []
    let type: ProjectType = "unknown"

    // Check for Rojo project files
    const files = await fs.readdir(dir).catch(() => [])

    for (const file of files) {
      if (file === "default.project.json" || file.endsWith(".project.json")) {
        indicators.push(file)
        type = "rojo"
      }
      if (file === "wally.toml") {
        indicators.push("wally.toml")
        if (type === "unknown") type = "wally"
      }
      if (file === "aftman.toml") {
        indicators.push("aftman.toml")
      }
      if (file === "selene.toml") {
        indicators.push("selene.toml")
      }
      if (file === "sourcemap.json") {
        indicators.push("sourcemap.json")
      }
      if (file === ".luaurc") {
        indicators.push(".luaurc")
      }
      // Check for Roblox place/model files
      for (const ext of ROBLOX_FILE_EXTENSIONS) {
        if (file.endsWith(ext)) {
          indicators.push(file)
          if (type === "unknown") {
            type = ext === ".rbxl" || ext === ".rbxlx" ? "rbxl" : "rbxm"
          }
        }
      }
    }

    return { type, indicators }
  }

  async function getProjectName(dir: string, indicators: string[]): Promise<string> {
    // Try to get name from default.project.json
    const projectJson = indicators.find((i) => i.endsWith(".project.json"))
    if (projectJson) {
      try {
        const content = await Bun.file(path.join(dir, projectJson)).json()
        if (content.name) return content.name
      } catch {}
    }

    // Fall back to directory name
    return path.basename(dir)
  }

  async function scanDirectory(dir: string, depth = 0, maxDepth = 3): Promise<Project[]> {
    if (depth > maxDepth) return []

    const projects: Project[] = []

    try {
      const { type, indicators } = await detectProjectType(dir)

      if (type !== "unknown" && indicators.length > 0) {
        const name = await getProjectName(dir, indicators)
        const lastModified = await getLastModified(dir)
        projects.push({
          path: dir,
          name,
          type,
          lastModified,
          indicators,
        })
        // Don't recurse into detected projects
        return projects
      }

      // Recurse into subdirectories
      const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => [])

      for (const entry of entries) {
        if (!entry.isDirectory()) continue
        if (entry.name.startsWith(".")) continue
        if (entry.name === "node_modules") continue
        if (entry.name === "Packages") continue // Wally packages
        if (entry.name === "target") continue
        if (entry.name === "build") continue
        if (entry.name === "dist") continue

        const subdir = path.join(dir, entry.name)
        const subProjects = await scanDirectory(subdir, depth + 1, maxDepth)
        projects.push(...subProjects)
      }
    } catch (e) {
      log.debug("scan error", { dir, error: e })
    }

    return projects
  }

  export async function discover(directories?: string[]): Promise<Project[]> {
    const home = os.homedir()

    const searchDirs = directories ?? [
      path.join(home, "Documents"),
      path.join(home, "Desktop"),
      path.join(home, "Projects"),
      path.join(home, "Developer"),
      path.join(home, "dev"),
      path.join(home, "Documents", "Roblox"),
      path.join(home, "Documents", "GitHub"),
    ]

    log.info("discovering roblox projects", { directories: searchDirs })

    const allProjects: Project[] = []

    for (const dir of searchDirs) {
      if (!(await exists(dir))) continue

      const projects = await scanDirectory(dir)
      allProjects.push(...projects)
    }

    // Deduplicate by path
    const seen = new Set<string>()
    const unique = allProjects.filter((p) => {
      if (seen.has(p.path)) return false
      seen.add(p.path)
      return true
    })

    // Sort by last modified (newest first)
    unique.sort((a, b) => b.lastModified - a.lastModified)

    log.info("discovered projects", { count: unique.length })

    return unique
  }

  export async function scanSingle(directory: string): Promise<Project | null> {
    const { type, indicators } = await detectProjectType(directory)

    if (type === "unknown" || indicators.length === 0) {
      return null
    }

    const name = await getProjectName(directory, indicators)
    const lastModified = await getLastModified(directory)

    return {
      path: directory,
      name,
      type,
      lastModified,
      indicators,
    }
  }
}
