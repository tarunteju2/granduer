import Navbar from "@/components/ui/ModernMorphingNav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import BentoServices from "@/components/BentoServices";
import Process from "@/components/Process";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Gallery from "@/components/Gallery";
import FAQ from "@/components/FAQ";
import Resources from "@/components/Resources";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import TrustBadges from "@/components/TrustBadges";
import StatsCounter from "@/components/StatsCounter";
import EnterpriseProof from "@/components/EnterpriseProof";
import StaffCalculator from "@/components/StaffCalculator";
import StaffRequestForm from "@/components/StaffRequestForm";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import FloatingContact from "@/components/FloatingContact";
import LiveChat from "@/components/LiveChat";
import JobApplicationPortal from "@/components/JobApplicationPortal";
import ReferralCTA from "@/components/ReferralCTA";
import GoogleReviews from "@/components/GoogleReviews";
import { SilkBackground } from "@/components/ui/silk-background";
import { AetherParticles } from "@/components/ui/aether-particles";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { usePageTransitions } from "@/hooks/usePageTransitions";
import { MagneticCursor } from "@/components/ui/magnetic-cursor";

export default function App() {
  useSmoothScroll();
  usePageTransitions();

  return (
    <MagneticCursor
      magneticFactor={0.35}
      cursorSize={20}
      cursorColor="#f1bba6"
      blendMode="exclusion"
    >
      <div className="silk-site-shell relative isolate min-h-screen overflow-x-hidden bg-transparent">
      <SilkBackground />
      <AetherParticles />
      <div className="relative z-10">
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-lg focus:bg-gold-400 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>
      <Preloader />
      <ScrollProgress />
      <Navbar />
      <main id="main-content" className="w-full max-w-full overflow-x-hidden">
        <Hero />
        <TrustBadges />
        <About />
        <StatsCounter />
        <EnterpriseProof />
        <Services />
        <BentoServices />
        <StaffCalculator />
        <Process />
        <GoogleReviews />
        <Clients />
        <Gallery />
        <FAQ />
        <Resources />
        <ServiceAreaMap />
        <StaffRequestForm />
        <JobApplicationPortal />
        <ReferralCTA />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <FloatingContact />
      <LiveChat />
      </div>
      </div>
    </MagneticCursor>
  );
}
