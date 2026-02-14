import { Motion, Presence } from "solid-motionone"
import { createMemo, createSignal, type ParentProps, type JSX, onMount } from "solid-js"
import { useLocation } from "@solidjs/router"

function AnimatedPage(props: { children: JSX.Element; key?: string }) {
  return (
    <Motion.div
      class="size-full"
      initial={{ opacity: 0, y: 8 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.2,
          easing: [0.25, 0.1, 0.25, 1],
        },
      }}
      exit={{
        opacity: 0,
        y: -4,
        transition: {
          duration: 0.12,
          easing: [0.25, 0.1, 0.25, 1],
        },
      }}
    >
      {props.children}
    </Motion.div>
  )
}

export function PageTransition(props: ParentProps) {
  const location = useLocation()
  const [mounted, setMounted] = createSignal(false)

  onMount(() => setMounted(true))

  // Use pathname as key to trigger transitions on route change
  const routeKey = createMemo(() => {
    // Group session routes together to avoid transitions between sessions
    if (location.pathname.startsWith("/session/")) return "session"
    return location.pathname
  })

  // Skip animation on initial mount to prevent flicker
  if (!mounted()) {
    return <div class="size-full">{props.children}</div>
  }

  return (
    <Presence exitBeforeEnter>
      <AnimatedPage key={routeKey()}>{props.children}</AnimatedPage>
    </Presence>
  )
}
