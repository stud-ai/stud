import { Show } from "solid-js"
import { Button } from "@stud/ui/button"
import { Icon } from "@stud/ui/icon"
import { useInstance } from "@/context/instance"
import { usePrompt } from "@/context/prompt"

export function ContextToolbar() {
  const instance = useInstance()
  const prompt = usePrompt()

  const selection = () => instance.selected()

  const setPrompt = (text: string) => {
    prompt.set([{ type: "text", content: text, start: 0, end: text.length }], text.length)
  }

  const addScript = () => {
    const target = selection()?.path ?? "the selected instance"
    setPrompt(`Add a script to ${target} that handles its behavior.`)
  }

  const insertModel = () => {
    const target = selection()?.path ?? "game.Workspace"
    setPrompt(`Search the toolbox and insert a model into ${target}.`)
  }

  const editProps = () => {
    const target = selection()?.path ?? "the selected instance"
    setPrompt(`Update properties on ${target} (color, size, material).`)
  }

  return (
    <Show when={selection()}>
      {(item) => (
        <div class="flex items-center gap-2 rounded-full bg-surface-raised-stronger-non-alpha border border-border-weak-base px-3 py-2 shadow-lg">
          <div class="flex items-center gap-2 pr-2 border-r border-border-weak-base">
            <Icon name="models" size="small" />
            <span class="text-12-medium text-text-strong truncate max-w-[200px]">{item().name}</span>
          </div>
          <Button variant="ghost" size="small" onClick={addScript}>
            Add Script
          </Button>
          <Button variant="ghost" size="small" onClick={insertModel}>
            Insert Model
          </Button>
          <Button variant="ghost" size="small" onClick={editProps}>
            Properties
          </Button>
        </div>
      )}
    </Show>
  )
}
