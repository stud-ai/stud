import { createMemo, Show } from "solid-js"
import { Portal } from "solid-js/web"
import { useParams } from "@solidjs/router"
import { useLayout } from "@/context/layout"
import { useCommand } from "@/context/command"
import { useLanguage } from "@/context/language"
import { useSync } from "@/context/sync"
import { getFilename } from "@stud/util/path"
import { decode64 } from "@/utils/base64"

import { Icon } from "@stud/ui/icon"
import { IconButton } from "@stud/ui/icon-button"
import { Button } from "@stud/ui/button"
import { Tooltip, TooltipKeybind } from "@stud/ui/tooltip"
import { Keybind } from "@stud/ui/keybind"
import { StatusPopover } from "../status-popover"

export function SessionHeader() {
  const layout = useLayout()
  const params = useParams()
  const command = useCommand()
  const sync = useSync()
  const language = useLanguage()

  const projectDirectory = createMemo(() => decode64(params.dir) ?? "")
  const project = createMemo(() => {
    const directory = projectDirectory()
    if (!directory) return
    return layout.projects.list().find((p) => p.worktree === directory || p.sandboxes?.includes(directory))
  })
  const name = createMemo(() => {
    const current = project()
    if (current) return current.name || getFilename(current.worktree)
    return getFilename(projectDirectory())
  })
  const hotkey = createMemo(() => command.keybind("command.palette"))

  const currentSession = createMemo(() => sync.data.session.find((s) => s.id === params.id))
  const showReview = createMemo(() => !!currentSession())
  const sessionKey = createMemo(() => `${params.dir}${params.id ? "/" + params.id : ""}`)
  const view = createMemo(() => layout.view(sessionKey))

  const centerMount = createMemo(() => document.getElementById("opencode-titlebar-center"))
  const rightMount = createMemo(() => document.getElementById("opencode-titlebar-right"))

  return (
    <>
      <Show when={centerMount()}>
        {(mount) => (
          <Portal mount={mount()}>
            <button
              type="button"
              class="hidden md:flex w-[320px] p-1 pl-1.5 items-center gap-2 justify-between rounded-md border border-border-weak-base bg-surface-raised-base transition-colors cursor-default hover:bg-surface-raised-base-hover focus-visible:bg-surface-raised-base-hover active:bg-surface-raised-base-active"
              onClick={() => command.show()}
              aria-label={language.t("session.header.searchFiles")}
            >
              <div class="flex min-w-0 flex-1 items-center gap-2 overflow-visible">
                <Icon name="magnifying-glass" size="normal" class="icon-base shrink-0" />
                <span class="flex-1 min-w-0 text-14-regular text-text-weak truncate h-4.5 flex items-center">
                  {language.t("session.header.search.placeholder", { project: name() })}
                </span>
              </div>

              <Show when={hotkey()}>{(keybind) => <Keybind class="shrink-0">{keybind()}</Keybind>}</Show>
            </button>
          </Portal>
        )}
      </Show>
      <Show when={rightMount()}>
        {(mount) => (
          <Portal mount={mount()}>
            <div class="flex items-center gap-3">
              <StatusPopover />
              <div class="hidden md:flex items-center gap-3 ml-2 shrink-0">
                <Tooltip value={language.t("sidebar.threads")} placement="bottom">
                  <Button
                    variant="ghost"
                    class="group/left-sidebar-toggle size-6 p-0"
                    onClick={() => layout.leftSidebar.toggle()}
                    aria-label={language.t("sidebar.threads")}
                    aria-expanded={layout.leftSidebar.opened()}
                  >
                    <div class="relative flex items-center justify-center size-4 [&>*]:absolute [&>*]:inset-0">
                      <Icon
                        size="small"
                        name={layout.leftSidebar.opened() ? "layout-left-full" : "layout-left"}
                        class="group-hover/left-sidebar-toggle:hidden"
                      />
                      <Icon
                        size="small"
                        name="layout-left-partial"
                        class="hidden group-hover/left-sidebar-toggle:inline-block"
                      />
                      <Icon
                        size="small"
                        name={layout.leftSidebar.opened() ? "layout-left" : "layout-left-full"}
                        class="hidden group-active/left-sidebar-toggle:inline-block"
                      />
                    </div>
                  </Button>
                </Tooltip>
                <Tooltip value={language.t("planningMode.toggle")} placement="bottom">
                  <Button
                    variant="ghost"
                    class="size-6 p-0"
                    classList={{
                      "bg-white/10": layout.planningMode.enabled(),
                    }}
                    onClick={() => layout.planningMode.toggle()}
                    aria-label={language.t("planningMode.toggle")}
                    aria-pressed={layout.planningMode.enabled()}
                  >
                    <Icon
                      size="small"
                      name="checklist"
                      classList={{
                        "text-text-strong": layout.planningMode.enabled(),
                        "text-icon-base": !layout.planningMode.enabled(),
                      }}
                    />
                  </Button>
                </Tooltip>
                <TooltipKeybind
                  title={language.t("command.terminal.toggle")}
                  keybind={command.keybind("terminal.toggle")}
                >
                  <Button
                    variant="ghost"
                    class="group/terminal-toggle size-6 p-0"
                    onClick={() => view().terminal.toggle()}
                    aria-label={language.t("command.terminal.toggle")}
                    aria-expanded={view().terminal.opened()}
                    aria-controls="terminal-panel"
                  >
                    <div class="relative flex items-center justify-center size-4 [&>*]:absolute [&>*]:inset-0">
                      <Icon
                        size="small"
                        name={view().terminal.opened() ? "layout-bottom-full" : "layout-bottom"}
                        class="group-hover/terminal-toggle:hidden"
                      />
                      <Icon
                        size="small"
                        name="layout-bottom-partial"
                        class="hidden group-hover/terminal-toggle:inline-block"
                      />
                      <Icon
                        size="small"
                        name={view().terminal.opened() ? "layout-bottom" : "layout-bottom-full"}
                        class="hidden group-active/terminal-toggle:inline-block"
                      />
                    </div>
                  </Button>
                </TooltipKeybind>
              </div>
              <div class="hidden md:block shrink-0">
                <TooltipKeybind title={language.t("command.review.toggle")} keybind={command.keybind("review.toggle")}>
                  <Button
                    variant="ghost"
                    class="group/review-toggle size-6 p-0"
                    onClick={() => view().reviewPanel.toggle()}
                    aria-label={language.t("command.review.toggle")}
                    aria-expanded={view().reviewPanel.opened()}
                    aria-controls="review-panel"
                    tabIndex={showReview() ? 0 : -1}
                  >
                    <div class="relative flex items-center justify-center size-4 [&>*]:absolute [&>*]:inset-0">
                      <Icon
                        size="small"
                        name={view().reviewPanel.opened() ? "layout-right-full" : "layout-right"}
                        class="group-hover/review-toggle:hidden"
                      />
                      <Icon
                        size="small"
                        name="layout-right-partial"
                        class="hidden group-hover/review-toggle:inline-block"
                      />
                      <Icon
                        size="small"
                        name={view().reviewPanel.opened() ? "layout-right" : "layout-right-full"}
                        class="hidden group-active/review-toggle:inline-block"
                      />
                    </div>
                  </Button>
                </TooltipKeybind>
              </div>
            </div>
          </Portal>
        )}
      </Show>
    </>
  )
}
