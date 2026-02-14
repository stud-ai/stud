import { Log } from "../util/log"
import { Global } from "../global"
import path from "path"
import fs from "fs/promises"
import { existsSync } from "fs"

const log = Log.create({ service: "migration" })

export namespace OpenCodeMigration {
  export interface DetectionResult {
    hasOpenCodeConfig: boolean
    hasOpenCodeAuth: boolean
    hasStudConfig: boolean
    hasStudAuth: boolean
    openCodeConfigPath?: string
    openCodeAuthPath?: string
    studConfigPath?: string
    studAuthPath?: string
  }

  export interface MigrationResult {
    migratedAuth: boolean
    migratedConfig: boolean
    errors: string[]
  }

  /**
   * Detect if user has existing OpenCode installation that can be migrated
   */
  export async function detect(): Promise<DetectionResult> {
    const result: DetectionResult = {
      hasOpenCodeConfig: false,
      hasOpenCodeAuth: false,
      hasStudConfig: false,
      hasStudAuth: false,
    }

    // Check for OpenCode config in multiple locations:
    // 1. ~/.opencode/ (legacy home directory)
    // 2. ~/.config/opencode/ (XDG config path)
    const openCodeHomePath = path.join(Global.Path.home, ".opencode")
    const openCodeXdgPath = path.join(Global.Path.home, ".config", "opencode")

    if (existsSync(openCodeHomePath)) {
      result.hasOpenCodeConfig = true
      result.openCodeConfigPath = openCodeHomePath
    } else if (existsSync(openCodeXdgPath)) {
      result.hasOpenCodeConfig = true
      result.openCodeConfigPath = openCodeXdgPath
    }

    // Check for OpenCode auth file (~/.local/share/opencode/auth.json)
    const openCodeDataDir = path.join(Global.Path.home, ".local", "share", "opencode")
    const openCodeAuthPath = path.join(openCodeDataDir, "auth.json")
    if (existsSync(openCodeAuthPath)) {
      result.hasOpenCodeAuth = true
      result.openCodeAuthPath = openCodeAuthPath
    }

    // Check for Stud config - use Global.Path.config (XDG compliant: ~/.config/stud)
    // Also check ~/.stud/ for backwards compatibility
    const studXdgConfigDir = Global.Path.config
    const studHomeConfigDir = path.join(Global.Path.home, ".stud")

    if (existsSync(studXdgConfigDir)) {
      result.hasStudConfig = true
      result.studConfigPath = studXdgConfigDir
    } else if (existsSync(studHomeConfigDir)) {
      result.hasStudConfig = true
      result.studConfigPath = studHomeConfigDir
    }

    // Check for Stud auth file (~/.local/share/stud/auth.json)
    const studAuthPath = path.join(Global.Path.data, "auth.json")
    if (existsSync(studAuthPath)) {
      result.hasStudAuth = true
      result.studAuthPath = studAuthPath
    }

    return result
  }

  /**
   * Migrate OpenCode configuration and auth to Stud paths.
   * This runs silently on first start if OpenCode config exists but Stud config doesn't.
   */
  export async function migrate(): Promise<MigrationResult> {
    const result: MigrationResult = {
      migratedAuth: false,
      migratedConfig: false,
      errors: [],
    }

    const detection = await detect()

    // Migrate auth if OpenCode auth exists but Stud auth doesn't
    if (detection.hasOpenCodeAuth && !detection.hasStudAuth && detection.openCodeAuthPath) {
      try {
        const studDataDir = Global.Path.data
        await fs.mkdir(studDataDir, { recursive: true })

        const authContent = await fs.readFile(detection.openCodeAuthPath, "utf-8")
        const studAuthPath = path.join(studDataDir, "auth.json")

        await fs.writeFile(studAuthPath, authContent, { mode: 0o600 })
        result.migratedAuth = true
        log.info("migrated auth from OpenCode", {
          from: detection.openCodeAuthPath,
          to: studAuthPath,
        })
      } catch (err) {
        const message = `Failed to migrate auth: ${err instanceof Error ? err.message : String(err)}`
        result.errors.push(message)
        log.error("failed to migrate auth", { error: err })
      }
    }

    // Migrate global config if OpenCode config exists but Stud config doesn't
    if (detection.hasOpenCodeConfig && !detection.hasStudConfig && detection.openCodeConfigPath) {
      try {
        // Use XDG-compliant path for new Stud config
        const studConfigDir = Global.Path.config
        await fs.mkdir(studConfigDir, { recursive: true })

        // Copy config files (opencode.json, opencode.jsonc) to stud equivalents
        const configFiles = ["opencode.json", "opencode.jsonc"]
        for (const file of configFiles) {
          const srcPath = path.join(detection.openCodeConfigPath, file)
          if (existsSync(srcPath)) {
            const content = await fs.readFile(srcPath, "utf-8")
            // Write as stud.json/stud.jsonc
            const destFile = file.replace("opencode", "stud")
            const destPath = path.join(studConfigDir, destFile)
            await fs.writeFile(destPath, content)
            log.info("migrated config file", { from: srcPath, to: destPath })
          }
        }

        // Copy subdirectories (command/, agent/, skill/, plugin/)
        const subdirs = ["command", "commands", "agent", "agents", "skill", "skills", "plugin", "plugins"]
        for (const subdir of subdirs) {
          const srcDir = path.join(detection.openCodeConfigPath, subdir)
          if (existsSync(srcDir)) {
            const destDir = path.join(studConfigDir, subdir)
            await copyDir(srcDir, destDir)
            log.info("migrated config directory", { from: srcDir, to: destDir })
          }
        }

        result.migratedConfig = true
        log.info("migrated config from OpenCode", {
          from: detection.openCodeConfigPath,
          to: studConfigDir,
        })
      } catch (err) {
        const message = `Failed to migrate config: ${err instanceof Error ? err.message : String(err)}`
        result.errors.push(message)
        log.error("failed to migrate config", { error: err })
      }
    }

    return result
  }

  /**
   * Check if migration should run (OpenCode exists but Stud doesn't)
   */
  export async function shouldMigrate(): Promise<boolean> {
    const detection = await detect()
    return (
      (detection.hasOpenCodeAuth && !detection.hasStudAuth) ||
      (detection.hasOpenCodeConfig && !detection.hasStudConfig)
    )
  }

  /**
   * Run migration if needed. Call this on app startup.
   */
  export async function runIfNeeded(): Promise<MigrationResult | null> {
    if (await shouldMigrate()) {
      log.info("detected OpenCode installation, migrating to Stud paths...")
      return await migrate()
    }
    return null
  }
}

/**
 * Recursively copy a directory
 */
async function copyDir(src: string, dest: string): Promise<void> {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath)
    } else {
      await fs.copyFile(srcPath, destPath)
    }
  }
}
