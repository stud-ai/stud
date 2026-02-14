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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Stud",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS, Windows, Linux",
  description:
    "Open-source AI coding assistant with deep Roblox Studio integration. Edit Luau scripts, manipulate instances, query DataStores, and search the Toolbox from your terminal.",
  url: "https://stud.dev",
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
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Full-screen dark hero with Unicorn Studio */}
      <HeroSection />

      {/* Content sections with light background */}
      <div className="bg-secondary flex-1">
        <main>
          {/* Transition section */}
          <div className="mx-auto w-full max-w-7xl px-6 pt-24 pb-8">
            <HeroPanel />
          </div>
          <FeaturesSection />
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
