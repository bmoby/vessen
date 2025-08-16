import IntroOverlay from "@/components/shared/IntroOverlay";
import Header from "@/components/navbar/Header";
import Hero from "@/components/hero/Hero";
import Strengths from "@/components/sections/Strengths";
import ContactCta from "@/components/sections/ContactCta";
import Footer from "@/components/footer/Footer";
import PageAssemble from "@/components/shared/PageAssemble";

export default function HomePage() {
  return (
    <main>
      <IntroOverlay text="VESSEN" />

      <Header />
      <Hero />
      <Strengths />
      <ContactCta />
      <Footer />
    </main>
  );
}
