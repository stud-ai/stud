import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { Clarity } from "@/components/Clarity"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://trystud.me"),
  title: {
    default: "Stud - AI Coding Assistant for Roblox",
    template: "%s | Stud",
  },
  description:
    "Open-source AI coding assistant with deep Roblox Studio integration. Edit Luau scripts, manipulate instances, and ship updates faster.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Stud",
    "Roblox AI coding assistant",
    "Roblox Studio tools",
    "Luau AI assistant",
    "terminal coding assistant",
    "open source AI coding",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Stud",
    title: "Stud - AI Coding Assistant for Roblox",
    description:
      "Open-source AI coding assistant with deep Roblox Studio integration. Edit Luau scripts, manipulate instances, and ship updates faster.",
    images: [
      {
        url: "/assets/stud-docs-waitlist-social.png",
        width: 1200,
        height: 826,
        alt: "Stud homepage preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stud - AI Coding Assistant for Roblox",
    description:
      "Open-source AI coding assistant with deep Roblox Studio integration. Edit Luau scripts, manipulate instances, and ship updates faster.",
    images: ["/assets/stud-docs-waitlist-social.png"],
  },
  icons: {
    icon: [{ url: "/assets/app_icon.png" }],
    shortcut: [{ url: "/assets/app_icon.png" }],
    apple: [{ url: "/assets/app_icon.png" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#1a1817",
          colorText: "#1a1817",
          colorTextSecondary: "#79716b",
          colorBackground: "#ffffff",
          colorInputBackground: "#ffffff",
          colorInputText: "#1a1817",
          borderRadius: "0.5rem",
          fontFamily: "'Geist Pixel', 'Geist', system-ui, sans-serif",
        },
        elements: {
          card: {
            boxShadow: "0 8px 30px rgba(26, 24, 23, 0.12)",
            border: "1px solid #e7e5e4",
            borderRadius: "0.75rem",
          },
          formButtonPrimary: {
            background: "linear-gradient(180deg, rgba(70, 65, 60, 0.98) 0%, rgba(43, 40, 37, 0.98) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 -1px 0 rgba(0, 0, 0, 0.35), 0 8px 18px rgba(19, 17, 16, 0.26)",
            borderRadius: "0.375rem",
            fontFamily: "'Geist Pixel', 'Geist', system-ui, sans-serif",
            fontWeight: "500",
            transition: "filter 140ms ease, transform 140ms ease",
          },
          formFieldInput: {
            borderColor: "#e7e5e4",
            borderRadius: "0.375rem",
            fontFamily: "'Geist Pixel', 'Geist', system-ui, sans-serif",
          },
          headerTitle: {
            fontFamily: "'Kalice', Georgia, 'Times New Roman', serif",
            fontWeight: "600",
            color: "#1a1817",
          },
          headerSubtitle: {
            color: "#79716b",
            fontFamily: "'Geist Pixel', 'Geist', system-ui, sans-serif",
          },
          footerActionLink: {
            color: "#1a1817",
            fontWeight: "500",
          },
        },
      }}
    >
      <html lang="en">
        <body className="antialiased" suppressHydrationWarning>
          {children}
          <Clarity />
          <Toaster position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  )
}
