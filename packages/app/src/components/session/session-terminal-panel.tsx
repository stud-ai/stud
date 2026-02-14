import { createEffect, createMemo, createSignal, For, on, onMount, Show, type JSX } from "solid-js"
import { createStore } from "solid-js/store"
import { Motion, Presence } from "solid-motionone"
import {
  closestCenter,
  createSortable,
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
} from "@thisbeyond/solid-dnd"
import type { DragEvent } from "@thisbeyond/solid-dnd"
import { Icon } from "@stud/ui/icon"
import { IconButton } from "@stud/ui/icon-button"
import { Tabs } from "@stud/ui/tabs"
import { Tooltip, TooltipKeybind } from "@stud/ui/tooltip"
import { DropdownMenu } from "@stud/ui/dropdown-menu"
import { ResizeHandle } from "@stud/ui/resize-handle"
import { useLayout } from "@/context/layout"
import { useTerminal, type LocalPTY } from "@/context/terminal"
import { useLanguage } from "@/context/language"
import { useCommand } from "@/context/command"
import { useSDK } from "@/context/sdk"
import { Terminal } from "@/components/terminal"
import { ConstrainDragYAxis } from "@/utils/solid-dnd"

interface TerminalPanelProps {
  onClose?: () => void
  handoffTerminals?: string[]
}

