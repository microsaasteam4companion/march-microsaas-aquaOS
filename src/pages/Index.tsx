import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PricingSection from "@/components/PricingSection";
import FAQsSection from "@/components/FAQsSection";
import FooterSection from "@/components/FooterSection";
import UpvoteWidget from "@/components/UpvoteWidget";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#pricing") {
      setTimeout(() => {
        document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <PricingSection />
      <FAQsSection />
      <FooterSection />
      <UpvoteWidget />
    </div>
  );
};

export default Index;
