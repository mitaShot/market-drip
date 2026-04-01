
import { translations } from '@/lib/translations';

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const t = translations[lang]?.terms || translations['en']?.terms;
    const baseUrl = 'https://market-drip.com';

    return {
        title: `${t.title} | Market Drip`,
        alternates: {
            canonical: `${baseUrl}/${lang}/terms`,
            languages: {
                'en': `${baseUrl}/en/terms`,
                'ko': `${baseUrl}/ko/terms`,
                'ja': `${baseUrl}/ja/terms`,
                'x-default': `${baseUrl}/en/terms`,
            },
        },
    };
}

export default async function TermsPage({ params }) {
    const { lang } = await params;
    const t = translations[lang]?.terms || translations['en']?.terms;

    return (
        <main style={{ padding: '4rem 0', minHeight: '80vh' }}>
            <div className="container">
                <header style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '800' }}>{t.title}</h1>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>{t.lastUpdated}</p>
                </header>

                <section
                    className="content-area"
                    dangerouslySetInnerHTML={{ __html: t.content }}
                    style={{
                        lineHeight: '1.8',
                        fontSize: '1.1rem',
                        color: '#333'
                    }}
                />

                <style>{`
                    .content-area h3 {
                        font-size: 1.5rem;
                        margin-top: 2.5rem;
                        margin-bottom: 1rem;
                        color: #111;
                        font-weight: 700;
                    }
                    .content-area p {
                        margin-bottom: 1.5rem;
                    }
                `}</style>
            </div>
        </main>
    );
}
