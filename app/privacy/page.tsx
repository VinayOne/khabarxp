import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getNavCategories } from "@/lib/wp";
import { SITE } from "@/lib/types";

export const revalidate = 3600; // 1 hour — policy pages are essentially static

export const metadata: Metadata = {
  title: "गोपनीयता नीति",
  description:
    "खबर एक्सपी की गोपनीयता नीति — हम आपकी कौन-सी जानकारी एकत्र करते हैं, कैसे उपयोग करते हैं, और आपके अधिकार।",
  alternates: { canonical: `${SITE.url}/privacy` },
  robots: { index: true, follow: true },
};

export default async function PrivacyPage() {
  const navCategories = await getNavCategories().catch(() => []);
  return (
    <>
      <Header categories={navCategories} />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--foreground)] border-l-4 border-[var(--brand)] pl-3 mb-2">
            गोपनीयता नीति
          </h1>
          <p className="text-sm text-[var(--muted)] mb-6">
            अंतिम अद्यतन: 15 जून 2026
          </p>

          <p>
            <strong>खबर एक्सपी</strong> (Khabar Xpress){" "}
            <a href={SITE.url} className="text-[var(--brand)] hover:underline">
              {SITE.url}
            </a>{" "}
            पर आपका स्वागत है। यह गोपनीयता नीति बताती है कि हम आपकी कौन-सी
            जानकारी एकत्र करते हैं, कैसे उपयोग करते हैं, और आपके अधिकार क्या हैं।
            हमारी साइट का उपयोग करके आप इस नीति से सहमत हैं।
          </p>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-3 border-b border-[var(--border)] pb-2">
            1. हम कौन-सी जानकारी एकत्र करते हैं
          </h2>
          <p>
            हम दो प्रकार की जानकारी एकत्र करते हैं — स्वचालित रूप से (जब आप
            हमारी साइट देखते हैं) और सीधे (जब आप टिप्पणी करते हैं)।
          </p>

          <h3 className="text-xl font-semibold text-[var(--foreground)] mt-6 mb-2">
            स्वचालित रूप से एकत्र जानकारी
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>लॉग डेटा:</strong> IP पता, ब्राउज़र प्रकार, ऑपरेटिंग
              सिस्टम, रेफ़रल URL, देखे गए पृष्ठ, और यात्रा का समय।
            </li>
            <li>
              <strong>कुकीज़ (Cookies):</strong> पसंदीदा थीम, सत्र की जानकारी,
              और विज्ञापन भागीदारों द्वारा उपयोग किए जाने वाले कुकीज़।
            </li>
            <li>
              <strong>विश्लेषण (Analytics):</strong> Google Analytics 4 (GA4)
              द्वारा एकत्र किए गए अनाम उपयोग आँकड़े।
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-[var(--foreground)] mt-6 mb-2">
            सीधे प्रदान जानकारी
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>टिप्पणी (Comments):</strong> जब आप कोई टिप्पणी पोस्ट करते
              हैं, तो आपका नाम, ईमेल पता (सार्वजनिक नहीं), और टिप्पणी सामग्री
              सहेजी जाती है।
            </li>
            <li>
              <strong>संचार:</strong> यदि आप हमसे संपर्क पृष्ठ के माध्यम से
              संदेश भेजते हैं, तो आपका संदेश और संपर्क जानकारी सहेजी जाती है।
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-3 border-b border-[var(--border)] pb-2">
            2. हम आपकी जानकारी का उपयोग कैसे करते हैं
          </h2>
          <p>हम एकत्रित जानकारी का उपयोग इन उद्देश्यों के लिए करते हैं:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>समाचार सामग्री और उपयोगकर्ता अनुभव को बेहतर बनाना</li>
            <li>
              टिप्पणी मॉडरेशन, स्पैम रोकथाम, और साइट सुरक्षा सुनिश्चित करना
            </li>
            <li>
              Google AdSense के माध्यम से प्रासंगिक विज्ञापन दिखाना (केवल
              अनुमोदन के बाद)
            </li>
            <li>
              कानूनी दायित्वों का पालन और किसी भी कानूनी विवाद में सहायता करना
            </li>
          </ul>
          <p className="mt-3">
            <strong>हम आपकी जानकारी कभी नहीं बेचते हैं।</strong>
          </p>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-3 border-b border-[var(--border)] pb-2">
            3. कुकीज़ (Cookies) का उपयोग
          </h2>
          <p>
            हमारी साइट निम्न प्रकार की कुकीज़ का उपयोग करती है:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>आवश्यक कुकीज़:</strong> थीम पसंद (लाइट/डार्क), सत्र की
              जानकारी। इन्हें बंद नहीं किया जा सकता।
            </li>
            <li>
              <strong>विश्लेषण कुकीज़:</strong> Google Analytics 4 — अनाम
              उपयोग आँकड़े एकत्र करने के लिए।
            </li>
            <li>
              <strong>विज्ञापन कुकीज़:</strong> Google AdSense — केवल तब
              सक्रिय होती हैं जब AdSense स्वीकृत हो। आप{" "}
              <a
                href="https://www.google.com/settings/ads"
                rel="nofollow noopener"
                className="text-[var(--brand)] hover:underline"
              >
                Google Ads Settings
              </a>{" "}
              पर जाकर व्यक्तिगत विज्ञापन बंद कर सकते हैं।
            </li>
          </ul>
          <p className="mt-3">
            आप अपने ब्राउज़र की सेटिंग्स से सभी गैर-आवश्यक कुकीज़ बंद कर सकते
            हैं, लेकिन इससे साइट का अनुभव प्रभावित हो सकता है।
          </p>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-3 border-b border-[var(--border)] pb-2">
            4. तृतीय-पक्ष सेवाएँ (Third-Party Services)
          </h2>
          <p>
            हम अपनी सामग्री और सेवाएँ प्रदान करने के लिए निम्न विश्वसनीय
            तृतीय-पक्ष सेवाओं का उपयोग करते हैं:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Cloudflare</strong> — CDN, DDoS सुरक्षा, SSL प्रबंधन।
            </li>
            <li>
              <strong>Google Analytics 4</strong> — अनाम उपयोग विश्लेषण।
            </li>
            <li>
              <strong>Google AdSense</strong> — विज्ञापन (केवल अनुमोदन के बाद)।
            </li>
            <li>
              <strong>WordPress.com (Gravatar)</strong> — टिप्पणी लेखक की
              प्रोफ़ाइल छवि।
            </li>
            <li>
              <strong>YouTube / Twitter / अन्य एम्बेड</strong> — जब हम कोई वीडियो
              या सोशल मीडिया पोस्ट एम्बेड करते हैं।
            </li>
          </ul>
          <p className="mt-3">
            इन सेवाओं की अपनी गोपनीयता नीतियाँ हैं। हम उनके द्वारा एकत्र
            जानकारी के लिए उत्तरदायी नहीं हैं।
          </p>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-3 border-b border-[var(--border)] pb-2">
            5. डेटा सुरक्षा
          </h2>
          <p>
            हम आपकी जानकारी की सुरक्षा के लिए उचित तकनीकी और संगठनात्मक
            उपाय करते हैं, जिनमें शामिल हैं:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>HTTPS / TLS एन्क्रिप्शन (Cloudflare के माध्यम से)</li>
            <li>सुरक्षित सर्वर (Linux, नियमित सुरक्षा अद्यतन)</li>
            <li>स्पैम टिप्पणियों के लिए स्वचालित फ़िल्टर</li>
            <li>कड़े पासवर्ड नीतियाँ और दो-कारक प्रमाणीकरण (व्यवस्थापक)</li>
          </ul>
          <p className="mt-3">
            फिर भी, कोई भी ऑनलाइन प्रणाली 100% सुरक्षित नहीं है। आप अपनी
            जानकारी साझा करने का जोखिम स्वयं वहन करते हैं।
          </p>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-3 border-b border-[var(--border)] pb-2">
            6. बच्चों की गोपनीयता (COPPA)
          </h2>
          <p>
            हमारी साइट 13 वर्ष से कम आयु के बच्चों के लिए नहीं है। हम जानबूझकर
            बच्चों से व्यक्तिगत जानकारी एकत्र नहीं करते। यदि आपको लगता है कि
            किसी बच्चे ने हमें जानकारी दी है, तो कृपया हमसे संपर्क करें ताकि
            हम उसे हटा सकें।
          </p>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-3 border-b border-[var(--border)] pb-2">
            7. आपके अधिकार
          </h2>
          <p>आपके पास ये अधिकार हैं:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>पहुँच का अधिकार:</strong> आप हमसे पूछ सकते हैं कि हमारे
              पास आपकी कौन-सी जानकारी है।
            </li>
            <li>
              <strong>सुधार का अधिकार:</strong> गलत जानकारी को सुधारने का
              अनुरोध कर सकते हैं।
            </li>
            <li>
              <strong>विलोपन का अधिकार:</strong> अपनी जानकारी हटाने का अनुरोध
              कर सकते हैं (कानूनी अनिवार्यता के अधीन)।
            </li>
            <li>
              <strong>आपत्ति का अधिकार:</strong> किसी भी प्रसंस्करण पर आपत्ति
              कर सकते हैं।
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-3 border-b border-[var(--border)] pb-2">
            8. इस नीति में परिवर्तन
          </h2>
          <p>
            हम समय-समय पर इस गोपनीयता नीति को अद्यतन कर सकते हैं। महत्वपूर्ण
            परिवर्तन होने पर हम इस पृष्ठ पर सूचना देंगे और अद्यतन तिथि बदलेंगे।
            नियमित रूप से इस पृष्ठ की समीक्षा करें।
          </p>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-3 border-b border-[var(--border)] pb-2">
            9. संपर्क करें
          </h2>
          <p>
            इस गोपनीयता नीति के बारे में कोई प्रश्न या चिंता हो, तो कृपया हमसे
            संपर्क करें:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              ईमेल:{" "}
              <a
                href="mailto:hello@khabarxp.in"
                className="text-[var(--brand)] hover:underline"
              >
                hello@khabarxp.in
              </a>
            </li>
            <li>
              संपर्क पृष्ठ:{" "}
              <a
                href="/contact"
                className="text-[var(--brand)] hover:underline"
              >
                khabarxp.in/contact
              </a>
            </li>
          </ul>

          <p className="mt-10 pt-6 border-t border-[var(--border)] text-sm text-[var(--muted)]">
            © {new Date().getFullYear()} {SITE.name} ({SITE.nameEn}) — सर्वाधिकार
            सुरक्षित।
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
