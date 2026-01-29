import { Motion, Presence } from "solid-motionone"
import { createMemo, createSignal, type ParentProps, type JSX, onMount, Switch, Match } from "solid-js"
import { useLocation } from "@solidjs/router"

function AnimatedPage(props: { children: JSX.Element }) {
  return (
    <Motion.div
      class="size-full"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.25, easing: [0.4, 0, 0.2, 1] } }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.15, easing: [0.4, 0, 1, 1] } }}
    >
      {props.children}
    </Motion.div>
  )
}

export function PageTransition(props: ParentProps) {
  const location = useLocation()
  const [mounted, setMounted] = createSignal(false)

  onMount(() => setMounted(true))

  // Extract route segment for keying - home vs project pages
  // Session-to-session navigation within same project won't trigger transition
  const isHome = createMemo(() => location.pathname === "/")

  // Skip animation on initial mount to prevent flicker
  if (!mounted()) {
    return <div class="size-full">{props.children}</div>
  }

  return (
    <Presence exitBeforeEnter>
      <Switch>
        <Match when={isHome()}>
          <AnimatedPage>{props.children}</AnimatedPage>
        </Match>
        <Match when={!isHome()}>
          <AnimatedPage>{props.children}</AnimatedPage>
        </Match>
      </Switch>
    </Presence>
  )
}
