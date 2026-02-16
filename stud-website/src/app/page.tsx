import type { Metadata } from "next"
import HomeScroll from "../components/HomeScroll"
import ContextSection from "../components/sections/ContextSection"
import FeaturesSection from "../components/sections/FeaturesSection"
import HeroSection from "../components/sections/HeroSection"
import HeroPanel from "../components/sections/HeroPanel"
import HighlightsSection from "../components/sections/HighlightsSection"
import MemorySection from "../components/sections/MemorySection"
import QASection from "../components/sections/QASection"
import SecuritySection from "../components/sections/SecuritySection"
import SiteFooter from "../components/sections/SiteFooter"
import SupportSection from "../components/sections/SupportSection"

export const metadata: Metadata = {
  title: "AI Coding Assistant for Roblox",
  description:
    "Open-source AI coding assistant with deep Roblox Studio integration. Edit Luau scripts, manipulate instances, query DataStores, and search the Toolbox from your terminal.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
    title: "Stud - AI Coding Assistant for Roblox",
    description:
      "Open-source AI coding assistant with deep Roblox Studio integration. Edit Luau scripts, manipulate instances, query DataStores, and search the Toolbox from your terminal.",
    images: [
      {
        url: "/assets/stud-docs-waitlist-social-v2.png",
        width: 1200,
        height: 630,
        alt: "Stud homepage preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stud - AI Coding Assistant for Roblox",
    description:
      "Open-source AI coding assistant with deep Roblox Studio integration. Edit Luau scripts, manipulate instances, query DataStores, and search the Toolbox from your terminal.",
    images: ["/assets/stud-docs-waitlist-social-v2.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Stud",
      url: "https://trystud.me",
      inLanguage: "en-US",
      description: "Open-source AI coding assistant with deep Roblox Studio integration.",
    },
    {
      "@type": "Organization",
      name: "Stud",
      url: "https://trystud.me",
      logo: "https://trystud.me/assets/logo_transparent_bg.png",
      sameAs: ["https://github.com/stud-ai/stud"],
    },
    {
      "@type": "SoftwareApplication",
      name: "Stud",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "macOS, Windows, Linux",
      isAccessibleForFree: true,
      description:
        "Open-source AI coding assistant with deep Roblox Studio integration. Edit Luau scripts, manipulate instances, query DataStores, and search the Toolbox from your terminal.",
      url: "https://trystud.me",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "27+ Roblox Studio tools",
        "Luau script editing",
        "Instance manipulation",
        "DataStore queries",
        "Toolbox search",
        "File read/write/edit",
        "Glob and Grep search",
        "Bash execution",
        "Subagent delegation",
        "Granular permissions",
      ],
    },
  ],
}

export default function HomePage() {
  return (
    <div className="home-shell flex h-screen flex-col">
      <HomeScroll />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Full-screen dark hero with Unicorn Studio */}
      <HeroSection />

      {/* Content sections with light background */}
      <div className="bg-secondary flex-1">
        <main>
          {/* Transition section */}
          <FeaturesSection />
          <div className="mx-auto w-full max-w-7xl px-6 pt-24 pb-8">
            <HeroPanel />
          </div>
          <SupportSection />
          <QASection />
          <MemorySection />
          <ContextSection />
          <SecuritySection />
          <HighlightsSection />
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}
