"use client"

import { cn } from "@/lib/utils"

type Props = {
  text: string
  className?: string
  size?: number
}

export default function SpinningText(props: Props) {
  const chars = [...props.text]
  const n = chars.length || 1
  const s = props.size || 104
  const r = s / 2 - 9

  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none relative inline-block", props.className)}
      style={{ width: s, height: s, animation: "spin 12s linear infinite" }}
    >
      {chars.map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="absolute left-1/2 top-1/2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/85"
          style={{
            transform: `translate(-50%, -50%) rotate(${(i * 360) / n}deg) translateY(-${r}px)`,
          }}
        >
          {ch}
        </span>
      ))}
    </span>
  )
}
