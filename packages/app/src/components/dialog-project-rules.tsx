import { createEffect, createSignal, Show } from "solid-js"
import { createStore } from "solid-js/store"
import { useParams } from "@solidjs/router"
import { Dialog } from "@stud/ui/dialog"
import { Icon } from "@stud/ui/icon"
import { Markdown } from "@stud/ui/markdown"
import { useLanguage } from "@/context/language"
import { useSDK } from "@/context/sdk"
import { decode64 } from "@/utils/base64"

const RULES_FILES = ["AGENTS.md", "CLAUDE.md"]

export function DialogProjectRules() {
  const language = useLanguage()
  const sdk = useSDK()
  const params = useParams()

  const [store, setStore] = createStore({
    loading: true,
    filepath: null as string | null,
  })

  const [content, setContent] = createSignal("")

  const directory = () => decode64(params.dir) ?? sdk.directory

  // Load AGENTS.md content
  createEffect(async () => {
    const dir = directory()
    if (!dir) return

    setStore({ loading: true })

    for (const file of RULES_FILES) {
      try {
        const result = await sdk.client.file.read({ path: file })
        if (result.data?.content) {
          setContent(result.data.content)
          setStore({ loading: false, filepath: file })
          return
        }
      } catch {
        // Try next file
      }
    }

    // No rules file found
    setContent("")
    setStore({ loading: false, filepath: null })
  })

  return (
    <Dialog title={language.t("sidebar.projectRules")} class="w-[600px] max-w-[90vw]">
      <div class="flex flex-col gap-4 px-6 pb-4">
        <Show when={store.loading}>
          <div class="flex items-center justify-center py-12">
            <div class="size-6 border-2 border-text-muted border-t-transparent rounded-full animate-spin" />
          </div>
        </Show>

        <Show when={!store.loading && store.filepath}>
          <div class="flex items-center gap-2 text-12-regular text-text-muted">
            <Icon name="code" size="small" />
            <span class="font-mono">{store.filepath}</span>
          </div>

          <div class="max-h-[400px] overflow-y-auto rounded-lg bg-surface-inset-base border border-border-weak-base p-4">
            <Markdown text={content()} />
          </div>

          <p class="text-12-regular text-text-muted">Edit this file directly to update project rules</p>
        </Show>

        <Show when={!store.loading && !store.filepath}>
          <div class="flex flex-col items-center justify-center py-8 text-center">
            <div class="size-12 flex items-center justify-center mb-3 rounded-full bg-surface-base">
              <Icon name="code" size="large" class="text-text-muted" />
            </div>
            <h3 class="text-14-medium text-text-base mb-2">No project rules found</h3>
            <p class="text-13-regular text-text-muted max-w-[300px]">
              Create an <span class="font-mono text-text-base">AGENTS.md</span> file in your project root to add custom
              instructions for the AI.
            </p>
          </div>
        </Show>
      </div>
    </Dialog>
  )
}
