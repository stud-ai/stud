import { DateTime } from "luxon"
import { For, Show, createMemo } from "solid-js"
import { Icon } from "@stud/ui/icon"
import type { ToolPart } from "@stud/sdk/v2/client"
import { useLanguage } from "@/context/language"
import { useSync } from "@/context/sync"

interface SessionLiveChangesProps {
  sessionID: string
  class?: string
}

type LiveAction = {
  part: ToolPart
  status: "pending" | "running" | "completed" | "error"
  timestamp: number
}

function toolTitle(tool: string) {
  if (tool === "roblox_insert_asset") return "Insert"
  if (tool === "roblox_create") return "Create"
  if (tool === "roblox_delete") return "Delete"
  if (tool === "roblox_clone") return "Clone"
  if (tool === "roblox_move") return "Move"
  if (tool === "roblox_set_property") return "Update"
  if (tool === "roblox_set_script") return "Write Script"
  if (tool === "roblox_edit_script") return "Edit Script"
  if (tool === "roblox_playtest_run") return "Playtest"
  if (tool === "roblox_bulk_create") return "Bulk Create"
  if (tool === "roblox_bulk_delete") return "Bulk Delete"
  if (tool === "roblox_bulk_set_property") return "Bulk Update"
  if (tool === "roblox_run_code") return "Run"
  if (tool === "roblox_toolbox_search") return "Toolbox Search"
  return tool.replace("roblox_", "").replaceAll("_", " ")
}

function toolSubtitle(part: ToolPart) {
  const input = part.state.input as Record<string, unknown>
  const path = input.path
  if (typeof path === "string" && path.length > 0) return path
  const parent = input.parent
  if (typeof parent === "string" && parent.length > 0) return parent
  const suite = input.suite
  if (typeof suite === "string" && suite.length > 0) return suite
  const keyword = input.keyword
  if (typeof keyword === "string" && keyword.length > 0) return `"${keyword}"`
  const className = input.className
  if (typeof className === "string" && className.length > 0) return className
  return undefined
}

function partTimestamp(part: ToolPart) {
  const state = part.state as {
    time?: {
      start?: number
      end?: number
    }
  }
  return state.time?.end ?? state.time?.start ?? 0
}

function statusTone(status: LiveAction["status"]) {
  if (status === "completed") return "text-text-success-base"
  if (status === "error") return "text-text-critical-base"
  return "text-text-weak"
}

function statusLabel(status: LiveAction["status"], language: ReturnType<typeof useLanguage>) {
  if (status === "running") return language.t("sidebar.instanceTree.liveChanges.status.running")
  if (status === "completed") return language.t("sidebar.instanceTree.liveChanges.status.done")
  if (status === "error") return language.t("sidebar.instanceTree.liveChanges.status.failed")
  return language.t("sidebar.instanceTree.liveChanges.status.pending")
}

export function SessionLiveChanges(props: SessionLiveChangesProps) {
  const sync = useSync()
  const language = useLanguage()

  const actions = createMemo(() => {
    const messages = sync.data.message[props.sessionID] ?? []
    const list: LiveAction[] = []

    for (const message of messages) {
      if (!message || message.role !== "assistant") continue
      const parts = sync.data.part[message.id] ?? []
      for (const part of parts) {
        if (!part || part.type !== "tool") continue
        if (!part.tool.startsWith("roblox_")) continue
        list.push({
          part,
          status: part.state.status,
          timestamp: partTimestamp(part),
        })
      }
    }

    return list.toSorted((a, b) => b.timestamp - a.timestamp)
  })

  const visible = createMemo(() => actions().slice(0, 8))

  const latestSynced = createMemo(() => {
    const action = actions().find((item) => item.status === "completed" || item.status === "error")
    if (!action || !action.timestamp) return language.t("sidebar.instanceTree.liveChanges.notSynced")
    const value = DateTime.fromMillis(action.timestamp).setLocale(language.locale()).toRelative()
    return value ?? language.t("sidebar.instanceTree.liveChanges.justNow")
  })

  const playtestStatus = createMemo(() => {
    const playtest = actions().find((item) => item.part.tool === "roblox_playtest_run" && item.status === "completed")
    if (!playtest) return undefined
    const metadata = (playtest.part.state as { metadata?: Record<string, unknown> }).metadata
    return metadata?.passed === true
  })

  return (
    <div class={`flex flex-col ${props.class ?? ""}`}>
      <div class="px-3 py-2 border-b border-border-weak-base flex items-center gap-2">
        <Icon name="checklist" size="small" class="text-icon-subtle" />
        <span class="text-11-medium text-text-subtle uppercase tracking-wider">
          {language.t("sidebar.instanceTree.liveChanges")}
        </span>
        <div class="ml-auto flex items-center gap-1.5">
          <span class="text-10-medium text-text-subtle px-1.5 py-0.5 rounded-full bg-surface-base">
            {actions().length} {language.t("sidebar.instanceTree.liveChanges.actions")}
          </span>
          <Show when={playtestStatus() === true}>
            <span class="text-10-medium text-text-success-base px-1.5 py-0.5 rounded-full bg-surface-success-base/15 border border-border-success-base">
              {language.t("sidebar.instanceTree.liveChanges.playtestPassed")}
            </span>
          </Show>
        </div>
      </div>

      <Show
        when={visible().length > 0}
        fallback={
          <div class="px-3 py-2 text-12-regular text-text-subtle opacity-70">
            {language.t("sidebar.instanceTree.liveChanges.empty")}
          </div>
        }
      >
        <div class="px-2 py-2 flex flex-col gap-1.5">
          <For each={visible()}>
            {(action) => (
              <div class="flex items-center gap-2 rounded-md border border-border-weak-base bg-surface-raised-base px-2 py-1.5">
                <div class={`text-11-medium min-w-16 ${statusTone(action.status)}`}>{toolTitle(action.part.tool)}</div>
                <div class="flex-1 min-w-0 text-11-regular text-text-weak truncate">{toolSubtitle(action.part) ?? "Studio"}</div>
                <div class={`text-10-medium ${statusTone(action.status)}`}>{statusLabel(action.status, language)}</div>
              </div>
            )}
          </For>
        </div>
      </Show>

      <div class="px-3 py-2 border-t border-border-weak-base text-10-regular text-text-subtle">
        {language.t("sidebar.instanceTree.liveChanges.lastSynced")}: {latestSynced()}
      </div>
    </div>
  )
}
