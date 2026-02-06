"use client"

import { AlertCircle, Check, Terminal } from "lucide-react"
import { FormEvent, useEffect, useRef, useState } from "react"

export default function HeroSection() {
  const unicornRef = useRef<HTMLDivElement>(null)
  const [mail, setMail] = useState("")
  const [sent, setSent] = useState(false)
  const [warn, setWarn] = useState("")

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = mail.trim()
    if (!value) {
      setWarn("Enter an email first.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setWarn("Use a valid email address.")
      return
    }
    setWarn("")
    setSent(true)
    setMail("")
  }

  useEffect(() => {
    // Initialize Unicorn Studio
    const initUnicorn = () => {
      const u = (window as any).UnicornStudio
      if (u && u.init) {
        u.init()
      }
    }

    if ((window as any).UnicornStudio?.isInitialized !== undefined) {
      initUnicorn()
    } else {
      ;(window as any).UnicornStudio = { isInitialized: false }
      const script = document.createElement("script")
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.5/dist/unicornStudio.umd.js"
      script.onload = () => {
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", () => {
            ;(window as any).UnicornStudio.init()
          })
        } else {
          ;(window as any).UnicornStudio.init()
        }
      }
      ;(document.head || document.body).appendChild(script)
    }
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#f8f8f6]">
      {/* Unicorn Studio Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div ref={unicornRef} data-us-project="Ofw4PXBK6L2C7s9RyNL8" style={{ width: "100%", height: "100%" }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
        <a href="/" className="inline-flex items-center gap-2">
          <img src="/assets/logo_transparent_bg.png" alt="Stud" className="h-7 w-7" />
          <span className="font-tech text-sm tracking-[0.18em] text-foreground md:text-base">STUD</span>
        </a>
        <div className="hidden items-center gap-7 md:flex">
          <a href="/docs" className="text-sm font-medium text-foreground/50 transition-colors hover:text-foreground">
            Docs
          </a>
        </div>
        <a
          href="#waitlist"
          className="inline-flex items-center justify-center rounded-lg border border-foreground/15 bg-white/70 px-5 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-white"
        >
          Waitlist
        </a>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col items-start justify-center px-6 md:px-12 lg:px-20">
        {/* Badge */}
        <div className="mb-8 flex items-center gap-2 rounded-full border border-foreground/10 bg-white/60 px-4 py-1.5 backdrop-blur-sm">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-foreground/60">Open Source AI Coding Assistant</span>
        </div>

        {/* Headline */}
        <h1 className="font-display max-w-3xl text-left text-5xl font-normal leading-[1.08] tracking-tight text-foreground md:text-6xl lg:text-[5.5rem]">
          Code smarter <br className="hidden sm:block" />
          for Roblox Studio.
        </h1>

        {/* Subheadline */}
        <p className="mt-7 max-w-xl text-left text-base leading-relaxed text-foreground/50 md:text-lg">
          Write Luau, edit instances, and ship from one terminal.
        </p>

        {/* CTAs */}
        <div className="mt-10 w-full max-w-2xl">
          <p className="mb-2.5 text-xs font-medium tracking-[0.12em] text-foreground/45">Join the waitlist</p>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
            <div className="relative h-14 w-full max-w-md sm:max-w-lg" id="waitlist">
              <form
                className={`absolute inset-0 flex items-center gap-2 rounded-xl border p-2 shadow-[0_8px_22px_rgba(26,24,23,0.08)] backdrop-blur-md transition-all duration-300 ${warn ? "border-rose-300/80 bg-rose-50/70" : "border-foreground/15 bg-white/72"} ${sent ? "pointer-events-none translate-y-1 opacity-0" : "translate-y-0 opacity-100"}`}
                noValidate
                onSubmit={submit}
              >
                <input
                  autoComplete="email"
                  aria-describedby={warn ? "waitlist-warn" : undefined}
                  aria-invalid={Boolean(warn)}
                  className={`h-full min-w-0 flex-1 rounded-lg border bg-white px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/35 ${warn ? "border-rose-300 focus:border-rose-400" : "border-foreground/10 focus:border-foreground/30"}`}
                  onChange={(event) => {
                    setMail(event.target.value)
                    if (warn) setWarn("")
                  }}
                  placeholder="Enter your email"
                  type="email"
                  value={mail}
                />
                <button
                  className="inline-flex h-full items-center justify-center rounded-lg bg-foreground px-4 text-sm font-medium text-white transition-colors hover:bg-foreground/85"
                  type="submit"
                >
                  Send
                </button>
              </form>
              {warn ? (
                <div
                  className={`pointer-events-none absolute top-[calc(100%+8px)] left-0 inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/90 px-2.5 py-1.5 text-xs font-medium text-rose-700 shadow-sm transition-all duration-300 ${sent ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"}`}
                  id="waitlist-warn"
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{warn}</span>
                </div>
              ) : null}
              <div
                className={`absolute inset-0 flex items-center gap-2 rounded-xl border border-foreground/15 bg-white/80 px-4 shadow-[0_8px_22px_rgba(26,24,23,0.08)] backdrop-blur-md transition-all duration-300 ${sent ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"}`}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm font-medium text-foreground">Thanks for signing up.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating terminal preview */}
        <div className="mt-16 w-full max-w-2xl">
          <div className="rounded-xl border border-foreground/10 bg-white/50 p-1 backdrop-blur-md shadow-sm">
            <div className="rounded-lg bg-foreground/[0.03] p-4">
              <div className="mb-3 flex items-center gap-2">
                <img src="/assets/logo_transparent_bg.png" alt="Stud" className="h-4 w-4" />
                <span className="text-xs font-medium text-foreground/40">stud</span>
                <span className="ml-auto text-xs text-foreground/20 font-mono">v1.0</span>
              </div>
              <div className="space-y-0 font-mono text-sm">
                <div className="flex items-center justify-between border-b border-foreground/5 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600/70">◆</span>
                    <span className="text-foreground/50">Get Children &quot;game.Workspace&quot;</span>
                  </div>
                  <span className="text-xs text-foreground/25">47 instances</span>
                </div>
                <div className="flex items-center justify-between border-b border-foreground/5 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600/70">◆</span>
                    <span className="text-foreground/50">Edit Script &quot;ServerScriptService.Main&quot;</span>
                  </div>
                  <span className="text-xs text-foreground/25">+18 -4 lines</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500/70">~</span>
                    <span className="text-foreground/30">Inserting asset from Toolbox...</span>
                  </div>
                  <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/25">Scroll</span>
          <div className="h-8 w-[1px] bg-gradient-to-b from-foreground/20 to-transparent" />
        </div>
      </div>
    </section>
  )
}
