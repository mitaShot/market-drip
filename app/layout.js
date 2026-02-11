import { Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
