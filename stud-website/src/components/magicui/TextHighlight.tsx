import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type Props = {
  children: ReactNode
  className?: string
}

export default function TextHighlight(props: Props) {
  return (
    <span
      className={cn(
        "relative inline px-[0.08em] py-[0.02em] font-medium text-foreground [box-decoration-break:clone] [-webkit-box-decoration-break:clone]",
        props.className
      )}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-[-0.06em] bottom-[0.03em] h-[0.6em] -rotate-[1.1deg] rounded-[0.34em] bg-[#f6e489]/55" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-[0.02em] bottom-[0.12em] h-[0.34em] rotate-[0.4deg] rounded-[0.3em] bg-[#fff3bf]/55" />
      <span className="relative z-10">{props.children}</span>
    </span>
  )
}
