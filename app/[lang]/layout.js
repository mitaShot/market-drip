import { Inter } from "next/font/google";
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

export default async function LangLayout({ children, params }) {
    const { lang } = await params;

    return (
        <html lang={lang}>
            <head>
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3649579475017357"
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
            </head>
            <body className={inter.className}>
                <LanguageProvider initialLang={lang}>
                    <Header />
                    {children}
                    <Footer />
                </LanguageProvider>
            </body>
        </html>
    );
}
