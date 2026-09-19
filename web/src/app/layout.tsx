import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { ConsentBanner } from "@/components/ConsentBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { MobileBar } from "@/components/MobileBar";
import { site } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz", "SOFT"] });
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Become a Dental Assistant in Colorado | DentalAssistantCO",
    template: "%s | DentalAssistantCO",
  },
  description:
    "Compare Colorado dental assistant programs, costs, requirements and salaries, and find dental assistant jobs. A free, independent guide.",
  openGraph: { siteName: site.name, type: "website", locale: "en_US" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${figtree.variable} pb-16 md:pb-0`}>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${site.url}/#org`,
                name: site.name,
                url: site.url,
                telephone: "+1-512-766-6445",
                areaServed: "Colorado",
              },
              {
                "@type": "WebSite",
                "@id": `${site.url}/#website`,
                name: site.name,
                url: site.url,
                publisher: { "@id": `${site.url}/#org` },
              },
            ],
          }}
        />
        <AnalyticsProvider />
        <Header />
        <main>{children}</main>
        <Footer />
        <MobileBar />
        <ConsentBanner />
      </body>
    </html>
  );
}
