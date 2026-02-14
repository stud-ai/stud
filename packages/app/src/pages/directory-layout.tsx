import { createEffect, createMemo, Show, type ParentProps } from "solid-js"
import { useNavigate, useParams } from "@solidjs/router"
import { SDKProvider, useSDK } from "@/context/sdk"
import { SyncProvider, useSync } from "@/context/sync"
import { LocalProvider } from "@/context/local"

import { DataProvider } from "@stud/ui/context"
import type { PickerSelection } from "@stud/ui/context"
import { iife } from "@stud/util/iife"
import type { QuestionAnswer } from "@stud/sdk/v2"
import { decode64 } from "@/utils/base64"
import { showToast } from "@stud/ui/toast"
import { useLanguage } from "@/context/language"
import { emitSendMessage } from "@/utils/events"

export default function Layout(props: ParentProps) {
  const params = useParams()
  const navigate = useNavigate()
  const language = useLanguage()
  const directory = createMemo(() => {
    return decode64(params.dir) ?? ""
  })

  createEffect(() => {
    if (!params.dir) return
    if (directory()) return
    showToast({
      variant: "error",
      title: language.t("common.requestFailed"),
      description: "Invalid directory in URL.",
    })
    navigate("/")
  })
  return (
    <Show when={directory()}>
      <SDKProvider directory={directory()}>
        <SyncProvider>
          {iife(() => {
            const sync = useSync()
            const sdk = useSDK()
            const respond = (input: {
              sessionID: string
              permissionID: string
              response: "once" | "always" | "reject"
            }) => sdk.client.permission.respond(input)

            const replyToQuestion = (input: { requestID: string; answers: QuestionAnswer[] }) =>
              sdk.client.question.reply(input)

            const rejectQuestion = (input: { requestID: string }) => sdk.client.question.reject(input)

            // Picker handlers - use SDK methods
            const replyToPicker = async (input: { requestID: string; selections: PickerSelection }) => {
              await sdk.client.picker.reply({
                requestID: input.requestID,
                selections: input.selections,
              })
            }

            const rejectPicker = async (input: { requestID: string }) => {
              await sdk.client.picker.reject({
                requestID: input.requestID,
              })
            }

            const navigateToSession = (sessionID: string) => {
              navigate(`/${params.dir}/session/${sessionID}`)
            }

            const sendMessage = (text: string) => {
              emitSendMessage(text)
            }

            return (
              <DataProvider
                data={sync.data}
                directory={directory()}
                onPermissionRespond={respond}
                onQuestionReply={replyToQuestion}
                onQuestionReject={rejectQuestion}
                onPickerReply={replyToPicker}
                onPickerReject={rejectPicker}
                onNavigateToSession={navigateToSession}
                onSendMessage={sendMessage}
              >
                <LocalProvider>{props.children}</LocalProvider>
              </DataProvider>
            )
          })}
        </SyncProvider>
      </SDKProvider>
    </Show>
  )
}
