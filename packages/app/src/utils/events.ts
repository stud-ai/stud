// Simple event emitter for cross-component communication

type SendMessageEvent = CustomEvent<{ text: string }>

export function emitSendMessage(text: string) {
  window.dispatchEvent(new CustomEvent("stud:send-message", { detail: { text } }))
}

export function onSendMessage(handler: (text: string) => void) {
  const listener = (e: Event) => {
    const event = e as SendMessageEvent
    handler(event.detail.text)
  }
  window.addEventListener("stud:send-message", listener)
  return () => window.removeEventListener("stud:send-message", listener)
}
