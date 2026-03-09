import { Inter } from "next/font/google";
import "../../globals.css";
import Script from "next/script";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export async function generateStaticParams() {
    return [
        { lang: 'en' },
        { lang: 'ko' },
        { lang: 'ja' },
    ];
}

export const metadata = {
  title: 'Market Drip | Smart Investing News',
  description: 'Fresh financial insights, brewed daily. Market Drip covers stocks, ETFs, crypto, and AI-driven investing.',
  metadataBase: new URL('https://market-drip.com'),
  sitemap: 'https://market-drip.com/sitemap.xml',
  verification: {
    google: 'AjNvBqhwP21VeE8Ce7dHtzyvRmlMW0UijhyJx1sOY5M',
  },
};

export default async function LangLayout({ children, params }) {
    const { lang } = await params;

    return (
        <html lang={lang}>
            <body className={inter.className}>
                <LanguageProvider initialLang={lang}>
                    <link
                        rel="alternate"
                        type="application/rss+xml"
                        href={`/rss-${lang}.xml`}
                        title={`Market Drip RSS (${lang.toUpperCase()})`}
                    />
                    <Script
                        async
                        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3649579475017357"
                        crossOrigin="anonymous"
                        strategy="afterInteractive"
                    />
                    {/* Google tag (gtag.js) */}
                    <Script
                        async
                        src="https://www.googletagmanager.com/gtag/js?id=G-F9BBX408T6"
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
        
                            gtag('config', 'G-F9BBX408T6');
                        `}
                    </Script>
                    <Script src="/scripts/table-sort.js" strategy="afterInteractive" />
                    <Header />
                    {children}
                    <Footer />
                </LanguageProvider>
            </body>
        </html>
    );
}
