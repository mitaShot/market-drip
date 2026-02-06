import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

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
            <Header />
            {children}
            <Footer />
        </LanguageProvider>
    );
}
