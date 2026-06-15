import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { getNavCategories } from "@/lib/wp";
import { SITE } from "@/lib/types";

export const revalidate = 3600; // 1 hour — static-ish, form is client-side

export const metadata: Metadata = {
  title: "संपर्क करें",
  description:
    "खबर एक्सपी से संपर्क करें — सुझाव, सहयोग, या शिकायत के लिए हमें लिखें। हम जल्द से जल्द आपको जवाब देंगे।",
  alternates: { canonical: `${SITE.url}/contact` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "खबर एक्सपी से संपर्क करें",
    description: "सुझाव, सहयोग, या शिकायत — हमसे संपर्क करें।",
    url: `${SITE.url}/contact`,
    type: "website",
  },
};

export default async function ContactPage() {
  const navCategories = await getNavCategories().catch(() => []);
  return (
    <>
      <Header categories={navCategories} />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--foreground)] border-l-4 border-[var(--brand)] pl-3 mb-2">
            संपर्क करें
          </h1>
          <p className="text-base text-[var(--muted-fg)] leading-relaxed">
            सुझाव, सहयोग, या शिकायत — नीचे दिया गया फ़ॉर्म भरें। हम आपके संदेश
            को गंभीरता से लेते हैं और जल्द से जल्द जवाब देने का प्रयास करते
            हैं।
          </p>
        </header>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-sm">
          <ContactForm />
        </div>

        <section className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <div className="text-2xl mb-1">📨</div>
            <h3 className="font-semibold text-[var(--foreground)] mb-1">
              ईमेल
            </h3>
            <a
              href="mailto:info@vinayone.com"
              className="text-[var(--brand)] hover:underline break-all"
            >
              info@vinayone.com
            </a>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <div className="text-2xl mb-1">⏱️</div>
            <h3 className="font-semibold text-[var(--foreground)] mb-1">
              जवाब का समय
            </h3>
            <p className="text-[var(--muted-fg)]">
              आमतौर पर 24-48 घंटे।
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <div className="text-2xl mb-1">🌐</div>
            <h3 className="font-semibold text-[var(--foreground)] mb-1">
              भाषा
            </h3>
            <p className="text-[var(--muted-fg)]">
              हिन्दी या English — दोनों स्वीकार्य।
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
