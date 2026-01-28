import { createMemo, createSignal, For, Match, onMount, Show, Switch } from "solid-js"
import { Button } from "@stud/ui/button"
import { Logo } from "@stud/ui/logo"
import { useLayout } from "@/context/layout"
import { useNavigate } from "@solidjs/router"
import { base64Encode } from "@stud/util/encode"
import { Icon } from "@stud/ui/icon"
import { usePlatform } from "@/context/platform"
import { DateTime } from "luxon"
import { useDialog } from "@stud/ui/context/dialog"
import { DialogSelectDirectory } from "@/components/dialog-select-directory"
import { DialogSelectServer } from "@/components/dialog-select-server"
import { useServer } from "@/context/server"
import { useGlobalSync } from "@/context/global-sync"
import { useLanguage } from "@/context/language"
import { ProjectCard, type DiscoveredProject } from "@/components/project-card"
import { IconButton } from "@stud/ui/icon-button"
import { Link } from "@/components/link"

export default function Home() {
  const sync = useGlobalSync()
  const layout = useLayout()
  const platform = usePlatform()
  const dialog = useDialog()
  const navigate = useNavigate()
  const server = useServer()
  const language = useLanguage()
  const homedir = createMemo(() => sync.data.path.home)

  // Discovered Roblox projects
  const [discovered, setDiscovered] = createSignal<DiscoveredProject[]>([])
  const [scanning, setScanning] = createSignal(false)
  const [hasScanned, setHasScanned] = createSignal(false)

  // Recent projects from existing storage
  const recent = createMemo(() => {
    return sync.data.project
      .toSorted((a, b) => (b.time.updated ?? b.time.created) - (a.time.updated ?? a.time.created))
      .slice(0, 5)
  })

  // Combined view: show discovered projects if available, otherwise recent
  const showDiscovery = createMemo(() => discovered().length > 0 || hasScanned())

  async function scanForProjects() {
    setScanning(true)
    try {
      const response = await fetch(`${server.url}/global/discover`)
      if (response.ok) {
        const projects = (await response.json()) as DiscoveredProject[]
        setDiscovered(projects)
      }
    } catch (e) {
      console.error("Failed to discover projects:", e)
    } finally {
      setScanning(false)
      setHasScanned(true)
    }
  }

  // Auto-scan on mount if we have no recent projects
  onMount(() => {
    if (sync.data.project.length === 0) {
      scanForProjects()
    }
  })

  function openProject(directory: string) {
    layout.projects.open(directory)
    server.projects.touch(directory)
    navigate(`/${base64Encode(directory)}`)
  }

  async function chooseProject() {
    function resolve(result: string | string[] | null) {
      if (Array.isArray(result)) {
        for (const directory of result) {
          openProject(directory)
        }
      } else if (result) {
        openProject(result)
      }
    }

    if (platform.openDirectoryPickerDialog && server.isLocal()) {
      const result = await platform.openDirectoryPickerDialog?.({
        title: language.t("command.project.open"),
        multiple: true,
      })
      resolve(result)
    } else {
      dialog.show(
        () => <DialogSelectDirectory multiple={true} onSelect={resolve} />,
        () => resolve(null),
      )
    }
  }

  return (
    <div class="min-h-full flex flex-col">
      {/* Header */}
      <div class="flex flex-col items-center pt-16 pb-8 px-4">
        <Logo class="w-48 opacity-20" />
        <Button
          size="large"
          variant="ghost"
          class="mt-4 text-14-regular text-text-weak"
          onClick={() => dialog.show(() => <DialogSelectServer />)}
        >
          <div
            classList={{
              "size-2 rounded-full": true,
              "bg-icon-success-base": server.healthy() === true,
              "bg-icon-critical-base": server.healthy() === false,
              "bg-border-weak-base": server.healthy() === undefined,
            }}
          />
          {server.name}
        </Button>
      </div>

      {/* Main Content */}
      <div class="flex-1 px-6 pb-8 max-w-6xl mx-auto w-full">
        <Switch>
          {/* Discovered Projects Grid */}
          <Match when={showDiscovery()}>
            <div class="flex flex-col gap-6">
              {/* Header with actions */}
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <h2 class="text-16-medium text-text-strong">{language.t("home.robloxProjects")}</h2>
                  <Show when={discovered().length > 0}>
                    <span class="px-2 py-0.5 text-12-medium rounded-full bg-surface-base-active text-text-weak">
                      {discovered().length}
                    </span>
                  </Show>
                </div>
                <div class="flex items-center gap-2">
                  <IconButton
                    icon="refresh"
                    variant="ghost"
                    aria-label={language.t("home.scan")}
                    onClick={scanForProjects}
                    disabled={scanning()}
                    classList={{ "animate-spin": scanning() }}
                  />
                  <Button icon="folder-add-left" size="normal" class="pl-2 pr-3" onClick={chooseProject}>
                    {language.t("command.project.open")}
                  </Button>
                </div>
              </div>

              {/* Project Grid */}
              <Show
                when={discovered().length > 0}
                fallback={
                  <div class="flex flex-col items-center justify-center py-16 text-center">
                    <Show
                      when={scanning()}
                      fallback={
                        <>
                          <Icon name="search" size="large" class="text-text-muted mb-4" />
                          <div class="text-14-medium text-text-strong mb-1">{language.t("home.noProjectsFound")}</div>
                          <div class="text-12-regular text-text-weak mb-4">
                            {language.t("home.noProjectsFoundDescription")}
                          </div>
                          <Button onClick={chooseProject}>{language.t("command.project.open")}</Button>

                          {/* Tip about Roblox file locations */}
                          <div class="mt-8 p-4 rounded-lg bg-surface-base-weak border border-border-weak-base text-left max-w-md">
                            <div class="flex items-start gap-3">
                              <Icon name="info-circle" size="small" class="text-icon-primary-base mt-0.5 shrink-0" />
                              <div class="flex flex-col gap-2">
                                <div class="text-13-medium text-text-strong">{language.t("home.tip.title")}</div>
                                <div class="text-12-regular text-text-weak">{language.t("home.tip.cloudSave")}</div>
                                <div class="text-12-regular text-text-weak">{language.t("home.tip.rojo")}</div>
                                <Link href="https://rojo.space/docs" class="text-12-medium">
                                  {language.t("home.tip.learnMore")}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </>
                      }
                    >
                      <Icon name="refresh" size="large" class="text-text-muted mb-4 animate-spin" />
                      <div class="text-14-medium text-text-strong">{language.t("home.scanning")}</div>
                    </Show>
                  </div>
                }
              >
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <For each={discovered()}>
                    {(project) => (
                      <ProjectCard project={project} homedir={homedir()} onClick={() => openProject(project.path)} />
                    )}
                  </For>
                </div>
              </Show>

              {/* Recent Sessions Section */}
              <Show when={recent().length > 0}>
                <div class="mt-8 pt-8 border-t border-border-weak-base">
                  <h3 class="text-14-medium text-text-strong mb-4">{language.t("home.recentProjects")}</h3>
                  <div class="flex flex-col gap-2">
                    <For each={recent()}>
                      {(project) => (
                        <Button
                          size="large"
                          variant="ghost"
                          class="text-14-mono text-left justify-between px-3"
                          onClick={() => openProject(project.worktree)}
                        >
                          {project.worktree.replace(homedir(), "~")}
                          <div class="text-14-regular text-text-weak">
                            {DateTime.fromMillis(project.time.updated ?? project.time.created).toRelative()}
                          </div>
                        </Button>
                      )}
                    </For>
                  </div>
                </div>
              </Show>
            </div>
          </Match>

          {/* Recent Projects List (original view) */}
          <Match when={sync.data.project.length > 0}>
            <div class="flex flex-col gap-4">
              <div class="flex gap-2 items-center justify-between pl-3">
                <div class="text-14-medium text-text-strong">{language.t("home.recentProjects")}</div>
                <div class="flex items-center gap-2">
                  <Button variant="ghost" size="normal" onClick={scanForProjects} disabled={scanning()}>
                    <Icon name="search" size="small" classList={{ "animate-spin": scanning() }} />
                    {language.t("home.scanForProjects")}
                  </Button>
                  <Button icon="folder-add-left" size="normal" class="pl-2 pr-3" onClick={chooseProject}>
                    {language.t("command.project.open")}
                  </Button>
                </div>
              </div>
              <ul class="flex flex-col gap-2">
                <For each={recent()}>
                  {(project) => (
                    <Button
                      size="large"
                      variant="ghost"
                      class="text-14-mono text-left justify-between px-3"
                      onClick={() => openProject(project.worktree)}
                    >
                      {project.worktree.replace(homedir(), "~")}
                      <div class="text-14-regular text-text-weak">
                        {DateTime.fromMillis(project.time.updated ?? project.time.created).toRelative()}
                      </div>
                    </Button>
                  )}
                </For>
              </ul>
            </div>
          </Match>

          {/* Empty State */}
          <Match when={true}>
            <div class="flex flex-col items-center justify-center py-16">
              <Icon name="folder-add-left" size="large" class="text-text-muted mb-4" />
              <div class="text-14-medium text-text-strong mb-1">{language.t("home.empty.title")}</div>
              <div class="text-12-regular text-text-weak mb-4">{language.t("home.empty.description")}</div>
              <div class="flex gap-3">
                <Button variant="secondary" onClick={scanForProjects} disabled={scanning()}>
                  <Icon name="search" size="small" classList={{ "animate-spin": scanning() }} />
                  {language.t("home.scanForProjects")}
                </Button>
                <Button onClick={chooseProject}>{language.t("command.project.open")}</Button>
              </div>

              {/* Tip about Roblox file locations */}
              <div class="mt-8 p-4 rounded-lg bg-surface-base-weak border border-border-weak-base text-left max-w-md">
                <div class="flex items-start gap-3">
                  <Icon name="info-circle" size="small" class="text-icon-primary-base mt-0.5 shrink-0" />
                  <div class="flex flex-col gap-2">
                    <div class="text-13-medium text-text-strong">{language.t("home.tip.title")}</div>
                    <div class="text-12-regular text-text-weak">{language.t("home.tip.cloudSave")}</div>
                    <div class="text-12-regular text-text-weak">{language.t("home.tip.rojo")}</div>
                    <Link href="https://rojo.space/docs" class="text-12-medium">
                      {language.t("home.tip.learnMore")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Match>
        </Switch>
      </div>
    </div>
  )
}
