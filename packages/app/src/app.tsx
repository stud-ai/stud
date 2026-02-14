import "@/index.css"
import { createSignal, ErrorBoundary, Show, lazy, type ParentProps } from "solid-js"
import { Router, Route, Navigate, useNavigate } from "@solidjs/router"
import { MetaProvider } from "@solidjs/meta"
import { Font } from "@stud/ui/font"
import { MarkedProvider } from "@stud/ui/context/marked"
import { DiffComponentProvider } from "@stud/ui/context/diff"
import { CodeComponentProvider } from "@stud/ui/context/code"
import { I18nProvider } from "@stud/ui/context"
import { Diff } from "@stud/ui/diff"
import { Code } from "@stud/ui/code"
import { ThemeProvider } from "@stud/ui/theme"
import { GlobalSyncProvider } from "@/context/global-sync"
import { PermissionProvider } from "@/context/permission"
import { LayoutProvider, useLayout } from "@/context/layout"
import { GlobalSDKProvider } from "@/context/global-sdk"
import { normalizeServerUrl, ServerProvider, useServer } from "@/context/server"
import { SettingsProvider } from "@/context/settings"
import { TerminalProvider } from "@/context/terminal"
import { PromptProvider } from "@/context/prompt"
import { FileProvider } from "@/context/file"
import { CommentsProvider } from "@/context/comments"
import { NotificationProvider } from "@/context/notification"
import { ModelsProvider } from "@/context/models"
import { DialogProvider } from "@stud/ui/context/dialog"
import { CommandProvider } from "@/context/command"
import { InstanceProvider } from "@/context/instance"
import { LanguageProvider, useLanguage } from "@/context/language"
import { usePlatform } from "@/context/platform"
import { HighlightsProvider } from "@/context/highlights"
import Layout from "@/pages/layout"
import DirectoryLayout from "@/pages/directory-layout"
import { ErrorPage } from "./pages/error"
import { Suspense } from "solid-js"
import { SplashScreen } from "@/components/splash-screen"
import { base64Encode } from "@stud/util/encode"

const Home = lazy(() => import("@/pages/home"))
const Session = lazy(() => import("@/pages/session"))
const Loading = () => <div class="size-full" />

// Track if splash has been shown this session
let splashShown = false

function HomeWithSplash() {
  const [showSplash, setShowSplash] = createSignal(!splashShown)
  const navigate = useNavigate()
  const layout = useLayout()
  const server = useServer()

  const handleSplashComplete = (connected: boolean) => {
    splashShown = true
    setShowSplash(false)

    if (connected) {
      // Navigate to last project or first available
      const projects = layout.projects.list()
      const lastProject = server.projects.last()

      if (lastProject && projects.find((p) => p.worktree === lastProject)) {
        navigate(`/${base64Encode(lastProject)}/session`)
      } else if (projects.length > 0) {
        const first = projects[0]
        if (first) {
          navigate(`/${base64Encode(first.worktree)}/session`)
        }
      }
    }
  }

  return (
    <>
      <Show when={showSplash()}>
        <SplashScreen onComplete={handleSplashComplete} />
      </Show>
      <Show when={!showSplash()}>
        <Suspense fallback={<Loading />}>
          <Home />
        </Suspense>
      </Show>
    </>
  )
}

function UiI18nBridge(props: ParentProps) {
  const language = useLanguage()
  return <I18nProvider value={{ locale: language.locale, t: language.t }}>{props.children}</I18nProvider>
}

declare global {
  interface Window {
    __STUD__?: { updaterEnabled?: boolean; serverPassword?: string }
  }
}

function MarkedProviderWithNativeParser(props: ParentProps) {
  const platform = usePlatform()
  return <MarkedProvider nativeParser={platform.parseMarkdown}>{props.children}</MarkedProvider>
}

export function AppBaseProviders(props: ParentProps) {
  return (
    <MetaProvider>
      <Font />
      <ThemeProvider>
        <LanguageProvider>
          <UiI18nBridge>
            <ErrorBoundary fallback={(error) => <ErrorPage error={error} />}>
              <DialogProvider>
                <MarkedProviderWithNativeParser>
                  <DiffComponentProvider component={Diff}>
                    <CodeComponentProvider component={Code}>{props.children}</CodeComponentProvider>
                  </DiffComponentProvider>
                </MarkedProviderWithNativeParser>
              </DialogProvider>
            </ErrorBoundary>
          </UiI18nBridge>
        </LanguageProvider>
      </ThemeProvider>
    </MetaProvider>
  )
}

function ServerKey(props: ParentProps) {
  const server = useServer()
  return (
    <Show when={server.url}>
      {props.children}
    </Show>
  )
}

export function AppInterface(props: { defaultUrl?: string }) {
  const platform = usePlatform()

  const stored = (() => {
    if (platform.platform !== "web") return
    const result = platform.getDefaultServerUrl?.()
    if (result instanceof Promise) return
    if (!result) return
    return normalizeServerUrl(result)
  })()

  const defaultServerUrl = () => {
    if (props.defaultUrl) return props.defaultUrl
    if (stored) return stored
    if (location.hostname.includes("opencode.ai")) return "http://localhost:4096"
    if (import.meta.env.DEV)
      return `http://${import.meta.env.VITE_OPENCODE_SERVER_HOST ?? "localhost"}:${import.meta.env.VITE_OPENCODE_SERVER_PORT ?? "4096"}`

    return window.location.origin
  }

  return (
    <ServerProvider defaultUrl={defaultServerUrl()}>
      <ServerKey>
        <GlobalSDKProvider>
          <GlobalSyncProvider>
            <Router
              root={(props) => (
                <SettingsProvider>
                  <PermissionProvider>
                    <LayoutProvider>
                      <NotificationProvider>
                        <ModelsProvider>
                          <CommandProvider>
                            <InstanceProvider>
                              <HighlightsProvider>
                                <Layout>{props.children}</Layout>
                              </HighlightsProvider>
                            </InstanceProvider>
                          </CommandProvider>
                        </ModelsProvider>
                      </NotificationProvider>
                    </LayoutProvider>
                  </PermissionProvider>
                </SettingsProvider>
              )}
            >
              <Route
                path="/"
                component={HomeWithSplash}
              />
              <Route path="/:dir" component={DirectoryLayout}>
                <Route path="/" component={() => <Navigate href="session" />} />
                <Route
                  path="/session/:id?"
                  component={(p) => (
                    <Show when={p.params.id ?? "new"}>
                      <TerminalProvider>
                        <FileProvider>
                          <PromptProvider>
                            <CommentsProvider>
                              <Suspense fallback={<Loading />}>
                                <Session />
                              </Suspense>
                            </CommentsProvider>
                          </PromptProvider>
                        </FileProvider>
                      </TerminalProvider>
                    </Show>
                  )}
                />
              </Route>
            </Router>
          </GlobalSyncProvider>
        </GlobalSDKProvider>
      </ServerKey>
    </ServerProvider>
  )
}
