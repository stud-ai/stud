import { createMemo, For, Show } from "solid-js"
import { useParams, useNavigate } from "@solidjs/router"
import { useLanguage } from "@/context/language"
import { useGlobalSync } from "@/context/global-sync"
import { base64Encode } from "@stud/util/encode"
import { decode64 } from "@/utils/base64"
import { Icon } from "@stud/ui/icon"
import { IconButton } from "@stud/ui/icon-button"
import { ResizeHandle } from "@stud/ui/resize-handle"
import type { Session } from "@stud/sdk/v2/client"

interface SessionLeftSidebarProps {
  width: number
  onResize: (width: number) => void
}

export function SessionLeftSidebar(props: SessionLeftSidebarProps) {
  const params = useParams()
  const navigate = useNavigate()
  const globalSync = useGlobalSync()
  const language = useLanguage()

  const directory = createMemo(() => decode64(params.dir) ?? "")

  const projectName = createMemo(() => {
    const dir = directory()
    if (!dir) return "Project"
    const parts = dir.split("/").filter(Boolean)
    return parts[parts.length - 1] || "Project"
  })

  const sessions = createMemo(() => {
    const dir = directory()
    if (!dir) return []
    const [store] = globalSync.child(dir, { bootstrap: false })
    const now = Date.now()
    const oneMinuteAgo = now - 60 * 1000
    return store.session
      .filter((s) => s.directory === store.path.directory)
      .filter((s) => !s.parentID && !s.time?.archived)
      .toSorted((a, b) => {
        const aUpdated = a.time.updated ?? a.time.created
        const bUpdated = b.time.updated ?? b.time.created
        const aRecent = aUpdated > oneMinuteAgo
        const bRecent = bUpdated > oneMinuteAgo
        if (aRecent && bRecent) return a.id.localeCompare(b.id)
        if (aRecent && !bRecent) return -1
        if (!aRecent && bRecent) return 1
        return bUpdated - aUpdated
      })
  })

  const navigateToSession = (session: Session) => {
    navigate(`/${base64Encode(session.directory)}/session/${session.id}`)
  }

  const navigateToNewSession = () => {
    navigate(`/${params.dir}/session`)
  }

  const isActive = (session: Session) => session.id === params.id

  return (
    <div class="relative flex flex-col h-full bg-[#09090b]" style={{ width: `${props.width}px` }}>
      {/* Navigation */}
      <div class="flex flex-col px-2 pt-3 pb-2 gap-0.5">
        <button
          type="button"
          class="flex items-center gap-2.5 px-2.5 py-1.5 rounded text-13-medium text-text-muted hover:text-text-base hover:bg-white/5 transition-colors group"
        >
          <Icon name="menu" size="small" class="text-text-subtle group-hover:text-text-base transition-colors" />
          <span>Home</span>
        </button>
        <button
          type="button"
          class="flex items-center gap-2.5 px-2.5 py-1.5 rounded text-13-medium text-text-muted hover:text-text-base hover:bg-white/5 transition-colors group"
        >
          <Icon name="checklist" size="small" class="text-text-subtle group-hover:text-text-base transition-colors" />
          <span>Project Rules</span>
        </button>
      </div>

      {/* Threads Section */}
      <div class="flex-1 min-h-0 flex flex-col mt-2">
        <div class="flex items-center justify-between px-3 py-1.5 group">
          <span class="text-11-medium text-text-subtle uppercase tracking-wider group-hover:text-text-weak transition-colors">
            {language.t("sidebar.threads")}
          </span>
          <IconButton
            icon="plus-small"
            variant="ghost"
            class="size-4 text-text-subtle hover:text-text-base opacity-0 group-hover:opacity-100 transition-all"
            onClick={navigateToNewSession}
            aria-label={language.t("command.session.new")}
          />
        </div>

        <div class="flex-1 overflow-y-auto px-2">
          <div class="flex flex-col gap-0.5">
            <For each={sessions()}>
              {(session) => (
                <button
                  type="button"
                  class="flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors"
                  classList={{
                    "bg-white/5 text-text-strong": isActive(session),
                    "text-text-muted hover:text-text-base hover:bg-white/5": !isActive(session),
                  }}
                  onClick={() => navigateToSession(session)}
                >
                  <span class="flex-1 min-w-0 truncate text-13-regular">
                    {session.title || language.t("session.untitled")}
                  </span>
                </button>
              )}
            </For>

            <Show when={sessions().length === 0}>
              <div class="px-2 py-2 text-13-regular text-text-subtle">{language.t("sidebar.noThreads")}</div>
            </Show>
          </div>
        </div>
      </div>

      {/* Pages Section */}
      <div class="mt-2">
        <div class="flex items-center justify-between px-3 py-1.5 group">
          <span class="text-11-medium text-text-subtle uppercase tracking-wider group-hover:text-text-weak transition-colors">
            Pages
          </span>
          <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
            <IconButton
              icon="folder"
              variant="ghost"
              class="size-4 text-text-subtle hover:text-text-base"
              aria-label="Add folder"
            />
            <IconButton
              icon="plus-small"
              variant="ghost"
              class="size-4 text-text-subtle hover:text-text-base"
              aria-label="Add page"
            />
          </div>
        </div>

        {/* Explorer placeholder */}
        <div class="px-2 pb-2">
          <div class="flex items-center gap-2 px-2 py-1.5 text-13-regular text-text-muted opacity-60">
            <Icon name="folder" size="small" />
            <span>{language.t("sidebar.instanceTree.placeholder")}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div class="mt-auto px-3 py-3 border-t border-white/5 flex items-center gap-2">
        <div class="size-5 rounded bg-orange-500/20 flex items-center justify-center text-orange-500">
          <Icon name="server" size="small" />
        </div>
        <div class="flex flex-col">
          <div class="text-12-medium text-text-base leading-none mb-0.5">{projectName()}</div>
          <div class="text-10-regular text-text-subtle leading-none">Stud v0.1.0</div>
        </div>
      </div>

      {/* Resize Handle */}
      <ResizeHandle direction="horizontal" size={props.width} min={200} max={400} onResize={props.onResize} />
    </div>
  )
}
