import { Component, createSignal, onMount } from "solid-js"
import { Button } from "@stud/ui/button"
import { TextField } from "@stud/ui/text-field"
import { Icon } from "@stud/ui/icon"
import { useLanguage } from "@/context/language"
import { useGlobalSDK } from "@/context/global-sdk"
import { usePlatform } from "@/context/platform"
import { Link } from "./link"

interface RobloxAuthStatus {
  authenticated: boolean
  username?: string
  displayName?: string
  userId?: number
}

export const SettingsRoblox: Component = () => {
  const language = useLanguage()
  const globalSDK = useGlobalSDK()
  const platform = usePlatform()
  const fetcher = platform.fetch ?? fetch

  const [status, setStatus] = createSignal<RobloxAuthStatus>({ authenticated: false })
  const [loading, setLoading] = createSignal(true)
  const [cookie, setCookie] = createSignal("")
  const [error, setError] = createSignal("")
  const [logging, setLogging] = createSignal(false)

  const fetchStatus = async () => {
    try {
      const response = await fetcher(`${globalSDK.url}/roblox/status`)
      if (response.ok) {
        const data = await response.json()
        setStatus(data)
      }
    } catch (e) {
      console.error("Failed to fetch Roblox auth status:", e)
    } finally {
      setLoading(false)
    }
  }

  onMount(() => {
    fetchStatus()
  })

  const handleLogin = async () => {
    if (!cookie().trim()) {
      setError(language.t("settings.roblox.error.emptyCookie"))
      return
    }

    setLogging(true)
    setError("")

    try {
      const response = await fetcher(`${globalSDK.url}/roblox/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cookie: cookie() }),
      })

      const data = await response.json()

      if (data.success) {
        setStatus({
          authenticated: true,
          username: data.username,
          displayName: data.displayName,
        })
        setCookie("")
      } else {
        setError(data.error || language.t("settings.roblox.error.loginFailed"))
      }
    } catch {
      setError(language.t("settings.roblox.error.networkError"))
    } finally {
      setLogging(false)
    }
  }

  const handleLogout = async () => {
    setLogging(true)
    try {
      await fetcher(`${globalSDK.url}/roblox/logout`, { method: "POST" })
      setStatus({ authenticated: false })
    } catch (e) {
      console.error("Logout failed:", e)
    } finally {
      setLogging(false)
    }
  }

  return (
    <div class="flex flex-col h-full overflow-y-auto no-scrollbar px-10 pb-10">
      <div class="sticky top-0 z-10 bg-[linear-gradient(to_bottom,var(--surface-raised-stronger-non-alpha)_calc(100%_-_24px),transparent)]">
        <div class="flex flex-col gap-1 pt-6 pb-8">
          <h2 class="text-16-medium text-text-strong">{language.t("settings.roblox.title")}</h2>
          <p class="text-12-regular text-text-weak">{language.t("settings.roblox.subtitle")}</p>
        </div>
      </div>

      <div class="flex flex-col gap-8 w-full">
        {/* Account Section */}
        <div class="flex flex-col gap-1">
          <h3 class="text-14-medium text-text-strong pb-2">{language.t("settings.roblox.section.account")}</h3>

          <div class="bg-surface-raised-base px-4 py-4 rounded-lg">
            {loading() ? (
              <div class="flex items-center gap-2 text-text-weak">
                <span>{language.t("common.loading")}</span>
              </div>
            ) : status().authenticated ? (
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-surface-raised-stronger flex items-center justify-center">
                    <Icon name="brain" class="w-5 h-5 text-text-weak" />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-14-medium text-text-strong">{status().displayName}</span>
                    <span class="text-12-regular text-text-weak">@{status().username}</span>
                  </div>
                </div>
                <Button variant="secondary" size="small" onClick={handleLogout} disabled={logging()}>
                  {language.t("settings.roblox.logout")}
                </Button>
              </div>
            ) : (
              <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                  <label class="text-12-medium text-text-strong">{language.t("settings.roblox.cookieLabel")}</label>
                  <TextField
                    type="password"
                    placeholder={language.t("settings.roblox.cookiePlaceholder")}
                    value={cookie()}
                    onChange={setCookie}
                    class="font-mono text-11"
                  />
                  {error() && <span class="text-12-regular text-semantic-error">{error()}</span>}
                </div>
                <div class="flex items-center gap-2">
                  <Button variant="primary" size="small" onClick={handleLogin} disabled={logging() || !cookie().trim()}>
                    {logging() ? language.t("common.loading") : language.t("settings.roblox.login")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div class="flex flex-col gap-1">
          <h3 class="text-14-medium text-text-strong pb-2">{language.t("settings.roblox.section.info")}</h3>

          <div class="bg-surface-raised-base px-4 py-4 rounded-lg">
            <div class="flex flex-col gap-3 text-12-regular text-text-weak">
              <p>{language.t("settings.roblox.info.why")}</p>
              <p>{language.t("settings.roblox.info.security")}</p>
              <p>
                {language.t("settings.roblox.info.howTo")}{" "}
                <Link href="https://create.roblox.com/docs/cloud/open-cloud/getting-started">
                  {language.t("common.learnMore")}
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Warning Section */}
        <div class="flex gap-3 p-4 rounded-lg bg-surface-raised-base border border-border-weak-base">
          <Icon name="help" class="w-5 h-5 text-text-weak flex-shrink-0 mt-0.5" />
          <div class="flex flex-col gap-1">
            <span class="text-12-medium text-text-strong">{language.t("settings.roblox.warning.title")}</span>
            <span class="text-12-regular text-text-weak">{language.t("settings.roblox.warning.description")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
