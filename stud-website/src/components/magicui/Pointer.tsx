"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { MousePointer2 } from "lucide-react"

type Props = {
  x: number
  y: number
  show: boolean
  className?: string
  text?: string
}

export default function Pointer(props: Props) {
  return (
    <motion.span
      aria-hidden="true"
      className={cn("pointer-events-none absolute left-0 top-0 z-20 inline-flex items-center gap-1 rounded-full border border-white/45 bg-black/45 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-lg backdrop-blur-sm", props.className)}
      animate={{
        x: props.x + 12,
        y: props.y + 12,
        opacity: props.show ? 1 : 0,
        scale: props.show ? 1 : 0.95,
      }}
      transition={{ type: "spring", stiffness: 360, damping: 28, mass: 0.35 }}
    >
      <MousePointer2 className="h-3 w-3" />
      <span>{props.text || "Open"}</span>
    </motion.span>
  )
}
