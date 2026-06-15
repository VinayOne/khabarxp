import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getNavCategories } from "@/lib/wp";
import { SITE } from "@/lib/types";

export const revalidate = 3600; // 1 hour — disclaimer pages are essentially static

export const metadata: Metadata = {
  title: "अस्वीकरण",
  description:
    "खबर एक्सपी का अस्वीकरण — सामग्री की सटीकता, स्रोत श्रेय, विज्ञापन, और कानूनी सीमाएँ।",
  alternates: { canonical: `${SITE.url}/disclaimer` },
  robots: { index: true, follow: true },
};

export default async function DisclaimerPage() {
  const navCategories = await getNavCategories().catch(() => []);
  return (
    <>
      <Header categories={navCategories} />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--foreground)] border-l-4 border-[var(--brand)] pl-3 mb-2">
            अस्वीकरण
          </h1>
          <p className="text-sm text-[var(--muted)] mb-6">
            अंतिम अद्यतन: 15 जून 2026
          </p>

          <p>
            <strong>खबर एक्सपी</strong> (Khabar Xpress){" "}
            <a href={SITE.url} className="text-[var(--brand)] hover:underline">
              {SITE.url}
            </a>{" "}
            पर उपलब्ध सभी जानकारी सामान्य सूचना उद्देश्यों के लिए प्रदान की
            जाती है। इस साइट का उपयोग करके आप निम्नलिखित नियमों और शर्तों से
            सहमत होते हैं।
          </p>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-3 border-b border-[var(--border)] pb-2">
            1. सामग्री की प्रकृति — समाचार एग्रीगेटर
          </h2>
          <p>
            <strong>
              खबर एक्सपी एक स्वचालित समाचार एग्रीगेटर (news aggregator) है।
            </strong>{" "}
            हमारी अधिकांश सामग्री विभिन्न प्रतिष्ठित समाचार स्रोतों — जैसे
            समाचार एजेंसियों, अखबारों, टीवी चैनलों, और ऑनलाइन समाचार पोर्टलों
            — से RSS फीड और API के माध्यम से स्वचालित रूप से एकत्र की जाती है।
          </p>
          <p className="mt-3">
            हम मूल समाचार लेखकों और प्रकाशकों का पूरा श्रेय देते हैं। प्रत्येक
            लेख के शीर्षक और स्रोत पर क्लिक करके आप मूल लेखक के पास पहुँच
            सकते हैं। हम किसी भी मूल सामग्री के स्वामित्व का दावा नहीं करते।
          </p>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-3 border-b border-[var(--border)] pb-2">
            2. सटीकता और विश्वसनीयता
          </h2>
          <p>
            हम सामग्री को सटीक, अद्यतन और उपयोगी रखने का पूरा प्रयास करते हैं,
            फिर भी हम <strong>किसी भी प्रकार की कोई गारंटी नहीं देते</strong> —
            व्यक्त या निहित — कि:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>साइट पर उपलब्ध जानकारी हमेशा सटीक, पूर्ण या विश्वसनीय होगी</li>
            <li>
              साइट हमेशा अनबाधित, त्रुटि-मुक्त, या वायरस-मुक्त रहेगी
            </li>
            <li>
              किसी भी त्रुटि या चूक को सुधारने के परिणामस्वरूप कोई नुकसान नहीं
              होगा
            </li>
          </ul>
          <p className="mt-3">
            किसी भी महत्वपूर्ण निर्णय (वित्तीय, चिकित्सा, कानूनी, आदि) के लिए
            कृपया मूल स्रोत या योग्य विशेषज्ञ से परामर्श लें।
          </p>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-3 border-b border-[var(--border)] pb-2">
            3. राय और बयान
          </h2>
          <p>
            हमारी साइट पर प्रकाशित लेखों में व्यक्त राय, टिप्पणियाँ, और
            विश्लेषण संबंधित लेखक या प्रकाशक के हैं —{" "}
            <strong>खबर एक्सपी का नहीं</strong>। हम किसी भी तृतीय-पक्ष की राय
            या बयान की पुष्टि या समर्थन नहीं करते।
          </p>
          <p className="mt-3">
            हमारी साइट पर पोस्ट की गई टिप्पणियाँ केवल टिप्पणी करने वाले की
            अपनी राय हैं। हम टिप्पणियों की सटीकता, वैधता, या उपयुक्तता की
            ज़िम्मेदारी नहीं लेते।
          </p>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-3 border-b border-[var(--border)] pb-2">
            4. कॉपीराइट और बौद्धिक संपदा
          </h2>
          <p>
            हमारी साइट पर प्रदर्शित सामग्री उनके संबंधित स्वामियों की
            बौद्धिक संपदा है। हम सामग्री को <em>fair use</em> के तहत —
            समाचार रिपोर्टिंग, समीक्षा, और शिक्षा के उद्देश्य से — प्रदर्शित
            करते हैं, पूर्ण पुनःप्रकाशन नहीं करते।
          </p>
          <p className="mt-3">
            यदि आप एक मूल सामग्री के स्वामी हैं और आप चाहते हैं कि हम आपकी
            सामग्री हटा दें, तो कृपया हमसे तुरंत संपर्क करें — हम 24-48 घंटों
            के भीतर सामग्री हटा देंगे।
          </p>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-3 border-b border-[var(--border)] pb-2">
            5. बाहरी लिंक
          </h2>
          <p>
            हमारी साइट अन्य वेबसाइटों के लिंक प्रदान कर सकती है। ये लिंक
            सुविधा के लिए हैं, और हम बाहरी साइटों की सामग्री, नीतियों, या
            प्रथाओं के लिए ज़िम्मेदार नहीं हैं। बाहरी साइट पर जाने पर आप उस
            साइट की नियम और शर्तों से बंधे होते हैं।
          </p>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-3 border-b border-[var(--border)] pb-2">
            6. विज्ञापन (AdSense)
          </h2>
          <p>
            हमारी साइट पर Google AdSense के माध्यम से विज्ञापन दिखाए जा सकते
            हैं (अनुमोदन मिलने के बाद)। तृतीय-पक्ष विज्ञापनदाता कुकीज़ का
            उपयोग कर सकते हैं ताकि आपको प्रासंगिक विज्ञापन दिखाए जा सकें।
            आप{" "}
            <a
              href="https://www.google.com/settings/ads"
              rel="nofollow noopener"
              className="text-[var(--brand)] hover:underline"
            >
              Google Ads Settings
            </a>{" "}
            पर जाकर व्यक्तिगत विज्ञापन बंद कर सकते हैं।
          </p>
          <p className="mt-3">
            विज्ञापनदाताओं की सामग्री और दावों के लिए हम उत्तरदायी नहीं हैं।
            किसी भी उत्पाद या सेवा के लिए सीधे विज्ञापनदाता से संपर्क करें।
          </p>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-3 border-b border-[var(--border)] pb-2">
            7. कानूनी सीमा
          </h2>
          <p>
            भारतीय कानूनों के अनुसार, इस अस्वीकरण में निहित कोई भी प्रावधान जो
            किसी भी पक्ष के कानूनी अधिकारों को सीमित करता है, वह उस सीमा तक
            ही मान्य होगा जहाँ तक वह कानूनी रूप से अनुमत है। यदि इस अस्वीकरण
            का कोई भाग अमान्य या अप्रवर्तनीय पाया जाता है, तो शेष भाग
            प्रभावी रहेंगे।
          </p>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-3 border-b border-[var(--border)] pb-2">
            8. इस अस्वीकरण में परिवर्तन
          </h2>
          <p>
            हम इस अस्वीकरण को समय-समय पर अद्यतन कर सकते हैं। परिवर्तन होने पर
            "अंतिम अद्यतन" तिथि बदल दी जाएगी। नियमित रूप से इस पृष्ठ की
            समीक्षा करें।
          </p>

          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-3 border-b border-[var(--border)] pb-2">
            9. संपर्क करें
          </h2>
          <p>
            इस अस्वीकरण या हमारी सामग्री के बारे में कोई प्रश्न हो, तो
            कृपया संपर्क करें:
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