export function SessionTerminalPanel(props: TerminalPanelProps) {
  const layout = useLayout()
  const terminal = useTerminal()
  const language = useLanguage()
  const command = useCommand()
  const sdk = useSDK()

  const [store, setStore] = createStore({
    activeDraggable: undefined as string | undefined,
    mounted: false,
  })

  onMount(() => {
    setTimeout(() => setStore("mounted", true), 50)
  })

  // Clear the active terminal by sending clear command
  const clearTerminal = () => {
    const activeId = terminal.active()
    if (!activeId) return
    // Send clear escape sequence via the PTY websocket
    const url = new URL(sdk.url + `/pty/${activeId}/connect?directory=${encodeURIComponent(sdk.directory)}`)
    if (window.__STUD__?.serverPassword) {
      url.username = "opencode"
      url.password = window.__STUD__?.serverPassword
    }
    const ws = new WebSocket(url)
    ws.onopen = () => {
      // Send "clear" command followed by enter
      ws.send("clear\r")
      ws.close()
    }
  }

  // Kill the active terminal process
  const killTerminal = () => {
    const activeId = terminal.active()
    if (!activeId) return
    const count = terminal.all().length
    terminal.close(activeId)
    if (count === 1) props.onClose?.()
  }

  const handleDragStart = (event: unknown) => {
    const id = getDraggableId(event)
    if (!id) return
    setStore("activeDraggable", id)
  }

  const handleDragOver = (event: DragEvent) => {
    const { draggable, droppable } = event
    if (draggable && droppable) {
      const terminals = terminal.all()
      const fromIndex = terminals.findIndex((t) => t.id === draggable.id.toString())
      const toIndex = terminals.findIndex((t) => t.id === droppable.id.toString())
      if (fromIndex !== toIndex && toIndex !== -1) {
        terminal.move(draggable.id.toString(), toIndex)
      }
    }
  }

  const handleDragEnd = () => {
    setStore("activeDraggable", undefined)
    const activeId = terminal.active()
    if (!activeId) return
    requestAnimationFrame(() => {
      const wrapper = document.getElementById(`terminal-wrapper-${activeId}`)
      const element = wrapper?.querySelector('[data-component="terminal"]') as HTMLElement
      element?.querySelector("textarea")?.focus()
    })
  }

  const getDraggableId = (event: unknown): string | undefined => {
    if (typeof event !== "object" || event === null) return undefined
    if (!("draggable" in event)) return undefined
    const draggable = (event as { draggable?: { id?: unknown } }).draggable
    if (!draggable) return undefined
    return typeof draggable.id === "string" ? draggable.id : undefined
  }

  const getTabLabel = (pty: LocalPTY) => {
    const title = pty.title
    const number = pty.titleNumber
    const isDefaultTitle = (() => {
      if (!Number.isFinite(number) || number <= 0) return false
      const match = title.match(/^Terminal (\d+)$/)
      if (!match) return false
      const parsed = Number(match[1])
      return Number.isFinite(parsed) && parsed === number
    })()

    if (title && !isDefaultTitle) return title
    if (Number.isFinite(number) && number > 0) {
      return language.t("terminal.title.numbered", { number })
    }
    return title || language.t("terminal.title")
  }

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2, easing: [0.22, 1, 0.36, 1] }}
      id="terminal-panel"
      role="region"
      aria-label={language.t("terminal.title")}
      class="relative w-full flex flex-col shrink-0 border-t border-border-weak-base bg-background-stronger"
      style={{ height: `${layout.terminal.height()}px` }}
    >
      {/* Resize Handle */}
      <ResizeHandle
        direction="vertical"
        size={layout.terminal.height()}
        min={120}
        max={window.innerHeight * 0.6}
        collapseThreshold={60}
        onResize={layout.terminal.resize}
        onCollapse={props.onClose}
      />

      <Show
        when={terminal.ready()}
        fallback={
          <div class="flex flex-col h-full pointer-events-none">
            <div class="h-9 flex items-center gap-2 px-3 border-b border-border-weak-base bg-background-stronger">
              <For each={props.handoffTerminals}>
                {(title) => (
                  <div class="px-2.5 py-1 rounded bg-white/5 text-12-medium text-text-subtle truncate max-w-32">
                    {title}
                  </div>
                )}
              </For>
              <div class="flex-1" />
              <div class="text-text-subtle text-12-regular animate-pulse">{language.t("common.loading")}...</div>
            </div>
            <div class="flex-1 flex items-center justify-center text-text-subtle">
              <Icon name="console" size="large" class="mr-2 opacity-50" />
              {language.t("terminal.loading")}
            </div>
          </div>
        }
      >
        <DragDropProvider
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          collisionDetector={closestCenter}
        >
          <DragDropSensors />
          <ConstrainDragYAxis />
          <div class="flex flex-col h-full">
            {/* Terminal Header/Tabs */}
            <div class="h-9 flex items-center border-b border-border-weak-base bg-background-stronger">
              {/* Tab List */}
              <div class="flex-1 flex items-center h-full overflow-x-auto scrollbar-none">
                <Tabs
                  variant="alt"
                  value={terminal.active()}
                  onChange={(id) => terminal.open(id)}
                  class="!h-full !flex-none"
                >
                  <Tabs.List class="h-full gap-0 border-0">
                    <SortableProvider ids={terminal.all().map((t) => t.id)}>
                      <For each={terminal.all()}>
                        {(pty, index) => (
                          <TerminalTab
                            pty={pty}
                            isActive={terminal.active() === pty.id}
                            index={index()}
                            mounted={store.mounted}
                            onClose={() => {
                              const count = terminal.all().length
                              terminal.close(pty.id)
                              if (count === 1) props.onClose?.()
                            }}
                          />
                        )}
                      </For>
                    </SortableProvider>
                  </Tabs.List>
                </Tabs>
              </div>

              {/* Actions */}
              <div class="flex items-center gap-1 px-2 border-l border-border-weak-base">
                <Tooltip value={language.t("terminal.clear")} placement="bottom">
                  <IconButton
                    icon="trash"
                    variant="ghost"
                    class="size-6 text-text-subtle hover:text-text-base"
                    onClick={clearTerminal}
                    aria-label={language.t("terminal.clear")}
                  />
                </Tooltip>
                <Tooltip value={language.t("terminal.kill")} placement="bottom">
                  <IconButton
                    icon="stop"
                    variant="ghost"
                    class="size-6 text-text-subtle hover:text-red-400"
                    onClick={killTerminal}
                    aria-label={language.t("terminal.kill")}
                  />
                </Tooltip>
                <div class="w-px h-4 bg-border-weak-base mx-1" />
                <TooltipKeybind title={language.t("command.terminal.new")} keybind={command.keybind("terminal.new")}>
                  <IconButton
                    icon="plus-small"
                    variant="ghost"
                    class="size-6 text-text-subtle hover:text-text-base"
                    onClick={terminal.new}
                    aria-label={language.t("command.terminal.new")}
                  />
                </TooltipKeybind>
                <Tooltip value={language.t("terminal.close")} placement="bottom">
                  <IconButton
                    icon="chevron-down"
                    variant="ghost"
                    class="size-6 text-text-subtle hover:text-text-base"
                    onClick={props.onClose}
                    aria-label={language.t("terminal.close")}
                  />
                </Tooltip>
              </div>
            </div>

            {/* Terminal Content */}
            <div class="flex-1 min-h-0 relative">
              <For each={terminal.all()}>
                {(pty) => (
                  <div
                    id={`terminal-wrapper-${pty.id}`}
                    class="absolute inset-0"
                    style={{ display: terminal.active() === pty.id ? "block" : "none" }}
                  >
                    <Show when={pty.id} keyed>
                      <Terminal pty={pty} onCleanup={terminal.update} onConnectError={() => terminal.clone(pty.id)} />
                    </Show>
                  </div>
                )}
              </For>
            </div>
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            <Show when={store.activeDraggable}>
              {(draggedId) => {
                const pty = createMemo(() => terminal.all().find((t) => t.id === draggedId()))
                return (
                  <Show when={pty()}>
                    {(t) => (
                      <div class="px-3 py-1.5 rounded bg-surface-raised-base border border-border-weak-base text-13-medium text-text-base shadow-lg">
                        <Icon name="console" size="small" class="mr-2 text-text-subtle" />
                        {getTabLabel(t())}
                      </div>
                    )}
                  </Show>
                )
              }}
            </Show>
          </DragOverlay>
        </DragDropProvider>
      </Show>
    </Motion.div>
  )
}

