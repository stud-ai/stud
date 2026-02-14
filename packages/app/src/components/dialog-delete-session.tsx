import { Component } from "solid-js"
import { Dialog } from "@stud/ui/dialog"
import { Button } from "@stud/ui/button"
import { useLanguage } from "@/context/language"
import { useDialog } from "@stud/ui/context/dialog"
import { Session } from "@stud/sdk/v2/client"
import { useDeleteSession } from "@/hooks/use-delete-session"

export interface DialogDeleteSessionProps {
  session: Session
}

export const DialogDeleteSession: Component<DialogDeleteSessionProps> = (props) => {
  const language = useLanguage()
  const dialog = useDialog()
  const deleteSession = useDeleteSession()

  const handleDelete = async () => {
    await deleteSession(props.session)
    dialog.close()
  }

  return (
    <Dialog title={language.t("session.delete.title")} fit>
      <div class="flex flex-col gap-4 pl-6 pr-2.5 pb-3">
        <div class="flex flex-col gap-1">
          <span class="text-14-regular text-text-strong">
            {language.t("session.delete.confirm", { name: props.session.title })}
          </span>
        </div>
        <div class="flex justify-end gap-2">
          <Button variant="ghost" size="large" onClick={() => dialog.close()}>
            {language.t("common.cancel")}
          </Button>
          <Button variant="primary" size="large" onClick={handleDelete}>
            {language.t("session.delete.button")}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
