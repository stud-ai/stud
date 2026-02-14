import { Bus } from "@/bus"
import { BusEvent } from "@/bus/bus-event"
import { Identifier } from "@/id/id"
import { Instance } from "@/project/instance"
import { Log } from "@/util/log"
import z from "zod"

export namespace Picker {
  const log = Log.create({ service: "picker" })

  export const Item = z
    .object({
      id: z.union([z.string(), z.number()]).describe("Unique identifier for the item"),
      name: z.string().describe("Display name"),
      thumbnailUrl: z.string().optional().describe("Thumbnail image URL"),
      description: z.string().optional().describe("Item description"),
      metadata: z.record(z.string(), z.any()).optional().describe("Additional metadata"),
    })
    .meta({
      ref: "PickerItem",
    })
  export type Item = z.infer<typeof Item>

  export const Request = z
    .object({
      id: Identifier.schema("picker"),
      sessionID: Identifier.schema("session"),
      title: z.string().describe("Title for the picker prompt"),
      items: z.array(Item).describe("Items available for selection"),
      recommended: z
        .array(z.union([z.string(), z.number()]))
        .optional()
        .describe("AI-recommended item IDs"),
      selectionRange: z
        .object({
          min: z.number().min(0).optional().describe("Minimum items to select"),
          max: z.number().optional().describe("Maximum items to select"),
          aiPickCount: z.number().optional().describe("How many items AI will auto-pick"),
        })
        .optional()
        .describe("Selection constraints and AI pick count"),
      multiple: z.boolean().optional().describe("Allow selecting multiple items (default: true)"),
      tool: z
        .object({
          messageID: z.string(),
          callID: z.string(),
        })
        .optional(),
    })
    .meta({
      ref: "PickerRequest",
    })
  export type Request = z.infer<typeof Request>

  export const Selection = z.array(z.union([z.string(), z.number()])).meta({
    ref: "PickerSelection",
  })
  export type Selection = z.infer<typeof Selection>

  export const Reply = z.object({
    selections: Selection.describe("Selected item IDs"),
  })
  export type Reply = z.infer<typeof Reply>

  export const Event = {
    Asked: BusEvent.define("picker.asked", Request),
    Replied: BusEvent.define(
      "picker.replied",
      z.object({
        sessionID: z.string(),
        requestID: z.string(),
        selections: Selection,
      }),
    ),
    Rejected: BusEvent.define(
      "picker.rejected",
      z.object({
        sessionID: z.string(),
        requestID: z.string(),
      }),
    ),
  }

  const state = Instance.state(async () => {
    const pending: Record<
      string,
      {
        info: Request
        resolve: (selections: Selection) => void
        reject: (e: any) => void
      }
    > = {}

    return {
      pending,
    }
  })

  export async function ask(input: {
    sessionID: string
    title: string
    items: Item[]
    recommended?: (string | number)[]
    selectionRange?: {
      min?: number
      max?: number
      aiPickCount?: number
    }
    multiple?: boolean
    tool?: { messageID: string; callID: string }
  }): Promise<Selection> {
    const s = await state()
    const id = Identifier.ascending("picker")

    log.info("asking", { id, items: input.items.length })

    return new Promise<Selection>((resolve, reject) => {
      const info: Request = {
        id,
        sessionID: input.sessionID,
        title: input.title,
        items: input.items,
        recommended: input.recommended,
        selectionRange: input.selectionRange,
        multiple: input.multiple ?? true,
        tool: input.tool,
      }
      s.pending[id] = {
        info,
        resolve,
        reject,
      }
      Bus.publish(Event.Asked, info)
    })
  }

  export async function reply(input: { requestID: string; selections: Selection }): Promise<void> {
    const s = await state()
    const existing = s.pending[input.requestID]
    if (!existing) {
      log.warn("reply for unknown request", { requestID: input.requestID })
      return
    }
    delete s.pending[input.requestID]

    log.info("replied", { requestID: input.requestID, selections: input.selections })

    Bus.publish(Event.Replied, {
      sessionID: existing.info.sessionID,
      requestID: existing.info.id,
      selections: input.selections,
    })

    existing.resolve(input.selections)
  }

  export async function reject(requestID: string): Promise<void> {
    const s = await state()
    const existing = s.pending[requestID]
    if (!existing) {
      log.warn("reject for unknown request", { requestID })
      return
    }
    delete s.pending[requestID]

    log.info("rejected", { requestID })

    Bus.publish(Event.Rejected, {
      sessionID: existing.info.sessionID,
      requestID: existing.info.id,
    })

    existing.reject(new RejectedError())
  }

  export class RejectedError extends Error {
    constructor() {
      super("The user dismissed this picker")
    }
  }

  export async function list() {
    return state().then((x) => Object.values(x.pending).map((x) => x.info))
  }
}
