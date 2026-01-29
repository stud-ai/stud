import { createSignal, Match, onCleanup, onMount, Switch } from "solid-js"
import { useLayout } from "@/context/layout"
import { useNavigate } from "@solidjs/router"
import { base64Encode } from "@stud/util/encode"
import { Icon } from "@stud/ui/icon"
import { usePlatform } from "@/context/platform"
import { useDialog } from "@stud/ui/context/dialog"
import { DialogSelectDirectory } from "@/components/dialog-select-directory"
import { DialogSelectServer } from "@/components/dialog-select-server"
import { useServer } from "@/context/server"
import { useLanguage } from "@/context/language"
import { showToast } from "@stud/ui/toast"
import { Button } from "@stud/ui/button"

type BridgeState = "connected" | "waiting" | "error" | "checking"

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

  // ASCII art logo
  const asciiLogo = `███████╗████████╗██╗   ██╗██████╗ 
██╔════╝╚══██╔══╝██║   ██║██╔══██╗
███████╗   ██║   ██║   ██║██║  ██║
╚════██║   ██║   ██║   ██║██║  ██║
███████║   ██║   ╚██████╔╝██████╔╝
╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ `

  return (
    <div class="h-full w-full flex items-center justify-center">
      <div class="flex flex-col items-center max-w-lg w-full px-6">
        {/* ASCII Art Logo */}
        <div class="flex flex-col items-center mb-6">
          <pre class="text-white text-[10px] leading-tight font-mono select-none whitespace-pre">{asciiLogo}</pre>
          <p class="mt-3 text-14-regular text-text-weak">{language.t("home.tagline")}</p>
          <Button
            size="large"
            variant="ghost"
            class="mt-2 text-12-regular text-text-weak"
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

        {/* Connection Options */}
        <div class="flex flex-col gap-4 w-full">
          {/* Primary CTA - Connect to Studio */}
          <button
            class="w-full p-6 rounded-lg border-2 border-border-primary-base bg-surface-base-weak hover:bg-surface-base-active transition-colors text-left group disabled:opacity-50"
            onClick={connectToStudio}
            disabled={connecting()}
          >
            <div class="flex items-center gap-4">
              <div class="size-12 rounded-lg bg-surface-primary-weak flex items-center justify-center">
                <Icon name="window-cursor" size="large" class="text-icon-primary-base" />
              </div>
              <div class="flex-1">
                <div class="text-16-medium text-text-strong group-hover:text-text-primary">
                  {language.t("home.connectToStudio")}
                </div>
                <div class="text-13-regular text-text-weak">{language.t("home.connectToStudio.description")}</div>
              </div>
              <Icon name="arrow-right" size="normal" class="text-text-muted group-hover:text-icon-primary-base" />
            </div>
          </button>

          {/* Secondary Options */}
          <div class="grid grid-cols-2 gap-4">
            <button
              class="p-4 rounded-lg border border-border-weak-base bg-surface-base-weak hover:bg-surface-base-active transition-colors text-left group"
              onClick={openRobloxFile}
            >
              <div class="flex items-center gap-3">
                <div class="size-10 rounded-lg bg-surface-base-active flex items-center justify-center">
                  <Icon name="folder" size="normal" class="text-text-weak" />
                </div>
                <div class="flex-1">
                  <div class="text-14-medium text-text-strong">{language.t("home.openRobloxFile")}</div>
                  <div class="text-12-regular text-text-weak">{language.t("home.openRobloxFile.description")}</div>
                </div>
              </div>
            </button>

            <button
              class="p-4 rounded-lg border border-border-weak-base bg-surface-base-weak hover:bg-surface-base-active transition-colors text-left group"
              onClick={connectViaRojo}
            >
              <div class="flex items-center gap-3">
                <div class="size-10 rounded-lg bg-surface-base-active flex items-center justify-center">
                  <Icon name="code" size="normal" class="text-text-weak" />
                </div>
                <div class="flex-1">
                  <div class="text-14-medium text-text-strong">{language.t("home.connectViaRojo")}</div>
                  <div class="text-12-regular text-text-weak">{language.t("home.connectViaRojo.description")}</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Bridge Status */}
        <div class="flex justify-center mt-6">
          <div class="flex items-center gap-2 text-12-regular text-text-weak">
            <div
              classList={{
                "size-2 rounded-full": true,
                "bg-icon-success-base": bridgeStatus() === "connected",
                "bg-icon-warning-base": bridgeStatus() === "waiting",
                "bg-icon-critical-base": bridgeStatus() === "error",
                "bg-border-weak-base": bridgeStatus() === "checking",
              }}
            />
            <Switch>
              <Match when={bridgeStatus() === "connected"}>{language.t("bridge.connected")}</Match>
              <Match when={bridgeStatus() === "waiting"}>{language.t("bridge.waiting")}</Match>
              <Match when={bridgeStatus() === "error"}>{language.t("bridge.notRunning")}</Match>
              <Match when={bridgeStatus() === "checking"}>{language.t("bridge.checking")}</Match>
            </Switch>
          </div>
        </div>
      </div>
    </div>
  )
}
