import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata = {
  title: 'Market Drip | Smart Investing News',
  description: 'Fresh financial insights, brewed daily. Market Drip covers stocks, ETFs, crypto, and AI-driven investing.',
  metadataBase: new URL('https://market-drip.com'),
  sitemap: 'https://market-drip.com/sitemap.xml',
  verification: {
    google: 'AjNvBqhwP21VeE8Ce7dHtzyvRmlMW0UijhyJx1sOY5M',
  },
};

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3649579475017357"
          crossorigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
