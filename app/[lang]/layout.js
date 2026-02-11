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
        <LanguageProvider initialLang={lang}>
            <head>
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
            </head>
            <Header />
            {children}
            <Footer />
        </LanguageProvider>
    );
}
