import { describe, test, expect, beforeAll, afterAll } from "bun:test"
import { RobloxDiscovery } from "./discovery"
import fs from "fs/promises"
import path from "path"
import os from "os"

const data = {
  dir: "",
  rojo: "",
  wally: "",
  rbxl: "",
  other: "",
}

const make = async (name: string) => {
  const dir = path.join(data.dir, name)
  await fs.mkdir(dir, { recursive: true })
  return dir
}

beforeAll(async () => {
  data.dir = await fs.mkdtemp(path.join(os.tmpdir(), "stud-roblox-"))
  data.rojo = await make("rojo")
  data.wally = await make("wally")
  data.rbxl = await make("rbxl")
  data.other = await make("other")

  await Bun.write(path.join(data.rojo, "default.project.json"), JSON.stringify({ name: "RojoProject" }))
  await Bun.write(path.join(data.wally, "wally.toml"), "")
  await Bun.write(path.join(data.rbxl, "place.rbxl"), "rbxl")
  await Bun.write(path.join(data.other, "note.txt"), "hi")

  const now = Date.now()
  await fs.utimes(data.rojo, new Date(now - 3000), new Date(now - 3000))
  await fs.utimes(data.wally, new Date(now - 2000), new Date(now - 2000))
  await fs.utimes(data.rbxl, new Date(now - 1000), new Date(now - 1000))
})

afterAll(async () => {
  if (!data.dir) return
  await fs.rm(data.dir, { recursive: true, force: true })
})

describe("RobloxDiscovery.scanSingle", () => {
  test("detects a Rojo project and reads name", async () => {
    const project = await RobloxDiscovery.scanSingle(data.rojo)
    expect(project).not.toBeNull()
    if (!project) return
    expect(project.type).toBe("rojo")
    expect(project.name).toBe("RojoProject")
    expect(project.indicators).toContain("default.project.json")
  })

  test("detects a Wally project", async () => {
    const project = await RobloxDiscovery.scanSingle(data.wally)
    expect(project).not.toBeNull()
    if (!project) return
    expect(project.type).toBe("wally")
    expect(project.name).toBe("wally")
    expect(project.indicators).toContain("wally.toml")
  })

  test("detects a place file project", async () => {
    const project = await RobloxDiscovery.scanSingle(data.rbxl)
    expect(project).not.toBeNull()
    if (!project) return
    expect(project.type).toBe("rbxl")
    expect(project.name).toBe("rbxl")
    expect(project.indicators).toContain("place.rbxl")
  })

  test("returns null when no indicators exist", async () => {
    const project = await RobloxDiscovery.scanSingle(data.other)
    expect(project).toBeNull()
  })
})

describe("RobloxDiscovery.discover", () => {
  test("returns unique projects sorted by lastModified", async () => {
    const projects = await RobloxDiscovery.discover([data.dir, data.dir])
    expect(projects.length).toBe(3)
    expect(projects[0]?.path).toBe(data.rbxl)
    expect(projects[1]?.path).toBe(data.wally)
    expect(projects[2]?.path).toBe(data.rojo)
  })
})

