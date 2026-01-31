import { createEffect, createSignal, Match, on, onCleanup, onMount, Switch } from "solid-js"
import { useLayout } from "@/context/layout"
import { useNavigate } from "@solidjs/router"
import { base64Encode } from "@stud/util/encode"
import { Icon } from "@stud/ui/icon"
import { Logo } from "@stud/ui/logo"
import { usePlatform } from "@/context/platform"
import { useDialog } from "@stud/ui/context/dialog"
import { DialogSelectDirectory } from "@/components/dialog-select-directory"
import { DialogSelectServer } from "@/components/dialog-select-server"
import { DialogConnectionHelp } from "@/components/dialog-connection-help"
import { useServer } from "@/context/server"
import { useLanguage } from "@/context/language"
import { showToast } from "@stud/ui/toast"

type BridgeState = "connected" | "waiting" | "error" | "checking"

// Module-level flag to track if auto-navigation has already happened this app session
// This persists across component remounts (e.g., when user clicks Home)
let hasAutoNavigated = false

export default function Home() {
  const layout = useLayout()
  const platform = usePlatform()
  const dialog = useDialog()
  const navigate = useNavigate()
  const server = useServer()
  const language = useLanguage()

  // Bridge status
  const [bridgeStatus, setBridgeStatus] = createSignal<BridgeState>("checking")
  const [connecting, setConnecting] = createSignal(false)
  const [visible, setVisible] = createSignal(false)

  const checkBridge = async () => {
    try {
      const response = await fetch("http://localhost:3001/stud/status", {
        method: "GET",
        signal: AbortSignal.timeout(2000),
      })
      if (response.ok) {
        const data = await response.json()
        setBridgeStatus(data.connected ? "connected" : "waiting")
        return data.connected ? "connected" : "waiting"
      }
      setBridgeStatus("error")
      return "error"
    } catch {
      setBridgeStatus("error")
      return "error"
    }
  }

  onMount(() => {
    checkBridge()
    const interval = setInterval(checkBridge, 3000)
    onCleanup(() => clearInterval(interval))
    // Trigger CSS fade-in after a brief moment
    requestAnimationFrame(() => setVisible(true))
  })

  // Auto-navigate to the last project when connected (only on first app load)
  createEffect(
    on(bridgeStatus, (status) => {
      if (status !== "connected") return
      if (hasAutoNavigated) return

      // Check if there's a last project to navigate to
      const projects = layout.projects.list()
      const lastProject = server.projects.last()

      if (lastProject && projects.find((p) => p.worktree === lastProject)) {
        hasAutoNavigated = true
        navigate(`/${base64Encode(lastProject)}/session`)
      } else if (projects.length > 0) {
        // Navigate to the first project if we have any
        hasAutoNavigated = true
        const first = projects[0]
        if (first) {
          navigate(`/${base64Encode(first.worktree)}/session`)
        }
      }
    }),
  )

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

  async function connectToStudio() {
    setConnecting(true)
    const status = await checkBridge()
    setConnecting(false)

    if (status === "connected") {
      showToast({
        title: language.t("bridge.connected"),
        description: language.t("home.connectToStudio.success"),
      })
      // Navigate to a new session in a special "roblox-studio" project
      const studioDir = "roblox-studio"
      layout.projects.open(studioDir)
      navigate(`/${base64Encode(studioDir)}/session`)
    } else if (status === "waiting") {
      showToast({
        title: language.t("bridge.waiting"),
        description: language.t("home.connectToStudio.waiting"),
      })
    } else {
      showToast({
        title: language.t("bridge.notRunning"),
        description: language.t("home.connectToStudio.error"),
      })
    }
  }

  function openRobloxFile() {
    chooseProject()
  }

  function connectViaRojo() {
    chooseProject()
  }

  return (
    <div class="h-full w-full flex items-center justify-center home-bg overflow-hidden relative">
      {/* Floating background blobs */}
      <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          class="absolute w-[500px] h-[500px] rounded-full blur-[100px] mix-blend-screen animate-float"
          style={{
            top: "-10%",
            left: "20%",
            background: "rgba(63, 63, 70, 0.1)",
          }}
        />
        <div
          class="absolute w-[400px] h-[400px] rounded-full blur-[80px] mix-blend-screen animate-float"
          style={{
            bottom: "-10%",
            right: "20%",
            background: "rgba(63, 63, 70, 0.1)",
            "animation-delay": "-2s",
          }}
        />
      </div>

      {/* Main content */}
      <div
        class="flex flex-col items-center max-w-2xl w-full px-6 z-10 gap-10 transition-all duration-500 ease-out"
        classList={{
          "opacity-0 translate-y-4": !visible(),
          "opacity-100 translate-y-0": visible(),
        }}
      >
        {/* Logo and Title Section */}
        <div class="text-center space-y-6">
          <div class="flex flex-col items-center gap-4">
            {/* Logo with hover effect */}
            <div class="relative group cursor-default">
              <div class="absolute inset-0 bg-white/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div class="relative transform group-hover:scale-105 transition-transform duration-300">
                <Logo class="scale-[2]" />
              </div>
            </div>

            <div class="space-y-2 mt-4">
              <h1 class="text-5xl font-bold tracking-tight text-white">Stud</h1>
              <p class="text-lg text-zinc-400 font-medium">{language.t("home.tagline")}</p>
            </div>
          </div>

          {/* Connection status badge */}
          <button
            type="button"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm shadow-lg hover:border-zinc-700 transition-colors"
            onClick={() => dialog.show(() => <DialogSelectServer />)}
          >
            <span class="relative flex h-2 w-2">
              <span
                classList={{
                  "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75": true,
                  "bg-green-400": server.healthy() === true,
                  "bg-red-400": server.healthy() === false,
                  "bg-zinc-400": server.healthy() === undefined,
                }}
              />
              <span
                classList={{
                  "relative inline-flex rounded-full h-2 w-2": true,
                  "bg-green-500": server.healthy() === true,
                  "bg-red-500": server.healthy() === false,
                  "bg-zinc-500": server.healthy() === undefined,
                }}
              />
            </span>
            <span class="text-xs font-mono text-zinc-400">{server.name}</span>
          </button>
        </div>

        {/* Action Cards */}
        <div class="w-full space-y-4">
          {/* Primary CTA - Connect to Studio */}
          <button
            type="button"
            class="group relative w-full text-left outline-none focus:outline-none disabled:opacity-50"
            onClick={connectToStudio}
            disabled={connecting()}
          >
            <div class="main-action-glow" />
            <div class="relative glass-card rounded-2xl p-6 transition-all duration-300 group-hover:bg-zinc-800/50 group-active:scale-[0.99]">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-6">
                  <div class="h-14 w-14 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-zinc-600 transition-colors shadow-inner">
                    <Icon name="window-cursor" size="large" class="text-white" />
                  </div>
                  <div class="space-y-1">
                    <h2 class="text-xl font-semibold text-white group-hover:text-white/90">
                      {language.t("home.connectToStudio")}
                    </h2>
                    <p class="text-sm text-zinc-400 group-hover:text-zinc-300">
                      {language.t("home.connectToStudio.description")}
                    </p>
                  </div>
                </div>
                <div class="pr-2 transform transition-transform duration-300 group-hover:translate-x-1">
                  <Icon name="arrow-right" size="normal" class="text-zinc-500 group-hover:text-white" />
                </div>
              </div>
            </div>
          </button>

          {/* Secondary Options Grid */}
          <div class="grid grid-cols-2 gap-4">
            {/* Open .rbxl File */}
            <button
              type="button"
              class="group glass-card rounded-xl p-5 text-left transition-all duration-300 hover:bg-zinc-800/50 active:scale-[0.98]"
              onClick={openRobloxFile}
            >
              <div class="flex flex-col gap-4">
                <div class="h-10 w-10 rounded-lg bg-zinc-900/50 flex items-center justify-center border border-zinc-800/50 group-hover:border-zinc-700">
                  <Icon name="folder" size="normal" class="text-zinc-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 class="font-medium text-white mb-1">{language.t("home.openRobloxFile")}</h3>
                  <p class="text-xs text-zinc-500 group-hover:text-zinc-400">
                    {language.t("home.openRobloxFile.description")}
                  </p>
                </div>
              </div>
            </button>

            {/* Connect via Rojo */}
            <button
              type="button"
              class="group glass-card rounded-xl p-5 text-left transition-all duration-300 hover:bg-zinc-800/50 active:scale-[0.98]"
              onClick={connectViaRojo}
            >
              <div class="flex flex-col gap-4">
                <div class="h-10 w-10 rounded-lg bg-zinc-900/50 flex items-center justify-center border border-zinc-800/50 group-hover:border-zinc-700">
                  <Icon name="code" size="normal" class="text-zinc-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 class="font-medium text-white mb-1">{language.t("home.connectViaRojo")}</h3>
                  <p class="text-xs text-zinc-500 group-hover:text-zinc-400">
                    {language.t("home.connectViaRojo.description")}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Bridge Status */}
        <div class="flex items-center gap-2 text-sm text-zinc-400">
          <div
            classList={{
              "h-2 w-2 rounded-full transition-colors duration-300": true,
              "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]": bridgeStatus() === "connected",
              "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]": bridgeStatus() === "waiting",
              "bg-red-500": bridgeStatus() === "error",
              "bg-zinc-500 animate-pulse": bridgeStatus() === "checking",
            }}
          />
          <Switch>
            <Match when={bridgeStatus() === "connected"}>
              <span>{language.t("bridge.connected")}</span>
            </Match>
            <Match when={bridgeStatus() === "waiting"}>
              <span>{language.t("bridge.waiting")}</span>
              <button
                type="button"
                class="text-zinc-300 hover:text-white underline underline-offset-2 hover:no-underline transition-colors duration-150"
                onClick={() => dialog.show(() => <DialogConnectionHelp />)}
              >
                {language.t("bridge.notConnecting")}
              </button>
            </Match>
            <Match when={bridgeStatus() === "error"}>
              <span>{language.t("bridge.notRunning")}</span>
              <button
                type="button"
                class="text-zinc-300 hover:text-white underline underline-offset-2 hover:no-underline transition-colors duration-150"
                onClick={() => dialog.show(() => <DialogConnectionHelp />)}
              >
                {language.t("bridge.notConnecting")}
              </button>
            </Match>
            <Match when={bridgeStatus() === "checking"}>
              <span>{language.t("bridge.checking")}</span>
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  )
}
