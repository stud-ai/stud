"use client"

import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, ChevronRight } from "lucide-react"

const navGroups = [
  {
    label: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation & Setup", href: "/docs/getting-started" },
    ],
  },
  {
    label: "Core Concepts",
    items: [
      { title: "Tools Reference", href: "/docs/tools" },
      { title: "Permissions", href: "/docs/permissions" },
    ],
  },
  {
    label: "Integrations",
    items: [
      { title: "Roblox Studio", href: "/docs/roblox" },
    ],
  },
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Top navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[90rem] items-center gap-4 px-6">
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground/60 transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <a href="/" className="inline-flex items-center gap-2">
            <img src="/assets/logo_transparent_bg.png" alt="Stud" className="h-6 w-6" />
            <span className="font-tech text-sm tracking-[0.18em] text-foreground">STUD</span>
          </a>

          <span className="text-foreground/20">/</span>

          <a href="/docs" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
            Docs
          </a>

          <div className="ml-auto hidden items-center gap-5 md:flex">
            <a
              href="https://github.com/improdead/stud"
              className="text-sm text-foreground/50 transition-colors hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-foreground/15 bg-secondary px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-tertiary"
            >
              Back to Site
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[90rem]">
        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 z-30 w-72 transform border-r border-border bg-white pt-14 transition-transform duration-200 ease-in-out lg:sticky lg:top-14 lg:z-auto lg:h-[calc(100vh-3.5rem)] lg:translate-x-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <nav className="h-full overflow-y-auto px-4 py-6">
              {navGroups.map((group) => (
                <div key={group.label} className="mb-6">
                  <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.1em] text-foreground/40">
                    {group.label}
                  </h4>
                  <ul className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <li key={item.href}>
                          <a
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                              isActive
                                ? "bg-secondary font-medium text-foreground"
                                : "text-foreground/60 hover:bg-secondary/60 hover:text-foreground"
                            }`}
                          >
                            {isActive && <ChevronRight className="h-3 w-3 flex-none" />}
                            {item.title}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-foreground/20 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main content */}
          <main className="min-w-0 flex-1 px-6 py-10 md:px-12 lg:px-16">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
