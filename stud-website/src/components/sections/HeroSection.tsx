"use client"

import WaitlistModal from "@/components/WaitlistModal"
import { useEffect, useRef, useState } from "react"

export default function HeroSection() {
  const unicornRef = useRef<HTMLDivElement>(null)
  const [showWaitlist, setShowWaitlist] = useState(false)

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
      ; (window as any).UnicornStudio = { isInitialized: false }
      const script = document.createElement("script")
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.5/dist/unicornStudio.umd.js"
      script.onload = () => {
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", () => {
            ; (window as any).UnicornStudio.init()
          })
        } else {
          ; (window as any).UnicornStudio.init()
        }
      }
        ; (document.head || document.body).appendChild(script)
    }
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#f8f8f6]">
      {/* Unicorn Studio Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40">
        <div className="hero-unicorn" ref={unicornRef} data-us-project="Ofw4PXBK6L2C7s9RyNL8" style={{ width: "100%", height: "100%" }} />
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
        <button
          onClick={() => setShowWaitlist(true)}
          className="inline-flex items-center justify-center rounded-lg border border-foreground/15 bg-white/70 px-5 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-white"
        >
          Waitlist
        </button>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col items-start justify-center px-6 md:px-12 lg:px-20">
        {/* Badge */}
        <div className="mb-8 flex items-center gap-2 rounded-full border border-foreground/10 bg-white/60 px-4 py-1.5 backdrop-blur-sm">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-foreground/60">Open Source AI Coding Assistant</span>
        </div>

        {/* Headline */}
        <h1 className="font-display max-w-3xl text-left text-4xl font-normal leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[5.5rem]">
          Code smarter <br className="hidden sm:block" />
          for Roblox Studio.
        </h1>

        {/* Subheadline */}
        <p className="mt-7 max-w-xl text-left text-base leading-relaxed text-foreground/50 md:text-lg">
          Write Luau, edit instances, and ship from one terminal.
        </p>

        {/* CTA */}
        <div className="mt-10 flex w-full max-w-2xl items-center gap-5">
          <button
            onClick={() => setShowWaitlist(true)}
            className="btn-metal group inline-flex items-center gap-2.5 rounded-md px-7 py-3.5 text-sm font-medium text-foreground"
          >
            Join the Waitlist
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <a
            href="https://www.producthunt.com/products/stud?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-stud"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-70 transition-opacity hover:opacity-100"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1079916&theme=neutral&t=1771197826903"
              alt="STUD - Cursor for Roblox Studio | Product Hunt"
              width="200"
              height="43"
            />
          </a>
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

      {/* Custom Waitlist Modal */}
      <WaitlistModal open={showWaitlist} onClose={() => setShowWaitlist(false)} />
    </section>
  )
}

