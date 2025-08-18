import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Playfair_Display,
  Marck_Script,
} from "next/font/google";
import "./globals.css";
import ScrollProgress from "@/components/shared/ScrollProgress";
import PageGate from "@/components/shared/PageGate";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const marck = Marck_Script({
  variable: "--font-script",
  subsets: ["latin", "cyrillic"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "VESSEN — бренд посуды и товаров для дома",
    template: "%s | VESSEN",
  },
  description:
    "VESSEN — современный бренд посуды и товаров для дома: сервизы, техника, посуда для приготовления, стекло, столовые приборы и декор. Качество, эстетика и надёжное B2B‑партнёрство.",
  openGraph: {
    type: "website",
    siteName: "VESSEN",
    title: "VESSEN — бренд посуды и товаров для дома",
    description:
      "Современный бренд посуды и товаров для дома. Качество, эстетика и надёжное B2B‑партнёрство.",
    images: [
      {
        url: "/homepageimg5.png",
        alt: "VESSEN — бренд посуды и товаров для дома",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VESSEN — бренд посуды и товаров для дома",
    description:
      "Современный бренд посуды и товаров для дома. Качество, эстетика и надёжное B2B‑партнёрство.",
    images: ["/homepageimg5.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${marck.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ScrollProgress />
        <PageGate
          criticalSelectors={["img[data-critical]"]}
          minWaitMs={300}
          maxWaitMs={6000}
        >
          {children}
        </PageGate>
      </body>
    </html>
  );
}
