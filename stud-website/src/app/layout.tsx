import type { Metadata } from "next"
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
        url: "/assets/redwoods-2.png",
        width: 1200,
        height: 630,
        alt: "Stud interface preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stud - AI Coding Assistant for Roblox",
    description:
      "Open-source AI coding assistant with deep Roblox Studio integration. Edit Luau scripts, manipulate instances, and ship updates faster.",
    images: ["/assets/redwoods-2.png"],
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
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
