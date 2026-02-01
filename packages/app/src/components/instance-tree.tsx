import { Collapsible } from "@stud/ui/collapsible"
import { InstanceIcon } from "@stud/ui/instance-icon"
import { Icon } from "@stud/ui/icon"
import {
  createEffect,
  createMemo,
  createResource,
  createSignal,
  For,
  Show,
} from "solid-js"
import { useServer } from "@/context/server"
import { useInstance } from "@/context/instance"
import { studioRequest } from "@/utils/studio"
import { usePlatform } from "@/context/platform"

export interface InstanceNode {
  name: string
  className: string
  path: string
  filePath?: string
  children?: InstanceNode[]
}

interface InstanceTreeProps {
  directory: string
  class?: string
  onFileClick?: (filePath: string) => void
  onInspect?: () => void
}

async function fetchInstanceTree(
  url: string,
  directory: string,
  customFetch: typeof fetch,
  source: "rojo" | "studio" = "rojo",
): Promise<{ tree: InstanceNode | null; projectFile: string | null; source?: "rojo" | "studio" }> {
  const response = await customFetch(`${url}/instance-tree/tree?source=${source}`, {
    headers: {
      "x-stud-directory": encodeURIComponent(directory),
    },
  })
  if (!response.ok) return { tree: null, projectFile: null }
  return response.json()
}

function filterTree(node: InstanceNode, query: string): InstanceNode | null {
  const lowerQuery = query.toLowerCase()
  const nameMatches = node.name.toLowerCase().includes(lowerQuery)
  const classMatches = node.className.toLowerCase().includes(lowerQuery)

  // Filter children recursively
  const filteredChildren = node.children
    ?.map((child) => filterTree(child, query))
    .filter((child): child is InstanceNode => child !== null)

  // Include this node if it matches or has matching children
  if (nameMatches || classMatches || (filteredChildren && filteredChildren.length > 0)) {
    return {
      ...node,
      children: filteredChildren,
    }
  }

  return null
}

export function InstanceTree(props: InstanceTreeProps) {
  const server = useServer()
  const platform = usePlatform()
  const [searchQuery, setSearchQuery] = createSignal("")

  // Always try Studio mode - backend will fall back to Rojo if not connected
  const [data, { refetch }] = createResource(
    () => ({ url: server.url, directory: props.directory }),
    (source) => fetchInstanceTree(source.url, source.directory, platform.fetch ?? fetch, "studio"),
  )

  const filteredTree = createMemo(() => {
    const tree = data()?.tree
    if (!tree) return null
    const query = searchQuery().trim()
    if (!query) return tree
    return filterTree(tree, query)
  })

  return (
    <div class={`flex flex-col ${props.class ?? ""}`}>
      {/* Search Bar */}
      <div class="px-1 pb-1.5">
        <div class="relative">
          <Icon
            name="search"
            size="small"
            class="absolute left-2 top-1/2 -translate-y-1/2 text-icon-subtle pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery()}
            onInput={(e) => setSearchQuery(e.currentTarget.value)}
            class="w-full h-7 pl-7 pr-7 rounded-md bg-surface-inset-base border border-border-weak-base text-12-regular text-text-base placeholder:text-text-subtle focus:outline-none focus:border-border-base focus:ring-1 focus:ring-border-base transition-colors"
          />
          <Show when={searchQuery()}>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              class="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-surface-base-hover text-icon-subtle hover:text-icon-base transition-colors"
            >
              <Icon name="close" size="small" />
            </button>
          </Show>
        </div>
      </div>

      <Show when={data.loading}>
        <div class="px-2 py-1.5 text-12-regular text-text-subtle">Loading...</div>
      </Show>
      <Show when={data.error}>
        <div class="px-2 py-1.5 text-12-regular text-text-subtle">Failed to load</div>
      </Show>
      <Show when={filteredTree()}>
        {(tree) => <InstanceTreeNode node={tree()} level={0} onFileClick={props.onFileClick} onInspect={props.onInspect} forceExpand={!!searchQuery()} />}
      </Show>
      <Show when={!data.loading && !data.error && !filteredTree()}>
        <div class="px-2 py-1.5 text-12-regular text-text-subtle opacity-60">
          {searchQuery() ? "No matches found" : "No Rojo project found"}
        </div>
      </Show>
    </div>
  )
}

