import { Dialog } from "@stud/ui/dialog"
import { useLanguage } from "@/context/language"

export function DialogProjectRules() {
  const language = useLanguage()

  return (
    <Dialog title={language.t("sidebar.projectRules")} fit>
      <div class="flex flex-col gap-4 px-6 pb-4">
        <p class="text-14-regular text-text-base">Project rules configuration coming soon.</p>
      </div>
    </Dialog>
  )
}
