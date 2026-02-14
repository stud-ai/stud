import { createEffect, createSignal, For, Match, Show, Switch, type JSX, createMemo } from "solid-js"
import { Collapsible } from "./collapsible"
import { Icon, IconProps } from "./icon"
import { Spinner } from "./spinner"

export type TriggerTitle = {
  title: string
  titleClass?: string
  subtitle?: string
  subtitleClass?: string
  args?: string[]
  argsClass?: string
  action?: JSX.Element
}

const isTriggerTitle = (val: any): val is TriggerTitle => {
  return (
    typeof val === "object" && val !== null && "title" in val && (typeof Node === "undefined" || !(val instanceof Node))
  )
}

export interface BasicToolProps {
  icon: IconProps["name"]
  trigger: TriggerTitle | JSX.Element
  children?: JSX.Element
  hideDetails?: boolean
  defaultOpen?: boolean
  forceOpen?: boolean
  locked?: boolean
  status?: string
  compact?: boolean
  onSubtitleClick?: () => void
}

export function BasicTool(props: BasicToolProps) {
  const [open, setOpen] = createSignal(props.compact ? false : (props.defaultOpen ?? false))

  createEffect(() => {
    if (props.forceOpen) setOpen(true)
  })

  const handleOpenChange = (value: boolean) => {
    if (props.locked && !value) return
    setOpen(value)
  }

  const isRunning = createMemo(() => props.status === "running")
  const isComplete = createMemo(() => props.status === "complete" || props.status === "success")
  const isError = createMemo(() => props.status === "error")

  return (
    <Collapsible open={open()} onOpenChange={handleOpenChange}>
      <Collapsible.Trigger>
        <div data-component="tool-trigger" data-status={props.status} data-compact={props.compact}>
          <div data-slot="basic-tool-trigger-content">
            {/* Icon with status indicator */}
            <div data-slot="basic-tool-icon-wrapper">
              <div data-slot="basic-tool-icon">
                <Icon name={props.icon} size="small" />
              </div>
              {/* Spinner ring for running */}
              <Show when={isRunning()}>
                <div data-slot="basic-tool-spinner-ring" />
              </Show>
              {/* Status dot */}
              <Show when={isComplete() || isError()}>
                <div data-slot="basic-tool-status-dot" data-status={props.status}>
                  <Icon name={isComplete() ? "check-small" : "close-small"} />
                </div>
              </Show>
            </div>

            {/* Content */}
            <div data-slot="basic-tool-info">
              <Switch>
                <Match when={isTriggerTitle(props.trigger) && props.trigger}>
                  {(trigger) => (
                    <div data-slot="basic-tool-info-structured">
                      <div data-slot="basic-tool-info-main">
                        <span
                          data-slot="basic-tool-title"
                          classList={{
                            [trigger().titleClass ?? ""]: !!trigger().titleClass,
                          }}
                        >
                          {trigger().title}
                        </span>
                        <Show when={trigger().subtitle}>
                          <span data-slot="basic-tool-separator">→</span>
                          <span
                            data-slot="basic-tool-subtitle"
                            classList={{
                              [trigger().subtitleClass ?? ""]: !!trigger().subtitleClass,
                              clickable: !!props.onSubtitleClick,
                            }}
                            onClick={(e) => {
                              if (props.onSubtitleClick) {
                                e.stopPropagation()
                                props.onSubtitleClick()
                              }
                            }}
                          >
                            {trigger().subtitle}
                          </span>
                        </Show>
                        <Show when={trigger().args?.length}>
                          <For each={trigger().args}>
                            {(arg) => (
                              <span
                                data-slot="basic-tool-arg"
                                classList={{
                                  [trigger().argsClass ?? ""]: !!trigger().argsClass,
                                }}
                              >
                                {arg}
                              </span>
                            )}
                          </For>
                        </Show>
                      </div>
                      <Show when={trigger().action}>{trigger().action}</Show>
                    </div>
                  )}
                </Match>
                <Match when={true}>{props.trigger as JSX.Element}</Match>
              </Switch>
            </div>
          </div>
          <Show when={props.children && !props.hideDetails && !props.locked}>
            <Collapsible.Arrow />
          </Show>
        </div>
      </Collapsible.Trigger>
      <Show when={props.children && !props.hideDetails}>
        <Collapsible.Content>{props.children}</Collapsible.Content>
      </Show>
    </Collapsible>
  )
}

export function GenericTool(props: { tool: string; hideDetails?: boolean; status?: string }) {
  return <BasicTool icon="mcp" trigger={{ title: props.tool }} hideDetails={props.hideDetails} status={props.status} />
}
