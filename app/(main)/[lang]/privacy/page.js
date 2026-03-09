"use client";

import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPage() {
    const { t } = useLanguage();

    return (
        <main style={{ padding: '4rem 0', minHeight: '80vh' }}>
            <div className="container">
                <header style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '800' }}>{t('privacy.title')}</h1>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>{t('privacy.lastUpdated')}</p>
                </header>

                <section
                    className="content-area"
                    dangerouslySetInnerHTML={{ __html: t('privacy.content') }}
                    style={{
                        lineHeight: '1.8',
                        fontSize: '1.1rem',
                        color: '#333'
                    }}
                />

                <style jsx>{`
                    .content-area :global(h3) {
                        font-size: 1.5rem;
                        margin-top: 2.5rem;
                        margin-bottom: 1rem;
                        color: #111;
                        font-weight: 700;
                    }
                    .content-area :global(p) {
                        margin-bottom: 1.5rem;
                    }
                `}</style>
            </div>
        </main>
    );
}
