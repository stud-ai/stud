import { Dialog } from "@stud/ui/dialog"
import { Icon } from "@stud/ui/icon"
import { Keybind } from "@stud/ui/keybind"
import { createSignal, For, Show } from "solid-js"
import { type CommandOption } from "@/context/command"
import { useDialog } from "@stud/ui/context/dialog"

type Entry = {
  id: string
  title: string
  description?: string
  keybind?: string
  option: CommandOption
}

interface Props {
  options: CommandOption[]
  keybind: (id: string) => string
}

export function DialogCommandPalette(props: Props) {
  const dialog = useDialog()
  const [query, setQuery] = createSignal("")
  const [activeIndex, setActiveIndex] = createSignal(0)

  const entries = () => {
    const q = query().toLowerCase()
    return props.options
      .filter((item) => !item.disabled)
      .filter((item) => {
        if (!q) return true
        return (
          item.title.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
        )
      })
      .map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        keybind: props.keybind(item.id) || undefined,
        option: item,
      }))
  }

  const select = (item: Entry) => {
    dialog.close()
    item.option.onSelect?.("palette")
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const items = entries()
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, items.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter" && items.length > 0) {
      e.preventDefault()
      select(items[activeIndex()])
    }
  }

  return (
    <Dialog class="w-[600px] max-w-[90vw]" fit transition>
      <div class="flex flex-col">
        {/* Search input */}
        <div class="flex items-center gap-3 px-4 py-3 border-b border-border-base">
          <Icon name="magnifying-glass" class="text-text-dimmed shrink-0" />
          <input
            type="text"
            placeholder="Search threads..."
            class="flex-1 bg-transparent text-14-regular text-text-strong placeholder:text-text-dimmed outline-none"
            value={query()}
            onInput={(e) => {
              setQuery(e.currentTarget.value)
              setActiveIndex(0)
            }}
            onKeyDown={handleKeyDown}
            autofocus
          />
          <Keybind>⌘K</Keybind>
        </div>

        {/* Results */}
        <Show when={entries().length > 0}>
          <div class="max-h-[300px] overflow-y-auto py-2">
            <For each={entries()}>
              {(item, index) => (
                <button
                  type="button"
                  class="w-full px-4 py-2 flex items-center gap-3 text-left hover:bg-surface-hover transition-colors"
                  classList={{
                    "bg-surface-hover": index() === activeIndex(),
                  }}
                  onClick={() => select(item)}
                  onMouseEnter={() => setActiveIndex(index())}
                >
                  <span class="text-14-regular text-text-strong truncate flex-1">
                    {item.title}
                  </span>
                  <Show when={item.keybind}>
                    {(key) => <Keybind>{key()}</Keybind>}
                  </Show>
                </button>
              )}
            </For>
          </div>
        </Show>

        {/* Empty state */}
        <Show when={query() && entries().length === 0}>
          <div class="px-4 py-8 text-center text-14-regular text-text-dimmed">
            No results found
          </div>
        </Show>
      </div>
    </Dialog>
  )
}
