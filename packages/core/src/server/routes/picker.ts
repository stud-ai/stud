import { Hono } from "hono"
import { describeRoute, validator } from "hono-openapi"
import { resolver } from "hono-openapi"
import { Picker } from "../../picker"
import z from "zod"
import { errors } from "../error"
import { lazy } from "../../util/lazy"

export const PickerRoutes = lazy(() =>
  new Hono()
    .get(
      "/",
      describeRoute({
        summary: "List pending pickers",
        description: "Get all pending picker requests across all sessions.",
        operationId: "picker.list",
        responses: {
          200: {
            description: "List of pending pickers",
            content: {
              "application/json": {
                schema: resolver(Picker.Request.array()),
              },
            },
          },
        },
      }),
      async (c) => {
        const pickers = await Picker.list()
        return c.json(pickers)
      },
    )
    .post(
      "/:requestID/reply",
      describeRoute({
        summary: "Reply to picker request",
        description: "Provide selections to a picker request from the AI assistant.",
        operationId: "picker.reply",
        responses: {
          200: {
            description: "Picker answered successfully",
            content: {
              "application/json": {
                schema: resolver(z.boolean()),
              },
            },
          },
          ...errors(400, 404),
        },
      }),
      validator(
        "param",
        z.object({
          requestID: z.string(),
        }),
      ),
      validator("json", Picker.Reply),
      async (c) => {
        const params = c.req.valid("param")
        const json = c.req.valid("json")
        await Picker.reply({
          requestID: params.requestID,
          selections: json.selections,
        })
        return c.json(true)
      },
    )
    .post(
      "/:requestID/reject",
      describeRoute({
        summary: "Reject picker request",
        description: "Reject a picker request from the AI assistant.",
        operationId: "picker.reject",
        responses: {
          200: {
            description: "Picker rejected successfully",
            content: {
              "application/json": {
                schema: resolver(z.boolean()),
              },
            },
          },
          ...errors(400, 404),
        },
      }),
      validator(
        "param",
        z.object({
          requestID: z.string(),
        }),
      ),
      async (c) => {
        const params = c.req.valid("param")
        await Picker.reject(params.requestID)
        return c.json(true)
      },
    ),
)
