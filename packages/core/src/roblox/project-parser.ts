import fs from "fs/promises"
import path from "path"
import { Log } from "../util/log"

const log = Log.create({ service: "rojo-parser" })

export namespace RojoParser {
  export interface InstanceNode {
    name: string
    className: string
    path: string
    filePath?: string
    children?: InstanceNode[]
  }

  interface RojoTree {
    $className?: string
    $path?: string
    $ignoreUnknownInstances?: boolean
    [key: string]: RojoTree | string | boolean | undefined
  }

  interface RojoProject {
    name: string
    tree: RojoTree
    globIgnorePaths?: string[]
    servePort?: number
    servePlaceIds?: number[]
  }

  const SCRIPT_EXTENSIONS = {
    ".server.lua": "Script",
    ".server.luau": "Script",
    ".client.lua": "LocalScript",
    ".client.luau": "LocalScript",
    ".lua": "ModuleScript",
    ".luau": "ModuleScript",
  } as const

  const INIT_FILES = [
    "init.lua",
    "init.luau",
    "init.server.lua",
    "init.server.luau",
    "init.client.lua",
    "init.client.luau",
    "init.meta.json",
  ]

  function getScriptClass(filename: string): string | null {
    for (const [ext, cls] of Object.entries(SCRIPT_EXTENSIONS)) {
      if (filename.endsWith(ext)) return cls
    }
    return null
  }

  function getInstanceName(filename: string): string {
    for (const ext of Object.keys(SCRIPT_EXTENSIONS)) {
      if (filename.endsWith(ext)) {
        return filename.slice(0, -ext.length)
      }
    }
    if (filename.endsWith(".model.json")) return filename.slice(0, -11)
    if (filename.endsWith(".meta.json")) return filename.slice(0, -10)
    return filename
  }

  function getInitClass(files: string[]): string | null {
    for (const file of files) {
      if (file === "init.server.lua" || file === "init.server.luau") return "Script"
      if (file === "init.client.lua" || file === "init.client.luau") return "LocalScript"
      if (file === "init.lua" || file === "init.luau") return "ModuleScript"
    }
    return null
  }

  async function scanDirectory(dirPath: string, instancePath: string, projectRoot: string): Promise<InstanceNode[]> {
    const nodes: InstanceNode[] = []

    let entries: Awaited<ReturnType<typeof fs.readdir>>
    try {
      entries = await fs.readdir(dirPath, { withFileTypes: true })
    } catch {
      return nodes
    }

    const files = entries.filter((e) => e.isFile()).map((e) => e.name)
    const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name)

    for (const file of files) {
      if (INIT_FILES.includes(file)) continue
      if (file.endsWith(".meta.json")) continue

      const cls = getScriptClass(file)
      if (!cls) continue

      const name = getInstanceName(file)
      const filePath = path.join(dirPath, file)
      const nodePath = `${instancePath}.${name}`

      nodes.push({
        name,
        className: cls,
        path: nodePath,
        filePath,
      })
    }

    for (const dir of dirs) {
      if (dir.startsWith(".")) continue
      if (dir === "node_modules" || dir === "Packages") continue

      const subDirPath = path.join(dirPath, dir)
      const nodePath = `${instancePath}.${dir}`

      let subEntries: Awaited<ReturnType<typeof fs.readdir>>
      try {
        subEntries = await fs.readdir(subDirPath, { withFileTypes: true })
      } catch {
        continue
      }

      const subFiles = subEntries.filter((e) => e.isFile()).map((e) => e.name)
      const initClass = getInitClass(subFiles)

      const children = await scanDirectory(subDirPath, nodePath, projectRoot)

      const initFile = subFiles.find((f) => INIT_FILES.includes(f) && !f.endsWith(".meta.json"))
      const filePath = initFile ? path.join(subDirPath, initFile) : undefined

      nodes.push({
        name: dir,
        className: initClass ?? "Folder",
        path: nodePath,
        filePath,
        children: children.length > 0 ? children : undefined,
      })
    }

