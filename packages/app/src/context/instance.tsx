import { createEffect, onCleanup } from "solid-js"
import { createStore } from "solid-js/store"
import { createSimpleContext } from "@stud/ui/context/helper"
import { studioRequest } from "@/utils/studio"

export type InstanceSelection = {
  path: string
  name: string
  className: string
  filePath?: string
}

export const { use: useInstance, provider: InstanceProvider } = createSimpleContext({
  name: "Instance",
  init: () => {
    const [store, setStore] = createStore({
      // Visual highlight in Explorer (can be overwritten by Studio polling)
      highlighted: null as InstanceSelection | null,
      // Pinned selection for Inspector (user-controlled, only changes on double-click)
      inspected: null as InstanceSelection | null,
    })

    const isEqual = (a: InstanceSelection | null, b: InstanceSelection | null) => {
      if (!a && !b) return true
      if (!a || !b) return false
      return (
        a.path === b.path &&
        a.name === b.name &&
        a.className === b.className &&
        a.filePath === b.filePath
      )
    }

    const setHighlighted = (next: InstanceSelection | null) => {
      if (isEqual(next, store.highlighted)) return
      setStore("highlighted", next)
    }

    const setInspected = (next: InstanceSelection | null) => {
      if (isEqual(next, store.inspected)) return
      setStore("inspected", next)
    }

    // Poll Studio for selection changes - only updates highlighted, NOT inspected
    createEffect(() => {
      const poll = () => {
        studioRequest<InstanceSelection[]>("/selection/get").then((result) => {
          if (!result.success) return
          const first = result.data[0] ?? null
          setHighlighted(first)
        })
      }

      poll()
      const interval = setInterval(poll, 2000)
      onCleanup(() => clearInterval(interval))
    })

    return {
      // Highlighted state (for Explorer visual highlighting)
      highlighted() {
        return store.highlighted
      },
      setHighlighted,

      // Inspected state (for Inspector panel - user-controlled, persists)
      inspected() {
        return store.inspected
      },
      setInspected,
      clearInspected() {
        setStore("inspected", null)
      },

      // Backward compatibility aliases
      selected() {
        return store.highlighted
      },
      setSelected: setHighlighted,
      clear() {
        setStore("highlighted", null)
      },
    }
  },
})
