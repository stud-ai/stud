import ContextSection from "../components/sections/ContextSection"
import HeroSection from "../components/sections/HeroSection"
import HeroPanel from "../components/sections/HeroPanel"
import HighlightsSection from "../components/sections/HighlightsSection"
import MemorySection from "../components/sections/MemorySection"
import QASection from "../components/sections/QASection"
import SecuritySection from "../components/sections/SecuritySection"
import SiteFooter from "../components/sections/SiteFooter"
import SupportSection from "../components/sections/SupportSection"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Full-screen dark hero with Unicorn Studio */}
      <HeroSection />

      {/* Content sections with light background */}
      <div className="bg-secondary flex-1">
        <main>
          {/* Transition section */}
          <div className="mx-auto w-full max-w-7xl px-6 pt-24 pb-8">
            <HeroPanel />
          </div>
          <div className="px-6">
            <SupportSection />
            <QASection />
          </div>
          <MemorySection />
          <SecuritySection />
          <div className="px-6">
            <ContextSection />
          </div>
          <HighlightsSection />
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}
