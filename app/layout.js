import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Shinobi New Era",
  description: "RPG Visual Novel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-[#0a0a0f] text-white antialiased">
        {/* Свечение сверху */}
        <div className="pointer-events-none fixed inset-x-0 top-0 h-[500px] bg-gradient-to-b from-red-600/10 via-transparent to-transparent" />

        <Navbar />

        {/* Отступ под фикс-навбар */}
        <main className="relative pt-16">{children}</main>

        <Footer />
      </body>
    </html>
  );
}