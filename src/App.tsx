import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Gallery from "@/components/Gallery";
import FAQ from "@/components/FAQ";
import Resources from "@/components/Resources";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import ScrollProgress from "@/components/ScrollProgress";
import AnnouncementBar from "@/components/AnnouncementBar";
import BackToTop from "@/components/BackToTop";
import TrustBadges from "@/components/TrustBadges";
import StatsCounter from "@/components/StatsCounter";
import EnterpriseProof from "@/components/EnterpriseProof";
import Pricing from "@/components/Pricing";
import StaffCalculator from "@/components/StaffCalculator";
import StaffRequestForm from "@/components/StaffRequestForm";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import EmergencyStaffingCTA from "@/components/EmergencyStaffingCTA";
import FloatingContact from "@/components/FloatingContact";
import LiveChat from "@/components/LiveChat";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import JobApplicationPortal from "@/components/JobApplicationPortal";
import ReferralCTA from "@/components/ReferralCTA";
import GoogleReviews from "@/components/GoogleReviews";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { usePageTransitions } from "@/hooks/usePageTransitions";

export default function App() {
  useSmoothScroll();
  usePageTransitions();

  return (
    <>
      <Preloader />
      <ScrollProgress />
      <AnnouncementBar />
      <Navbar />
      <main className="w-full max-w-full overflow-x-hidden">
        <Hero />
        <TrustBadges />
        <About />
        <StatsCounter />
        <EnterpriseProof />
        <Services />
        <Pricing />
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
      <EmergencyStaffingCTA />
      <FloatingContact />
      <LiveChat />
      <ExitIntentPopup />
    </>
  );
}
