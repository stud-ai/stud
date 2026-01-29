import { createMemo, createSignal, For, Index, onMount, Show } from "solid-js"
import { Motion, Presence } from "solid-motionone"
import { useParams, useNavigate } from "@solidjs/router"
import { useLanguage } from "@/context/language"
import { useGlobalSync } from "@/context/global-sync"
import { useDialog } from "@stud/ui/context/dialog"
import { base64Encode } from "@stud/util/encode"
import { decode64 } from "@/utils/base64"
import { Icon } from "@stud/ui/icon"
import { IconButton } from "@stud/ui/icon-button"
import { ResizeHandle } from "@stud/ui/resize-handle"
import { Collapsible } from "@stud/ui/collapsible"
import { Tooltip } from "@stud/ui/tooltip"
import { DialogProjectRules } from "@/components/dialog-project-rules"
import { DialogSettings } from "@/components/dialog-settings"
import { InstanceTree } from "@/components/instance-tree"
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
  const dialog = useDialog()
  const [mounted, setMounted] = createSignal(false)

  onMount(() => {
    setTimeout(() => setMounted(true), 50)
  })

  const openSettings = () => {
    dialog.show(() => <DialogSettings />)
  }

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
    const [store] = globalSync.child(dir, { bootstrap: true })
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

  const navigateToHome = () => {
    navigate("/")
  }

  const showProjectRules = () => {
    dialog.show(() => <DialogProjectRules />)
  }

  const isActive = (session: Session) => session.id === params.id

  return (
    <Motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, easing: [0.22, 1, 0.36, 1] }}
      class="relative flex flex-col h-full bg-[#09090b]"
      style={{ width: `${props.width}px` }}
    >
      {/* Navigation */}
      <div class="flex flex-col px-2 pt-3 pb-2 gap-0.5">
        <Motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: mounted() ? 1 : 0, x: mounted() ? 0 : -10 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          type="button"
          class="flex items-center gap-2.5 px-2.5 py-1.5 rounded text-13-medium text-text-muted hover:text-text-base hover:bg-white/5 active:scale-[0.98] transition-all duration-150 group"
          onClick={navigateToHome}
        >
          <Icon name="menu" size="small" class="text-text-subtle group-hover:text-text-base transition-colors" />
          <span>{language.t("sidebar.home")}</span>
        </Motion.button>
        <Motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: mounted() ? 1 : 0, x: mounted() ? 0 : -10 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          type="button"
          class="flex items-center gap-2.5 px-2.5 py-1.5 rounded text-13-medium text-text-muted hover:text-text-base hover:bg-white/5 active:scale-[0.98] transition-all duration-150 group"
          onClick={showProjectRules}
        >
          <Icon name="checklist" size="small" class="text-text-subtle group-hover:text-text-base transition-colors" />
          <span>{language.t("sidebar.projectRules")}</span>
        </Motion.button>
      </div>

      {/* Threads Section */}
      <div class="flex-1 min-h-0 flex flex-col mt-2">
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted() ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          class="flex items-center justify-between px-3 py-1.5 group"
        >
          <span class="text-11-medium text-text-subtle uppercase tracking-wider group-hover:text-text-weak transition-colors">
            {language.t("sidebar.threads")}
          </span>
          <IconButton
            icon="plus-small"
            variant="ghost"
            class="size-4 text-text-subtle hover:text-text-base hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-200"
            onClick={navigateToNewSession}
            aria-label={language.t("command.session.new")}
          />
        </Motion.div>

        <div class="flex-1 overflow-y-auto px-2">
          <div class="flex flex-col gap-0.5">
            <Index each={sessions()}>
              {(session, index) => (
                <Motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: mounted() ? 1 : 0, x: mounted() ? 0 : -10 }}
                  transition={{ duration: 0.25, delay: 0.25 + index * 0.03 }}
                  type="button"
                  class="flex items-center gap-2 px-2 py-1.5 rounded text-left transition-all duration-150 active:scale-[0.98]"
                  classList={{
                    "bg-white/5 text-text-strong": isActive(session()),
                    "text-text-muted hover:text-text-base hover:bg-white/5": !isActive(session()),
                  }}
                  onClick={() => navigateToSession(session())}
                >
                  <span class="flex-1 min-w-0 truncate text-13-regular">
                    {session().title || language.t("session.untitled")}
                  </span>
                </Motion.button>
              )}
            </Index>

            <Show when={sessions().length === 0}>
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: mounted() ? 0.6 : 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                class="px-2 py-2 text-13-regular text-text-subtle"
              >
                {language.t("sidebar.noThreads")}
              </Motion.div>
            </Show>
          </div>
        </div>
      </div>

      {/* Explorer Section */}
      <div class="mt-2 flex-1 min-h-0 flex flex-col">
        <Collapsible variant="ghost" class="w-full flex-1 min-h-0 flex flex-col" forceMount={false} open={true}>
          <Collapsible.Trigger>
            <div class="flex items-center justify-between px-3 py-1.5 group cursor-pointer hover:bg-white/5 rounded mx-1">
              <div class="flex items-center gap-1.5">
                <Icon name="chevron-down" size="small" class="text-text-subtle" />
                <span class="text-11-medium text-text-subtle uppercase tracking-wider group-hover:text-text-weak transition-colors">
                  {language.t("sidebar.instanceTree")}
                </span>
              </div>
            </div>
          </Collapsible.Trigger>
          <Collapsible.Content class="flex-1 min-h-0 overflow-y-auto">
            <InstanceTree
              directory={directory()}
              class="px-1"
              onFileClick={(filePath) => {
                // TODO: Open file in editor
                console.log("Open file:", filePath)
              }}
            />
          </Collapsible.Content>
        </Collapsible>
      </div>

      {/* Footer */}
      <Motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: mounted() ? 1 : 0, y: mounted() ? 0 : 10 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        class="mt-auto px-3 py-3 border-t border-white/5 flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <div class="size-5 rounded bg-orange-500/20 flex items-center justify-center text-orange-500">
            <Icon name="server" size="small" />
          </div>
          <div class="flex flex-col">
            <div class="text-12-medium text-text-base leading-none mb-0.5">{projectName()}</div>
            <div class="text-10-regular text-text-subtle leading-none">Stud v0.1.0</div>
          </div>
        </div>
        <Tooltip value={language.t("command.settings.open")} placement="top">
          <IconButton
            icon="settings-gear"
            variant="ghost"
            class="text-text-subtle hover:text-text-base hover:rotate-45 transition-all duration-300"
            onClick={openSettings}
            aria-label={language.t("command.settings.open")}
          />
        </Tooltip>
      </Motion.div>

      {/* Resize Handle */}
      <ResizeHandle direction="horizontal" size={props.width} min={200} max={400} onResize={props.onResize} />
    </Motion.div>
  )
}