// Improved Terminal Tab Component
interface TerminalTabProps {
  pty: LocalPTY
  isActive: boolean
  index: number
  mounted: boolean
  onClose: () => void
}

function TerminalTab(props: TerminalTabProps) {
  const terminal = useTerminal()
  const language = useLanguage()
  const sortable = createSortable(props.pty.id)

  const [store, setStore] = createStore({
    editing: false,
    title: props.pty.title,
    menuOpen: false,
    menuPosition: { x: 0, y: 0 },
    hovered: false,
  })

  const label = () => {
    const title = props.pty.title
    const number = props.pty.titleNumber
    const isDefaultTitle = (() => {
      if (!Number.isFinite(number) || number <= 0) return false
      const match = title.match(/^Terminal (\d+)$/)
      if (!match) return false
      return Number(match[1]) === number
    })()

    if (title && !isDefaultTitle) return title
    if (Number.isFinite(number) && number > 0) {
      return language.t("terminal.title.numbered", { number })
    }
    return title || language.t("terminal.title")
  }

  const edit = (e?: Event) => {
    e?.stopPropagation()
    e?.preventDefault()
    setStore("title", props.pty.title)
    setStore("editing", true)
    setTimeout(() => {
      const input = document.getElementById(`terminal-title-input-${props.pty.id}`) as HTMLInputElement
      input?.focus()
      input?.select()
    }, 10)
  }

  const save = () => {
    const value = store.title.trim()
    if (value && value !== props.pty.title) {
      terminal.update({ id: props.pty.id, title: value })
    }
    setStore("editing", false)
  }

  const focus = () => {
    if (store.editing) return
    terminal.open(props.pty.id)
    requestAnimationFrame(() => {
      const wrapper = document.getElementById(`terminal-wrapper-${props.pty.id}`)
      const textarea = wrapper?.querySelector("textarea")
      textarea?.focus()
    })
  }

  const menu = (e: MouseEvent) => {
    e.preventDefault()
    setStore("menuPosition", { x: e.clientX, y: e.clientY })
    setStore("menuOpen", true)
  }

  return (
    <Motion.div
      // @ts-ignore
      use:sortable
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: props.mounted ? 1 : 0, scale: props.mounted ? 1 : 0.9 }}
      transition={{ duration: 0.15, delay: props.index * 0.02 }}
      class="h-full flex items-center outline-none"
      classList={{ "opacity-0": sortable.isActiveDraggable }}
      onMouseEnter={() => setStore("hovered", true)}
      onMouseLeave={() => setStore("hovered", false)}
    >
      <button
        type="button"
        class="h-full px-3 flex items-center gap-2 text-12-medium border-r border-border-weak-base transition-colors duration-150"
        classList={{
          "bg-background-stronger text-text-base": props.isActive,
          "bg-transparent text-text-subtle hover:text-text-weak hover:bg-white/[0.02]": !props.isActive,
        }}
        onClick={focus}
        onContextMenu={menu}
        onDblClick={edit}
      >
        <Icon name="console" size="small" class="opacity-60" />
        <Show
          when={!store.editing}
          fallback={
            <input
              id={`terminal-title-input-${props.pty.id}`}
              type="text"
              value={store.title}
              onInput={(e) => setStore("title", e.currentTarget.value)}
              onBlur={save}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  save()
                }
                if (e.key === "Escape") {
                  e.preventDefault()
                  setStore("editing", false)
                }
              }}
              onClick={(e) => e.stopPropagation()}
              class="bg-transparent border-none outline-none text-12-medium min-w-16 max-w-32"
            />
          }
        >
          <span class="truncate max-w-32">{label()}</span>
        </Show>
        <Show when={store.hovered || props.isActive}>
          <IconButton
            icon="close"
            variant="ghost"
            class="size-4 -mr-1 text-text-subtle hover:text-text-base opacity-60 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              props.onClose()
            }}
            aria-label={language.t("terminal.close")}
          />
        </Show>
      </button>

      {/* Context Menu */}
      <DropdownMenu open={store.menuOpen} onOpenChange={(open) => setStore("menuOpen", open)}>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            class="fixed min-w-32"
            style={{ left: `${store.menuPosition.x}px`, top: `${store.menuPosition.y}px` }}
          >
            <DropdownMenu.Item onSelect={edit}>
              <Icon name="edit" size="small" class="mr-2" />
              {language.t("common.rename")}
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onSelect={props.onClose}>
              <Icon name="close" size="small" class="mr-2" />
              {language.t("common.close")}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu>
    </Motion.div>
  )
}