interface InstanceTreeNodeProps {
  node: InstanceNode
  level: number
  onFileClick?: (filePath: string) => void
  onInspect?: () => void
  forceExpand?: boolean
}

function InstanceTreeNode(props: InstanceTreeNodeProps) {
  const instance = useInstance()
  const [expanded, setExpanded] = createSignal(props.forceExpand || props.level < 2)
  const hasChildren = () => props.node.children && props.node.children.length > 0
  const isHighlighted = () => instance.highlighted()?.path === props.node.path

  // Auto-expand when forceExpand changes (for search)
  createEffect(() => {
    if (props.forceExpand) {
      setExpanded(true)
    }
  })

  const getSelection = () => ({
    path: props.node.path,
    name: props.node.name,
    className: props.node.className,
    filePath: props.node.filePath,
  })

  // Single-click: highlight in Explorer, show in Inspector, sync with Studio
  const handleSingleClick = (e: MouseEvent) => {
    // Prevent double-click from also triggering single-click logic
    if (e.detail === 2) return

    const selection = getSelection()
    instance.setHighlighted(selection)
    instance.setInspected(selection)
    studioRequest("/selection/set", { paths: [props.node.path] })
  }

  // Double-click: open in Inspector tab
  const handleDoubleClick = () => {
    const selection = getSelection()

    // Set as inspected (pinned for Inspector)
    instance.setInspected(selection)

    // Also set as highlighted for visual consistency
    instance.setHighlighted(selection)
    studioRequest("/selection/set", { paths: [props.node.path] })

    // Open Inspector tab
    props.onInspect?.()

    // If it's a file, also trigger file click
    if (props.node.filePath && props.onFileClick) {
      props.onFileClick(props.node.filePath)
    }
  }

  const paddingLeft = () => `${Math.max(0, 4 + props.level * 12)}px`

  return (
    <div class="flex flex-col">
      <Show
        when={hasChildren()}
        fallback={
          <button
            type="button"
            class="w-full min-w-0 h-6 flex items-center justify-start gap-x-1.5 rounded-md px-1.5 py-0 text-left hover:bg-surface-raised-base-hover active:bg-surface-base-active transition-colors cursor-pointer"
            style={{ "padding-left": paddingLeft() }}
            onClick={handleSingleClick}
            onDblClick={handleDoubleClick}
            classList={{ "bg-surface-raised-base": isHighlighted() }}
          >
            <div class="size-4 flex items-center justify-center" />
            <InstanceIcon className={props.node.className} class="size-4 shrink-0" />
            <span class="flex-1 min-w-0 text-12-medium text-text-weak whitespace-nowrap truncate">
              {props.node.name}
            </span>
          </button>
        }
      >
        <Collapsible variant="ghost" class="w-full" forceMount={false} open={expanded()} onOpenChange={setExpanded}>
          <Collapsible.Trigger>
            <button
              type="button"
              class="w-full min-w-0 h-6 flex items-center justify-start gap-x-1.5 rounded-md px-1.5 py-0 text-left hover:bg-surface-raised-base-hover active:bg-surface-base-active transition-colors cursor-pointer"
              style={{ "padding-left": paddingLeft() }}
              onClick={handleSingleClick}
              onDblClick={handleDoubleClick}
              classList={{ "bg-surface-raised-base": isHighlighted() }}
            >
              <div class="size-4 flex items-center justify-center text-icon-weak">
                <Icon name={expanded() ? "chevron-down" : "chevron-right"} size="small" />
              </div>
              <InstanceIcon className={props.node.className} class="size-4 shrink-0" />
              <span class="flex-1 min-w-0 text-12-medium text-text-weak whitespace-nowrap truncate">
                {props.node.name}
              </span>
            </button>
          </Collapsible.Trigger>
          <Collapsible.Content class="relative">
            <div
              class="absolute top-0 bottom-0 w-px pointer-events-none bg-border-weak-base opacity-30"
              style={{ left: `${Math.max(0, 4 + props.level * 12) + 8}px` }}
            />
            <For each={props.node.children}>
              {(child) => <InstanceTreeNode node={child} level={props.level + 1} onFileClick={props.onFileClick} onInspect={props.onInspect} forceExpand={props.forceExpand} />}
            </For>
          </Collapsible.Content>
        </Collapsible>
      </Show>
    </div>
  )
}
