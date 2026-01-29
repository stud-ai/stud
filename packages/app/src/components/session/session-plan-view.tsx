import { createMemo, createResource, Show } from "solid-js"
import { useParams } from "@solidjs/router"
import { useSync } from "@/context/sync"
import { useSDK } from "@/context/sdk"
import { useLanguage } from "@/context/language"
import { useLocal } from "@/context/local"
import { Icon } from "@stud/ui/icon"
import { Button } from "@stud/ui/button"
import { Markdown } from "@stud/ui/markdown"

interface SessionPlanViewProps {
  class?: string
}

export function SessionPlanView(props: SessionPlanViewProps) {
  const params = useParams()
  const sync = useSync()
  const sdk = useSDK()
  const language = useLanguage()
  const local = useLocal()

  const session = createMemo(() => (params.id ? sync.session.get(params.id) : undefined))

  // Compute plan file path from session
  const planPath = createMemo(() => {
    const s = session()
    if (!s) return null
    // Plan path: .opencode/plans/{timestamp}-{slug}.md
    return `.opencode/plans/${s.time.created}-${s.slug}.md`
  })

  // Check if current agent is plan
  const isPlanAgent = createMemo(() => local.agent.current()?.name === "plan")

  // Fetch plan file content
  const [planContent] = createResource(planPath, async (path) => {
    if (!path) return null
    try {
      const result = await sdk.client.file.read({ path })
      return result.data?.content ?? null
    } catch {
      return null
    }
  })

  const hasContent = createMemo(() => {
    const content = planContent()
    return typeof content === "string" && content.trim().length > 0
  })

  return (
    <div class="flex flex-col h-full overflow-hidden" classList={{ [props.class ?? ""]: !!props.class }}>
      {/* Plan header */}
      <div class="flex items-center justify-between px-8 py-6 border-b border-transparent">
        <div>
          <h2 class="text-24-medium text-text-strong mb-1">{language.t("planningMode.title")}</h2>
          <Show when={planPath()}>
            <p class="text-13-regular text-text-muted font-mono">{planPath()}</p>
          </Show>
        </div>
        <Show when={isPlanAgent()}>
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#27272a] border border-[#3f3f46]">
            <Icon name="brain" size="small" class="text-text-secondary" />
            <span class="text-12-regular text-text-secondary">Plan Agent</span>
          </div>
        </Show>
      </div>

      {/* Plan content */}
      <div class="flex-1 overflow-y-auto">
        <Show
          when={hasContent()}
          fallback={
            <div class="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
              <div class="size-16 flex items-center justify-center mb-2">
                <Icon name="checklist" size="large" class="text-text-muted opacity-50" />
              </div>
              <h3 class="text-16-medium text-text-base mb-2">{language.t("planningMode.empty")}</h3>
              <p class="text-14-regular text-text-weak max-w-[300px]">{language.t("planningMode.empty.description")}</p>
              <Show when={!isPlanAgent()}>
                <Button variant="secondary" class="mt-4" onClick={() => local.agent.set("plan")}>
                  Switch to Plan Agent
                </Button>
              </Show>
            </div>
          }
        >
          <div class="px-6 py-6 max-w-prose mx-auto">
            <Markdown text={planContent() ?? ""} />
          </div>
        </Show>
      </div>
    </div>
  )
}