    nodes.sort((a, b) => {
      const aIsContainer = a.children !== undefined || a.className === "Folder"
      const bIsContainer = b.children !== undefined || b.className === "Folder"
      if (aIsContainer && !bIsContainer) return -1
      if (!aIsContainer && bIsContainer) return 1
      return a.name.localeCompare(b.name)
    })

    return nodes
  }

  async function processTreeNode(
    node: RojoTree,
    name: string,
    instancePath: string,
    projectRoot: string,
  ): Promise<InstanceNode | null> {
    const className = node.$className ?? inferClassName(name)
    const children: InstanceNode[] = []

    if (node.$path) {
      const fsPath = path.isAbsolute(node.$path) ? node.$path : path.join(projectRoot, node.$path)

      let stat: Awaited<ReturnType<typeof fs.stat>>
      try {
        stat = await fs.stat(fsPath)
      } catch {
        return {
          name,
          className,
          path: instancePath,
          children: undefined,
        }
      }

      if (stat.isDirectory()) {
        const scanned = await scanDirectory(fsPath, instancePath, projectRoot)
        children.push(...scanned)
      } else if (stat.isFile()) {
        const scriptClass = getScriptClass(path.basename(fsPath))
        return {
          name,
          className: scriptClass ?? className,
          path: instancePath,
          filePath: fsPath,
        }
      }
    }

    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith("$")) continue
      if (typeof value !== "object" || value === null) continue

      const childPath = `${instancePath}.${key}`
      const child = await processTreeNode(value as RojoTree, key, childPath, projectRoot)
      if (child) children.push(child)
    }

    if (children.length > 0) {
      children.sort((a, b) => {
        const aIsContainer = a.children !== undefined || a.className === "Folder"
        const bIsContainer = b.children !== undefined || b.className === "Folder"
        if (aIsContainer && !bIsContainer) return -1
        if (!aIsContainer && bIsContainer) return 1
        return a.name.localeCompare(b.name)
      })
    }

    return {
      name,
      className,
      path: instancePath,
      children: children.length > 0 ? children : undefined,
    }
  }

  function inferClassName(name: string): string {
    const services: Record<string, string> = {
      Workspace: "Workspace",
      Players: "Players",
      Lighting: "Lighting",
      MaterialService: "MaterialService",
      ReplicatedFirst: "ReplicatedFirst",
      ReplicatedStorage: "ReplicatedStorage",
      ServerScriptService: "ServerScriptService",
      ServerStorage: "ServerStorage",
      StarterGui: "StarterGui",
      StarterPack: "StarterPack",
      StarterPlayer: "StarterPlayer",
      StarterPlayerScripts: "StarterPlayerScripts",
      StarterCharacterScripts: "StarterCharacterScripts",
      Teams: "Teams",
      SoundService: "SoundService",
      Chat: "Chat",
      LocalizationService: "LocalizationService",
      TestService: "TestService",
    }
    return services[name] ?? "Folder"
  }

  export async function parse(projectPath: string): Promise<InstanceNode | null> {
    let projectFile = path.join(projectPath, "default.project.json")

    try {
      await fs.access(projectFile)
    } catch {
      const entries = await fs.readdir(projectPath).catch(() => [])
      const altProject = entries.find((f) => f.endsWith(".project.json"))
      if (altProject) {
        projectFile = path.join(projectPath, altProject)
      } else {
        log.debug("no project file found", { projectPath })
        return null
      }
    }

    let project: RojoProject
    try {
      const content = await Bun.file(projectFile).text()
      project = JSON.parse(content)
    } catch (e) {
      log.error("failed to parse project file", { projectFile, error: e })
      return null
    }

    if (!project.tree) {
      log.debug("project has no tree", { projectFile })
      return null
    }

    log.debug("parsing rojo project", { name: project.name, projectFile })

    const tree = await processTreeNode(project.tree, project.name, "game", projectPath)
    return tree
  }

  export async function findProjectFile(directory: string): Promise<string | null> {
    const defaultFile = path.join(directory, "default.project.json")
    try {
      await fs.access(defaultFile)
      return defaultFile
    } catch {}

    const entries = await fs.readdir(directory).catch(() => [])
    const projectFile = entries.find((f) => f.endsWith(".project.json"))
    if (projectFile) return path.join(directory, projectFile)

    return null
  }
}
