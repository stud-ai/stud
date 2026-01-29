import { createSignal, onCleanup, onMount } from "solid-js"
import { useLanguage } from "@/context/language"

type BridgeState = "connected" | "waiting" | "error" | "checking"

export function BridgeStatus() {
  const language = useLanguage()
  const [status, setStatus] = createSignal<BridgeState>("checking")

  const checkBridge = async () => {
    try {
      const response = await fetch("http://localhost:3001/stud/status", {
        method: "GET",
        signal: AbortSignal.timeout(2000),
      })
      if (response.ok) {
        const data = await response.json()
        setStatus(data.studioConnected ? "connected" : "waiting")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  onMount(() => {
    checkBridge()
    const interval = setInterval(checkBridge, 3000)
    onCleanup(() => clearInterval(interval))
  })

  const label = () => {
    switch (status()) {
      case "connected":
        return language.t("bridge.connected")
      case "waiting":
        return language.t("bridge.waiting")
      case "error":
        return language.t("bridge.notRunning")
      case "checking":
        return language.t("bridge.checking")
    }
  }

  const dotColor = () => {
    switch (status()) {
      case "connected":
        return "bg-icon-success-base"
      case "waiting":
        return "bg-icon-warning-base"
      case "error":
        return "bg-icon-critical-base"
      case "checking":
        return "bg-border-weak-base"
    }
  }

  return (
    <div class="flex items-center gap-2 text-12-regular text-text-weak">
      <div classList={{ "size-2 rounded-full": true, [dotColor()]: true }} />
      {label()}
    </div>
  )
}
