"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { boot, hit, tag } from "@/lib/clarity"

export function Clarity() {
  const path = usePathname()

  useEffect(() => {
    boot()
    tag("site", "stud")
    hit("session_start")
  }, [])

  useEffect(() => {
    if (!path) return
    tag("path", path)
    hit(path.startsWith("/docs") ? "view_docs" : "view_page")
  }, [path])

  return null
}
