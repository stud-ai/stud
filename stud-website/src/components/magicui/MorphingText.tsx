"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"

type Props = {
  words: string[]
  className?: string
  ms?: number
}

export default function MorphingText(props: Props) {
  const [i, setI] = useState(0)
  const t = props.ms || 2200
  const n = props.words.length
  const v = props.words[i] || ""

  useEffect(() => {
    if (n < 2) return
    const x = setInterval(() => {
      setI((k) => (k + 1) % n)
    }, t)
    return () => clearInterval(x)
  }, [n, t])

  return (
    <span className={cn("relative inline-grid min-w-[9ch] align-baseline", props.className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={v}
          initial={{ opacity: 0, filter: "blur(10px)", y: 7 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={{ opacity: 0, filter: "blur(10px)", y: -7 }}
          transition={{ duration: 0.34, ease: [0.215, 0.61, 0.355, 1] }}
          className="col-start-1 row-start-1 whitespace-nowrap"
        >
          {v}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
