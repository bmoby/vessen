import type { Metadata } from "next";
import Header from "@/components/navbar/Header";
import ContactCta from "@/components/sections/ContactCta";
import Footer from "@/components/footer/Footer";
import ContactContent from "@/components/sections/ContactContent";

export const metadata: Metadata = {
  title: "Контакты | VESSEN",
  description:
    "Свяжитесь с нами по телефону, в WhatsApp, Telegram или Instagram.",
};

export default function ContactPage() {
  return (
    <main>
      <Header />
      <ContactCta />
      <ContactContent />
      <Footer />
    </main>
  );
}
