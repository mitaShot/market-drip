import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Market Drip | Smart Investing News',
  description: 'Fresh financial insights, brewed daily. Market Drip is your go-to source for stocks, dividends, and retirement planning.',
  metadataBase: new URL('https://market-drip.pages.dev'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
