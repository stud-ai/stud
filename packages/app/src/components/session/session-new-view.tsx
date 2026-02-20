import { For, Show, createMemo } from "solid-js"
import { DateTime } from "luxon"
import { useSync } from "@/context/sync"
import { useLanguage } from "@/context/language"
import { Icon } from "@stud/ui/icon"
import { getDirectory, getFilename } from "@stud/util/path"
import { emitSendMessage } from "@/utils/events"

const MAIN_WORKTREE = "main"
const CREATE_WORKTREE = "create"

interface NewSessionViewProps {
  worktree: string
  onWorktreeChange: (value: string) => void
}

export function NewSessionView(props: NewSessionViewProps) {
  const sync = useSync()
  const language = useLanguage()

  const sandboxes = createMemo(() => sync.project?.sandboxes ?? [])
  const options = createMemo(() => [MAIN_WORKTREE, ...sandboxes(), CREATE_WORKTREE])
  const current = createMemo(() => {
    const selection = props.worktree
    if (options().includes(selection)) return selection
    return MAIN_WORKTREE
  })
  const projectRoot = createMemo(() => sync.project?.worktree ?? sync.data.path.directory)
  const isWorktree = createMemo(() => {
    const project = sync.project
    if (!project) return false
    return sync.data.path.directory !== project.worktree
  })

  const label = (value: string) => {
    if (value === MAIN_WORKTREE) {
      if (isWorktree()) return language.t("session.new.worktree.main")
      const branch = sync.data.vcs?.branch
      if (branch) return language.t("session.new.worktree.mainWithBranch", { branch })
      return language.t("session.new.worktree.main")
    }

    if (value === CREATE_WORKTREE) return language.t("session.new.worktree.create")

    return getFilename(value)
  }

  const quickActions = createMemo(() => [
    {
      key: "writeScripts",
      icon: "code-lines" as const,
      label: language.t("session.new.quickAction.writeScripts"),
      prompt: language.t("session.new.quickAction.writeScripts.prompt"),
    },
    {
      key: "editInstances",
      icon: "cube" as const,
      label: language.t("session.new.quickAction.editInstances"),
      prompt: language.t("session.new.quickAction.editInstances.prompt"),
    },
    {
      key: "searchToolbox",
      icon: "magnifying-glass" as const,
      label: language.t("session.new.quickAction.searchToolbox"),
      prompt: language.t("session.new.quickAction.searchToolbox.prompt"),
    },
    {
      key: "queryDatastores",
      icon: "database" as const,
      label: language.t("session.new.quickAction.queryDatastores"),
      prompt: language.t("session.new.quickAction.queryDatastores.prompt"),
    },
    {
      key: "reviewPermissions",
      icon: "checklist" as const,
      label: language.t("session.new.quickAction.reviewPermissions"),
      prompt: language.t("session.new.quickAction.reviewPermissions.prompt"),
    },
    {
      key: "sendMessage",
      icon: "bubble-5" as const,
      label: language.t("session.new.quickAction.sendMessage"),
      prompt: language.t("session.new.quickAction.sendMessage.prompt"),
    },
  ])

  return (
    <div class="size-full flex flex-col justify-end items-start gap-4 flex-[1_0_0] self-stretch max-w-200 mx-auto px-6 pb-[calc(var(--prompt-height,11.25rem)+64px)]">
      <div class="text-20-medium text-text-weaker">{language.t("command.session.new")}</div>
      <div class="w-full flex flex-col gap-2">
        <div class="text-11-medium text-text-subtle uppercase tracking-wider">{language.t("session.new.quickActions")}</div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
          <For each={quickActions()}>
            {(action) => (
              <button
                type="button"
                class="flex items-center gap-2 px-3 py-2 rounded-md border border-border-weak-base bg-surface-raised-base text-12-medium text-text-base hover:bg-surface-base-hover transition-colors text-left"
                onClick={() => emitSendMessage(action.prompt)}
                aria-label={action.label}
              >
                <Icon name={action.icon} size="small" class="text-icon-subtle" />
                <span class="truncate">{action.label}</span>
              </button>
            )}
          </For>
        </div>
      </div>
      <div class="flex justify-center items-center gap-3">
        <Icon name="folder" size="small" />
        <div class="text-12-medium text-text-weak select-text">
          {getDirectory(projectRoot())}
          <span class="text-text-strong">{getFilename(projectRoot())}</span>
        </div>
      </div>
      <div class="flex justify-center items-center gap-1">
        <Icon name="branch" size="small" />
        <div class="text-12-medium text-text-weak select-text ml-2">{label(current())}</div>
      </div>
      <Show when={sync.project}>
        {(project) => (
          <div class="flex justify-center items-center gap-3">
            <Icon name="pencil-line" size="small" />
            <div class="text-12-medium text-text-weak">
              {language.t("session.new.lastModified")}&nbsp;
              <span class="text-text-strong">
                {DateTime.fromMillis(project().time.updated ?? project().time.created)
                  .setLocale(language.locale())
                  .toRelative()}
              </span>
            </div>
          </div>
        )}
      </Show>
    </div>
  )
}
