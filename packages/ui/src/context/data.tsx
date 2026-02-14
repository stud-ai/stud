import type {
  Message,
  Session,
  Part,
  FileDiff,
  SessionStatus,
  PermissionRequest,
  QuestionRequest,
  QuestionAnswer,
} from "@stud/sdk/v2"
import { createSimpleContext } from "./helper"
import { PreloadMultiFileDiffResult } from "@pierre/diffs/ssr"

// Picker types - these match the SDK generated types
export type PickerItem = {
  id: string | number
  name: string
  thumbnailUrl?: string
  description?: string
  metadata?: Record<string, any>
}

export type PickerRequest = {
  id: string
  sessionID: string
  title: string
  items: PickerItem[]
  recommended?: (string | number)[]
  selectionRange?: {
    min?: number
    max?: number
    aiPickCount?: number
  }
  multiple?: boolean
  tool?: {
    messageID: string
    callID: string
  }
}

export type PickerSelection = (string | number)[]

type Data = {
  session: Session[]
  session_status: {
    [sessionID: string]: SessionStatus
  }
  session_diff: {
    [sessionID: string]: FileDiff[]
  }
  session_diff_preload?: {
    [sessionID: string]: PreloadMultiFileDiffResult<any>[]
  }
  permission?: {
    [sessionID: string]: PermissionRequest[]
  }
  question?: {
    [sessionID: string]: QuestionRequest[]
  }
  picker?: {
    [sessionID: string]: PickerRequest[]
  }
  message: {
    [sessionID: string]: Message[]
  }
  part: {
    [messageID: string]: Part[]
  }
}

export type PermissionRespondFn = (input: {
  sessionID: string
  permissionID: string
  response: "once" | "always" | "reject"
}) => void

export type QuestionReplyFn = (input: { requestID: string; answers: QuestionAnswer[] }) => void

export type QuestionRejectFn = (input: { requestID: string }) => void

export type PickerReplyFn = (input: { requestID: string; selections: PickerSelection }) => void

export type PickerRejectFn = (input: { requestID: string }) => void

export type NavigateToSessionFn = (sessionID: string) => void

export type SendMessageFn = (text: string) => void

export const { use: useData, provider: DataProvider } = createSimpleContext({
  name: "Data",
  init: (props: {
    data: Data
    directory: string
    onPermissionRespond?: PermissionRespondFn
    onQuestionReply?: QuestionReplyFn
    onQuestionReject?: QuestionRejectFn
    onPickerReply?: PickerReplyFn
    onPickerReject?: PickerRejectFn
    onNavigateToSession?: NavigateToSessionFn
    onSendMessage?: SendMessageFn
  }) => {
    return {
      get store() {
        return props.data
      },
      get directory() {
        return props.directory
      },
      respondToPermission: props.onPermissionRespond,
      replyToQuestion: props.onQuestionReply,
      rejectQuestion: props.onQuestionReject,
      replyToPicker: props.onPickerReply,
      rejectPicker: props.onPickerReject,
      navigateToSession: props.onNavigateToSession,
      sendMessage: props.onSendMessage,
    }
  },
})
