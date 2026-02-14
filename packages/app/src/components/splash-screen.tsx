import { createSignal, onMount, Show } from "solid-js"
import { Icon } from "@stud/ui/icon"
import { Logo } from "@stud/ui/logo"
import "./splash-screen.css"

interface SplashScreenProps {
  onComplete: (connected: boolean) => void
  minDuration?: number
}

export function SplashScreen(props: SplashScreenProps) {
  const [status, setStatus] = createSignal<"checking" | "ready">("checking")
  const [visible, setVisible] = createSignal(true)

  const checkBridge = async (): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:3001/stud/status", {
        method: "GET",
        signal: AbortSignal.timeout(2000),
      })
      if (response.ok) {
        const data = await response.json()
        return data.connected === true
      }
      return false
    } catch {
      return false
    }
  }

  onMount(async () => {
    const startTime = Date.now()
    const minDuration = props.minDuration ?? 800

    setStatus("checking")
    const connected = await checkBridge()

    // Ensure minimum display time for smooth UX
    const elapsed = Date.now() - startTime
    if (elapsed < minDuration) {
      await new Promise((r) => setTimeout(r, minDuration - elapsed))
    }

    setStatus("ready")

    // Fade out
    setVisible(false)
    await new Promise((r) => setTimeout(r, 300))

    props.onComplete(connected)
  })

  return (
    <div
      data-component="splash-screen"
      classList={{
        "splash-visible": visible(),
        "splash-hidden": !visible(),
      }}
    >
      <div data-slot="splash-content">
        {/* Roblox-style icon */}
        <div data-slot="splash-icon">
          <Icon name="roblox" size="large" />
        </div>

        <Logo class="splash-logo" />

        <div data-slot="splash-status">
          <Show when={status() === "checking"}>
            <div data-slot="splash-spinner" />
            <span>Connecting to Studio...</span>
          </Show>
          <Show when={status() === "ready"}>
            <Icon name="check" size="small" />
            <span>Ready</span>
          </Show>
        </div>
      </div>
    </div>
  )
}
