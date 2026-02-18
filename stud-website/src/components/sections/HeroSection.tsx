"use client"

import MorphingText from "@/components/magicui/MorphingText"
import Pointer from "@/components/magicui/Pointer"
import SpinningText from "@/components/magicui/SpinningText"
import TextHighlight from "@/components/magicui/TextHighlight"
import WaitlistModal from "@/components/WaitlistModal"
import { hit } from "@/lib/clarity"
import { CirclePlay, X } from "lucide-react"
import Link from "next/link"
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react"

const url = process.env.NEXT_PUBLIC_WAITLIST_VIDEO_URL || "https://www.youtube.com/watch?v=Y7aZDiy0E2c"

const parse = (v: string) => {
  const s = v.trim()
  const m = s.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/)
  return m?.[1] || null
}

type Uni = {
  init?: () => void
  isInitialized?: boolean
}

export default function HeroSection() {
  const unicornRef = useRef<HTMLDivElement>(null)
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [source, setSource] = useState("hero")
  const [video, setVideo] = useState(false)
  const [point, setPoint] = useState({ x: 0, y: 0, show: false })
  const id = useMemo(() => parse(url), [])
  const embed = id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1` : url

  const open = (v: string) => {
    setSource(v)
    hit(`waitlist_cta_${v}`)
    setShowWaitlist(true)
  }

  const demo = () => {
    hit("open_demo_video")
    setVideo(true)
  }

  const enter = (e: MouseEvent<HTMLButtonElement>) => {
    const box = e.currentTarget.getBoundingClientRect()
    setPoint({
      x: box.width / 2,
      y: box.height / 2,
      show: true,
    })
  }

  const move = (e: MouseEvent<HTMLButtonElement>) => {
    const box = e.currentTarget.getBoundingClientRect()
    setPoint({
      x: e.clientX - box.left,
      y: e.clientY - box.top,
      show: true,
    })
  }

  const leave = () => {
    setPoint((v) => ({
      x: v.x,
      y: v.y,
      show: false,
    }))
  }

  useEffect(() => {
    const w = window as Window & { UnicornStudio?: Uni }
    const initUnicorn = () => {
      const u = w.UnicornStudio
      if (u && u.init) {
        u.init()
      }
    }

    if (w.UnicornStudio?.isInitialized !== undefined) {
      initUnicorn()
      return
    }

    w.UnicornStudio = { isInitialized: false }
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.5/dist/unicornStudio.umd.js"
    script.onload = () => {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          const next = w.UnicornStudio
          if (next && next.init) next.init()
        })
        return
      }
      const next = w.UnicornStudio
      if (next && next.init) next.init()
    }
    ; (document.head || document.body).appendChild(script)
  }, [])

  useEffect(() => {
    const sync = () => {
      if (window.location.hash === "#waitlist") {
        open("hash")
        return
      }
      if (window.location.hash === "#watch-demo") {
        demo()
      }
    }
    sync()
    window.addEventListener("hashchange", sync)
    return () => window.removeEventListener("hashchange", sync)
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#f8f8f6]" id="waitlist">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40">
        <div className="hero-unicorn" ref={unicornRef} data-us-project="Ofw4PXBK6L2C7s9RyNL8" style={{ width: "100%", height: "100%" }} />
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-0 z-[15] hidden w-[42%] items-center pr-8 lg:flex xl:w-[46%]">
        <button
          type="button"
          onClick={demo}
          onMouseEnter={enter}
          onMouseMove={move}
          onMouseLeave={leave}
          className="pointer-events-auto group relative ml-auto w-full max-w-[560px] cursor-none overflow-hidden rounded-2xl border border-foreground/10 bg-white/55 shadow-sm backdrop-blur-sm"
        >
          <Pointer x={point.x} y={point.y} show={point.show} text="Play" />
          <img
            src="/assets/stud-docs-waitlist-social-v2.png"
            alt="Stud video preview"
            className="aspect-video w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
          <div className="absolute left-5 bottom-5 right-5 flex items-center justify-between">
            <div className="text-left">
              <p className="text-white/90 text-xs uppercase tracking-[0.14em]">YouTube Demo</p>
              <p className="font-display text-white text-2xl tracking-tight xl:text-3xl">See the full workflow</p>
            </div>
            <span className="relative inline-flex h-24 w-24 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-sm transition-transform duration-300 ease-out group-hover:scale-105">
              <SpinningText text="watch demo • launch flow • " size={90} className="absolute" />
              <CirclePlay className="relative z-10 h-8 w-8" />
            </span>
          </div>
        </button>
      </div>

      <nav className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2">
          <img src="/assets/logo_transparent_bg.png" alt="Stud" className="h-7 w-7" />
          <span className="font-tech text-sm tracking-[0.18em] text-foreground md:text-base">STUD</span>
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          <Link href="/docs" className="text-sm font-medium text-foreground/50 transition-colors hover:text-foreground">
            Docs
          </Link>
        </div>
        <button
          onClick={() => open("nav")}
          className="inline-flex items-center justify-center rounded-lg border border-foreground/15 bg-white/70 px-5 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-white"
        >
          Join Waitlist
        </button>
      </nav>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col items-start justify-center px-6 md:px-12 lg:px-20">
        <div className="mb-8 flex items-center gap-2 rounded-full border border-foreground/10 bg-white/60 px-4 py-1.5 backdrop-blur-sm">
          <div className="h-1.5 w-1.5 rounded-full bg-foreground/75 animate-pulse" />
          <span className="text-xs font-medium text-foreground/60">Waitlist Open for Early Access</span>
        </div>

        <h1 className="font-display max-w-3xl text-left text-4xl font-normal leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[5.4rem]">
          Code smarter <br className="hidden sm:block" />
          for Roblox <MorphingText words={["Studio.", "updates.", "teams."]} className="text-foreground" />
        </h1>

        <p className="mt-7 max-w-xl text-left text-base leading-relaxed text-foreground/50 md:text-lg">
          Write Luau, edit instances, and ship from one terminal.
          <br />
          <TextHighlight className="mt-2 inline-block">Join waitlist for private beta</TextHighlight>
        </p>

        <div className="mt-10 flex w-full max-w-2xl flex-wrap items-center gap-3.5">
          <button
            onClick={() => open("hero")}
            className="btn-metal group inline-flex items-center gap-2.5 rounded-md px-7 py-3.5 text-sm font-medium text-foreground"
          >
            Join the Waitlist
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={demo}
            className="btn-metal group inline-flex items-center gap-2.5 rounded-md px-7 py-3.5 text-sm font-medium text-foreground"
          >
            Watch Demo
            <CirclePlay className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          </button>
        </div>

        <div className="mt-6">
          <a href="https://www.producthunt.com/products/stud?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-stud" target="_blank" rel="noopener noreferrer">
            <img alt="STUD - Cursor for Roblox Studio | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1079916&theme=neutral&t=1771441647795" />
          </a>
        </div>

        <div className="mt-10 w-full max-w-lg lg:hidden">
          <button
            type="button"
            onClick={demo}
            className="group relative block w-full overflow-hidden rounded-xl border border-foreground/10 bg-white/55 shadow-sm backdrop-blur-sm"
          >
            <img
              src="/assets/stud-docs-waitlist-social-v2.png"
              alt="Stud video preview"
              className="aspect-video w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-white">
              <CirclePlay className="h-3.5 w-3.5" />
              Play
            </span>
          </button>
        </div>
      </div>

      <WaitlistModal open={showWaitlist} onClose={() => setShowWaitlist(false)} source={source} />
      {video ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" aria-label="Close video" onClick={() => setVideo(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-5xl overflow-hidden rounded-xl border border-white/20 bg-black shadow-2xl">
            <button
              type="button"
              onClick={() => setVideo(false)}
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <iframe
              src={embed}
              title="Stud Demo Video"
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}
    </section>
  )
}
