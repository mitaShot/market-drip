"use client";

import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
    const { t } = useLanguage();

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
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '800' }}>{t('contact.title')}</h1>
                        <p style={{ color: '#666', fontSize: '1.2rem', lineHeight: '1.6' }}>{t('contact.subtitle')}</p>
                    </header>

                    <div style={{ marginBottom: '3rem' }}>
                        <p style={{ color: '#444', fontSize: '1.1rem', marginBottom: '2rem', textAlign: 'center' }}>
                            {t('contact.description')}
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
                                {t('contact.emailLabel')}
                            </span>
                            <a
                                href={`mailto:${t('contact.emailValue')}`}
                                style={{
                                    fontSize: '1.5rem',
                                    color: 'var(--color-primary)',
                                    textDecoration: 'none',
                                    fontWeight: '700',
                                    padding: '0.5rem 1rem',
                                    borderBottom: '2px solid transparent',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.borderBottom = '2px solid var(--color-primary)'}
                                onMouseOut={(e) => e.currentTarget.style.borderBottom = '2px solid transparent'}
                            >
                                {t('contact.emailValue')}
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
