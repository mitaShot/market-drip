
import { translations } from '@/lib/translations';

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const t = translations[lang]?.contact || translations['en']?.contact;
    const baseUrl = 'https://market-drip.com';

    return {
        title: `${t.title} | Market Drip`,
        description: t.description,
        alternates: {
            canonical: `${baseUrl}/${lang}/contact`,
            languages: {
                'en': `${baseUrl}/en/contact`,
                'ko': `${baseUrl}/ko/contact`,
                'ja': `${baseUrl}/ja/contact`,
                'x-default': `${baseUrl}/en/contact`,
            },
        },
    };
}

export default async function ContactPage({ params }) {
    const { lang } = await params;
    const t = translations[lang]?.contact || translations['en']?.contact;

    return (
        <main style={{ padding: '6rem 0', minHeight: '80vh', backgroundColor: '#fafafa' }}>
            <div className="container">
                <div style={{
                    maxWidth: '700px',
                    margin: '0 auto',
                    backgroundColor: '#fff',
                    padding: '3rem',
                    borderRadius: '1.5rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                }}>
                    <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '800' }}>{t.title}</h1>
                        <p style={{ color: '#666', fontSize: '1.2rem', lineHeight: '1.6' }}>{t.subtitle}</p>
                    </header>

                    <div style={{ marginBottom: '3rem' }}>
                        <p style={{ color: '#444', fontSize: '1.1rem', marginBottom: '2rem', textAlign: 'center' }}>
                            {t.description}
                        </p>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '2rem',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '1rem'
                        }}>
                            <span style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                                {t.emailLabel}
                            </span>
                            <a
                                href={`mailto:${t.emailValue}`}
                                style={{
                                    fontSize: '1.5rem',
                                    color: 'var(--color-primary)',
                                    textDecoration: 'none',
                                    fontWeight: '700',
                                    padding: '0.5rem 1rem',
                                    borderBottom: '2px solid transparent',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {t.emailValue}
                            </a>
                        </div>
                    </div>

                    <footer style={{ textAlign: 'center', color: '#999', fontSize: '0.9rem' }}>
                        <p>We typically respond within 24-48 business hours.</p>
                    </footer>
                </div>
            </div>
        </main>
    );
}
