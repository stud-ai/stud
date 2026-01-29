import { type ComponentProps, createSignal, Show, type JSX, createMemo } from "solid-js"
import { Collapsible } from "./collapsible"
import { Icon, type IconProps } from "./icon"
import { Spinner } from "./spinner"

export interface ActionCardProps {
  icon: IconProps["name"]
  title: string
  subtitle?: string
  status?: "success" | "pending" | "error" | "info"
  meta?: JSX.Element
  actions?: JSX.Element
  children?: JSX.Element
  defaultOpen?: boolean
  hideDetails?: boolean
  class?: ComponentProps<"div">["class"]
  classList?: ComponentProps<"div">["classList"]
}

export function ActionCard(props: ActionCardProps) {
  const [open, setOpen] = createSignal(props.defaultOpen ?? false)

  const hasDetails = () => {
    if (props.hideDetails) return false
    return !!props.children
  }

  const statusIcon = createMemo(() => {
    switch (props.status) {
      case "success":
        return "check"
      case "error":
        return "close"
      case "pending":
        return null // We'll show spinner instead
      default:
        return null
    }
  })

  return (
    <Collapsible open={open()} onOpenChange={setOpen} class={props.class} classList={props.classList}>
      <div data-component="action-card" data-status={props.status || "info"} data-open={open() ? "true" : undefined}>
        <Collapsible.Trigger disabled={!hasDetails()}>
          <div data-slot="action-card-header">
            {/* Icon with status indicator */}
            <div data-slot="action-card-icon-wrapper">
              <div data-slot="action-card-icon">
                <Icon name={props.icon} size="small" />
              </div>
              {/* Status overlay */}
              <Show when={props.status === "pending"}>
                <div data-slot="action-card-spinner">
                  <Spinner />
                </div>
              </Show>
              <Show when={statusIcon()}>
                <div data-slot="action-card-status-icon" data-status={props.status}>
                  <Icon name={statusIcon()!} size="small" />
                </div>
              </Show>
            </div>

            {/* Content */}
            <div data-slot="action-card-content">
              <div data-slot="action-card-title-row">
                <span data-slot="action-card-title-text">{props.title}</span>
                <Show when={props.meta}>
                  <div data-slot="action-card-meta">{props.meta}</div>
                </Show>
              </div>
              <Show when={props.subtitle}>
                <span data-slot="action-card-subtitle">{props.subtitle}</span>
              </Show>
            </div>

            {/* Actions */}
            <Show when={props.actions}>
              <div
                data-slot="action-card-actions"
                onClick={(event) => {
                  event.stopPropagation()
                }}
              >
                {props.actions}
              </div>
            </Show>

            {/* Expand arrow */}
            <Show when={hasDetails()}>
              <Collapsible.Arrow />
            </Show>
          </div>

          {/* Progress bar for pending state */}
          <Show when={props.status === "pending"}>
            <div data-slot="action-card-progress">
              <div data-slot="action-card-progress-bar" />
            </div>
          </Show>
        </Collapsible.Trigger>

        <Show when={hasDetails()}>
          <Collapsible.Content>
            <div data-slot="action-card-body">{props.children}</div>
          </Collapsible.Content>
        </Show>
      </div>
    </Collapsible>
  )
}
