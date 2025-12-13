import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Market Drip | Smart Investing News',
  description: 'Fresh financial insights, brewed daily. Market Drip covers stocks, ETFs, crypto, and AI-driven investing.',
  metadataBase: new URL('https://market-drip.pages.dev'),
  verification: {
    google: 'AjNvBqhwP21VeE8Ce7dHtzyvRmlMW0UijhyJx1sOY5M',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
