import { Index } from "solid-js"
import { Dialog } from "@stud/ui/dialog"
import { Button } from "@stud/ui/button"
import { Icon } from "@stud/ui/icon"
import { useDialog } from "@stud/ui/context/dialog"
import { useLanguage } from "@/context/language"

export function DialogConnectionHelp() {
  const dialog = useDialog()
  const language = useLanguage()

  const steps = [
    {
      number: 1,
      title: language.t("connectionHelp.step1.title"),
      description: language.t("connectionHelp.step1.description"),
      icon: "folder" as const,
    },
    {
      number: 2,
      title: language.t("connectionHelp.step2.title"),
      description: language.t("connectionHelp.step2.description"),
      icon: "settings-gear" as const,
    },
    {
      number: 3,
      title: language.t("connectionHelp.step3.title"),
      description: language.t("connectionHelp.step3.description"),
      icon: "check" as const,
    },
    {
      number: 4,
      title: language.t("connectionHelp.step4.title"),
      description: language.t("connectionHelp.step4.description"),
      icon: "window-cursor" as const,
    },
  ]

  return (
    <Dialog title={language.t("connectionHelp.title")} class="w-[480px] max-w-[90vw]" fit transition>
      <div class="flex flex-col gap-5 px-6 pb-6">
        <p class="text-14-regular text-text-weak">{language.t("connectionHelp.subtitle")}</p>

        <div class="flex flex-col gap-3">
          <Index each={steps}>
            {(step) => (
              <div class="flex items-start gap-4 p-4 rounded-lg bg-surface-base border border-border-weak-base hover:border-border-base transition-colors">
                <div class="size-10 rounded-lg bg-surface-primary-weak flex items-center justify-center shrink-0">
                  <Icon name={step().icon} size="normal" class="text-icon-primary-base" />
                </div>
                <div class="flex flex-col gap-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="size-5 rounded-full bg-surface-raised-base text-text-weak text-11-medium flex items-center justify-center shrink-0">
                      {step().number}
                    </span>
                    <span class="text-14-medium text-text-strong">{step().title}</span>
                  </div>
                  <p class="text-13-regular text-text-weak">{step().description}</p>
                </div>
              </div>
            )}
          </Index>
        </div>

        <div class="p-4 rounded-lg bg-surface-warning-base/10 border border-border-warning-base/30">
          <div class="flex items-start gap-2">
            <Icon name="help" size="small" class="text-icon-warning-base shrink-0 mt-0.5" />
            <div class="text-13-regular text-text-base">
              <p class="font-medium text-text-strong mb-1">{language.t("connectionHelp.troubleshooting.title")}</p>
              <ul class="list-disc list-inside space-y-1 text-text-weak">
                <li>{language.t("connectionHelp.troubleshooting.tip1")}</li>
                <li>{language.t("connectionHelp.troubleshooting.tip2")}</li>
                <li>{language.t("connectionHelp.troubleshooting.tip3")}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <Button variant="primary" size="large" onClick={() => dialog.close()}>
            {language.t("common.gotIt")}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
