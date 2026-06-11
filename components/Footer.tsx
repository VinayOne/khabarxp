import Link from "next/link";
import { SITE, CATEGORIES } from "@/lib/types";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-red-600 mb-2">
              {SITE.name}
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              {SITE.description}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 mb-3 text-sm uppercase tracking-wider">
              श्रेणियाँ
            </h4>
            <ul className="space-y-1.5 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="text-zinc-600 hover:text-red-600"
                  >
                    {c.emoji} {c.hindi}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 mb-3 text-sm uppercase tracking-wider">
              और जानें
            </h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link href="/about" className="text-zinc-600 hover:text-red-600">
                  हमारे बारे में
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-600 hover:text-red-600">
                  संपर्क करें
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-zinc-600 hover:text-red-600">
                  अस्वीकरण
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-zinc-600 hover:text-red-600">
                  गोपनीयता नीति
                </Link>
              </li>
              <li>
                <Link href="/rss.xml" className="text-zinc-600 hover:text-red-600">
                  RSS फीड
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 mb-3 text-sm uppercase tracking-wider">
              फॉलो करें
            </h4>
            <p className="text-sm text-zinc-600">
              ताज़ा खबरों के लिए जुड़ें रहें।
            </p>
            <p className="text-xs text-zinc-500 mt-2">
              सोशल मीडिया जल्द आ रहा है।
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-200 text-xs text-zinc-500 flex flex-col sm:flex-row justify-between gap-2">
          <p>
            © {new Date().getFullYear()} {SITE.name} ({SITE.nameEn}). सर्वाधिकार सुरक्षित।
          </p>
          <p>
            स्रोत: <Link href="https://wordpress.org" className="hover:text-red-600" rel="nofollow">WordPress</Link> + <Link href="https://nextjs.org" className="hover:text-red-600" rel="nofollow">Next.js</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
