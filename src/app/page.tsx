import IntroOverlay from "@/components/shared/IntroOverlay";
import Header from "@/components/navbar/Header";
import Hero from "@/components/hero/Hero";
import Strengths from "@/components/sections/Strengths";
import BrandStory from "@/components/sections/BrandStory";
import OffersPreview from "@/components/sections/OffersPreview";
import ContactCta from "@/components/sections/ContactCta";
import Footer from "@/components/footer/Footer";

export default function HomePage() {
  return (
    <main>
      <IntroOverlay text="VESSEN" />

      <Header variant="over-hero" />
      <Hero />
      <OffersPreview />
      <Strengths />
      <BrandStory />
      <ContactCta />
      <Footer />
    </main>
  );
}
