import AnnouncementBar from "../components/sections/AnnouncementBar";
import ContextSection from "../components/sections/ContextSection";
import HeroIntro from "../components/sections/HeroIntro";
import HeroPanel from "../components/sections/HeroPanel";
import HighlightsSection from "../components/sections/HighlightsSection";
import MemorySection from "../components/sections/MemorySection";
import QASection from "../components/sections/QASection";
import SecuritySection from "../components/sections/SecuritySection";
import SiteFooter from "../components/sections/SiteFooter";
import SiteHeader from "../components/sections/SiteHeader";
import SupportSection from "../components/sections/SupportSection";

export default function HomePage() {
  return (
    <div className="bg-secondary flex min-h-screen flex-col">
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1">
        <HeroIntro />
        <HeroPanel />
        <SupportSection />
        <QASection />
        <MemorySection />
        <SecuritySection />
        <ContextSection />
        <HighlightsSection />
      </main>
      <SiteFooter />
    </div>
  );
}
