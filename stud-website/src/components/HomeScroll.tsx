"use client"

import { useEffect } from "react"

export default function HomeScroll() {
  useEffect(() => {
    document.documentElement.classList.add("home-scroll")
    document.body.classList.add("home-scroll")

    return () => {
      document.documentElement.classList.remove("home-scroll")
      document.body.classList.remove("home-scroll")
    }
  }, [])

  return null
}
