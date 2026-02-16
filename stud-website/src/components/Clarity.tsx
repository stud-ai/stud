"use client"

import clarity from "@microsoft/clarity"
import { useEffect } from "react"

export function Clarity() {
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_CLARITY_ID ?? "vi2wib5dun"
    clarity.init(id)
  }, [])

  return null
}
