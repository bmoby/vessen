import type { Metadata } from "next";
import Header from "@/components/navbar/Header";
import ContactCta from "@/components/sections/ContactCta";
import Footer from "@/components/footer/Footer";
import MapWithLoader from "@/components/shared/MapWithLoader";

export const metadata: Metadata = {
  title: "Контакты | VESSEN",
  description:
    "Свяжитесь с нами по телефону, в WhatsApp, Telegram или Instagram.",
};

export default function ContactPage() {
  const ADDRESS =
    process.env.NEXT_PUBLIC_COMPANY_ADDRESS ||
    "Укажите адрес в переменной NEXT_PUBLIC_COMPANY_ADDRESS";
  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    ADDRESS
  )}`;
  return (
    <main>
      <Header />
      <section>
        <div style={{ padding: "0 0 24px 0" }}>
          <MapWithLoader
            iframeSrc="https://yandex.com/map-widget/v1/?um=constructor%3A29953f022e91445bc095df8eff48e9a22d47652fd6b5a9fc29cf61a48c53275c&source=constructor"
            height={500}
            mapSearchUrl={mapSearchUrl}
            title="Расположение VESSEN"
          />
        </div>
      </section>
      <section>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px 24px",
          }}
        >
          <h2
            style={{ margin: 0, fontFamily: "var(--font-playfair, serif)" }}
          ></h2>
          <address style={{ marginTop: 8, fontStyle: "normal" }}>
            <a
              href={mapSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Открыть адрес в браузере"
              style={{ textDecoration: "underline", color: "inherit" }}
            >
              {ADDRESS}
            </a>
          </address>
        </div>
      </section>
      <ContactCta />
      <Footer />
    </main>
  );
}
