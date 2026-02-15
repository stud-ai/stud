"use client"

import { useState, useEffect, useCallback } from "react"
import { useClerk } from "@clerk/nextjs"
import { X, ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react"
import { TransitionPanel } from "@/components/motion-primitives/transition-panel"
import { TextScramble } from "@/components/motion-primitives/text-scramble"
import { BorderTrail } from "@/components/motion-primitives/border-trail"
import { AnimatedGroup } from "@/components/motion-primitives/animated-group"

interface WaitlistModalProps {
    open: boolean
    onClose: () => void
}

export default function WaitlistModal({ open, onClose }: WaitlistModalProps) {
    const { client } = useClerk()
    const [step, setStep] = useState(0)
    const [firstName, setFirstName] = useState("")
    const [email, setEmail] = useState("")
    const [excitement, setExcitement] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [showSuccess, setShowSuccess] = useState(false)
    const [alreadyOnList, setAlreadyOnList] = useState(false)

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setStep(0)
            setFirstName("")
            setEmail("")
            setExcitement("")
            setError("")
            setIsSubmitting(false)
            setShowSuccess(false)
            setAlreadyOnList(false)
        }
    }, [open])

    // Escape to close + body scroll lock
    useEffect(() => {
        if (!open) return
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        document.addEventListener("keydown", handleEsc)
        document.body.style.overflow = "hidden"
        return () => {
            document.removeEventListener("keydown", handleEsc)
            document.body.style.overflow = ""
        }
    }, [open, onClose])

    const handleSubmit = useCallback(async () => {
        setIsSubmitting(true)
        setError("")
        try {
            await client?.joinWaitlist({
                emailAddress: email,
            })

            // Sync extra fields (name + excitement) to Supabase
            try {
                await fetch("/api/waitlist-metadata", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email,
                        firstName: firstName.trim(),
                        excitement: excitement.trim() || undefined,
                    }),
                })
            } catch {
                // Non-critical — don't block the success state
            }

            setShowSuccess(true)
            setStep(3)
        } catch (err: any) {
            console.error("[waitlist] Error:", err)
            const code = err?.errors?.[0]?.code
            // Clerk returns this code when the email is already on the waitlist
            if (code === "form_identifier_exists" || code === "waitlist_entry_already_exists") {
                setAlreadyOnList(true)
                setShowSuccess(true)
                setStep(3)
                return
            }
            const clerkError = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message
            setError(clerkError || "Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }, [client, email, firstName, excitement])

    const canAdvance = () => {
        if (step === 0) return firstName.trim().length > 0
        if (step === 1) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        if (step === 2) return true // excitement is optional
        return false
    }

    const handleNext = () => {
        if (step === 2) {
            handleSubmit()
        } else {
            setError("")
            setStep((s) => s + 1)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && canAdvance()) {
            e.preventDefault()
            handleNext()
        }
    }

    if (!open) return null

    const panelVariants = {
        enter: { opacity: 0, x: 24, filter: "blur(4px)" },
        center: { opacity: 1, x: 0, filter: "blur(0px)" },
        exit: { opacity: 0, x: -24, filter: "blur(4px)" },
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg border border-foreground/10 text-foreground/50 transition-colors hover:text-foreground hover:bg-foreground/5"
                    aria-label="Close"
                >
                    <X className="h-4 w-4" />
                </button>

                {/* Card */}
                <div className="overflow-hidden rounded-xl border border-foreground/10 bg-white shadow-2xl shadow-foreground/10">
                    {/* Header */}
                    <div className="px-8 pt-8 pb-2">
                        <h2 className="font-display text-2xl font-normal text-foreground">
                            Join the waitlist
                        </h2>
                        <p className="mt-1.5 text-sm text-foreground/50">
                            {step === 3
                                ? "Welcome aboard!"
                                : `Step ${step + 1} of 3`}
                        </p>
                    </div>

                    {/* Step progress bar */}
                    <div className="mx-8 mt-3 flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="h-1 flex-1 rounded-full transition-all duration-300"
                                style={{
                                    backgroundColor:
                                        i <= step
                                            ? step === 3
                                                ? "#22c55e"
                                                : "#1a1817"
                                            : "#e7e5e4",
                                }}
                            />
                        ))}
                    </div>

                    {/* Form content */}
                    <div className="px-8 py-6">
                        <TransitionPanel
                            activeIndex={step}
                            variants={panelVariants}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            {/* Step 0: Name */}
                            <div>
                                <AnimatedGroup preset="blur-slide" className="space-y-3">
                                    <label className="block text-sm font-medium text-foreground">
                                        What&apos;s your name?
                                    </label>
                                    <div className="relative rounded-lg overflow-hidden">
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="First name"
                                            autoFocus
                                            className="w-full rounded-lg border border-foreground/15 bg-white px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-foreground/30"
                                        />
                                        <BorderTrail
                                            className="bg-foreground/20"
                                            size={40}
                                            borderRadius={8}
                                            transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                                        />
                                    </div>
                                </AnimatedGroup>
                            </div>

                            {/* Step 1: Email */}
                            <div>
                                <AnimatedGroup preset="blur-slide" className="space-y-3">
                                    <label className="block text-sm font-medium text-foreground">
                                        Your email, {firstName || "friend"}
                                    </label>
                                    <div className="relative rounded-lg overflow-hidden">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="you@example.com"
                                            autoFocus
                                            className="w-full rounded-lg border border-foreground/15 bg-white px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-foreground/30"
                                        />
                                        <BorderTrail
                                            className="bg-foreground/20"
                                            size={40}
                                            borderRadius={8}
                                            transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                                        />
                                    </div>
                                </AnimatedGroup>
                            </div>

                            {/* Step 2: Excitement */}
                            <div>
                                <AnimatedGroup preset="blur-slide" className="space-y-3">
                                    <label className="block text-sm font-medium text-foreground">
                                        What excites you most about Stud?
                                    </label>
                                    <div className="relative rounded-lg">
                                        <textarea
                                            value={excitement}
                                            onChange={(e) => setExcitement(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault()
                                                    handleNext()
                                                }
                                            }}
                                            placeholder="Optional — tell us what you're building!"
                                            rows={3}
                                            autoFocus
                                            className="block w-full resize-none rounded-lg border border-foreground/15 bg-white px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-foreground/30"
                                        />
                                        <BorderTrail
                                            className="bg-foreground/20"
                                            size={40}
                                            borderRadius={8}
                                            transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                                        />
                                    </div>
                                    <p className="text-xs text-foreground/30">
                                        Press Enter to skip or submit
                                    </p>
                                </AnimatedGroup>
                            </div>

                            {/* Step 3: Success */}
                            <div className="flex flex-col items-center py-6 text-center">
                                <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full ${alreadyOnList ? 'bg-blue-500/10' : 'bg-emerald-500/10'}`}>
                                    <Check className={`h-7 w-7 ${alreadyOnList ? 'text-blue-600' : 'text-emerald-600'}`} strokeWidth={2.5} />
                                </div>
                                <TextScramble
                                    as="h3"
                                    trigger={showSuccess}
                                    duration={1.2}
                                    className="font-display text-xl text-foreground"
                                >
                                    {alreadyOnList
                                        ? "You\u0027re already on the list!"
                                        : "You\u0027re on the list!"}
                                </TextScramble>
                                <p className="mt-2 text-sm text-foreground/50">
                                    {alreadyOnList
                                        ? "We already have your spot saved. Hang tight!"
                                        : "We\u0027ll reach out when your spot is ready."}
                                </p>
                            </div>
                        </TransitionPanel>

                        {/* Error */}
                        {error && (
                            <p className="mt-3 text-sm text-red-600">{error}</p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-foreground/5 px-8 py-4">
                        {step > 0 && step < 3 ? (
                            <button
                                onClick={() => {
                                    setError("")
                                    setStep((s) => s - 1)
                                }}
                                className="inline-flex items-center gap-1.5 text-sm text-foreground/50 transition-colors hover:text-foreground"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back
                            </button>
                        ) : (
                            <div />
                        )}

                        {step < 3 ? (
                            <button
                                onClick={handleNext}
                                disabled={!canAdvance() || isSubmitting}
                                className="btn-metal-dark inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium text-white transition-all disabled:opacity-40 disabled:pointer-events-none"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Joining...
                                    </>
                                ) : step === 2 ? (
                                    <>
                                        Join Waitlist
                                        <Check className="h-4 w-4" />
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={onClose}
                                className="btn-metal inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium text-foreground"
                            >
                                Done
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
