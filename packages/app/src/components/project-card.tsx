import { createMemo, Show } from "solid-js"
import { Icon } from "@stud/ui/icon"
import { DateTime } from "luxon"

export type DiscoveredProject = {
  path: string
  name: string
  type: "rojo" | "wally" | "rbxl" | "rbxlx" | "rbxm" | "unknown"
  lastModified: number
  indicators: string[]
}

type ProjectCardProps = {
  project: DiscoveredProject
  onClick: () => void
  homedir?: string
}

const TYPE_ICONS: Record<DiscoveredProject["type"], any> = {
  rojo: "branch",
  wally: "archive",
  rbxl: "dot-grid",
  rbxlx: "dot-grid",
  rbxm: "cube",
  unknown: "folder",
}

const TYPE_LABELS: Record<DiscoveredProject["type"], string> = {
  rojo: "Rojo Project",
  wally: "Wally Package",
  rbxl: "Place File",
  rbxlx: "Place File",
  rbxm: "Model File",
  unknown: "Project",
}

const TYPE_COLORS: Record<DiscoveredProject["type"], string> = {
  rojo: "bg-blue-500/20 text-blue-400",
  wally: "bg-purple-500/20 text-purple-400",
  rbxl: "bg-green-500/20 text-green-400",
  rbxlx: "bg-green-500/20 text-green-400",
  rbxm: "bg-orange-500/20 text-orange-400",
  unknown: "bg-gray-500/20 text-gray-400",
}

export function ProjectCard(props: ProjectCardProps) {
  const displayPath = createMemo(() => {
    if (props.homedir) {
      return props.project.path.replace(props.homedir, "~")
    }
    return props.project.path
  })

  const relativeTime = createMemo(() => {
    return DateTime.fromMillis(props.project.lastModified).toRelative()
  })

  const badges = createMemo(() => {
    const result: string[] = []
    for (const indicator of props.project.indicators) {
      if (indicator === "wally.toml") result.push("Wally")
      if (indicator === "aftman.toml") result.push("Aftman")
      if (indicator === "selene.toml") result.push("Selene")
      if (indicator === ".luaurc") result.push("Luau")
    }
    return result.slice(0, 3)
  })

  return (
    <button
      type="button"
      onClick={props.onClick}
      class="group relative flex flex-col p-4 rounded-xl border border-border-weak-base bg-surface-base hover:bg-surface-base-hover hover:border-border-base transition-all duration-150 text-left cursor-pointer"
    >
      {/* Header */}
      <div class="flex items-start gap-3 mb-3">
        <div class={`flex items-center justify-center size-10 rounded-lg ${TYPE_COLORS[props.project.type]}`}>
          <Icon name={TYPE_ICONS[props.project.type]} size="normal" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-14-medium text-text-strong truncate">{props.project.name}</div>
          <div class="text-12-regular text-text-weak">{TYPE_LABELS[props.project.type]}</div>
        </div>
      </div>

      {/* Path */}
      <div class="text-12-mono text-text-muted truncate mb-2">{displayPath()}</div>

      {/* Footer */}
      <div class="flex items-center justify-between mt-auto pt-2">
        <div class="flex gap-1.5">
          <Show when={badges().length > 0}>
            {badges().map((badge) => (
              <span class="px-1.5 py-0.5 text-10-medium rounded bg-surface-base-active text-text-weak">{badge}</span>
            ))}
          </Show>
        </div>
        <div class="text-12-regular text-text-muted">{relativeTime()}</div>
      </div>

      {/* Hover indicator */}
      <div class="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-border-focus-base pointer-events-none transition-all" />
    </button>
  )
}
