import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getNavCategories } from "@/lib/wp";

export default async function NotFound() {
  const navCategories = await getNavCategories().catch(() => []);
  return (
    <>
      <Header categories={navCategories} />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-6xl font-black text-red-600">404</h1>
        <p className="text-xl text-zinc-700 mt-4">पृष्ठ नहीं मिला</p>
        <p className="text-sm text-zinc-500 mt-2">
          जो खबर आप ढूँढ रहे हैं वह यहाँ नहीं है — शायद हटा दी गई है।
        </p>
        <a
          href="/"
          className="inline-block mt-6 px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          होम पर वापस जाएँ
        </a>
      </main>
      <Footer />
    </>
  );
}
