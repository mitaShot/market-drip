
import styles from './about.module.css';
import { translations } from '@/lib/translations';

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const t = translations[lang]?.about || translations['en']?.about;
    const baseUrl = 'https://market-drip.com';

    return {
        title: `${t.title} | Market Drip`,
        description: t.tagline,
        alternates: {
            canonical: `${baseUrl}/${lang}/about`,
            languages: {
                'en': `${baseUrl}/en/about`,
                'ko': `${baseUrl}/ko/about`,
                'ja': `${baseUrl}/ja/about`,
                'x-default': `${baseUrl}/en/about`,
            },
        },
    };
}

export default async function AboutPage({ params }) {
    const { lang } = await params;
    const t = translations[lang]?.about || translations['en']?.about;

    return (
        <main className={styles.aboutMain}>
            <div className="container">
                {/* Hero Section */}
                <header className={styles.heroSection}>
                    <h1 className={styles.title}>{t.title}</h1>
                    <p className={styles.tagline}>{t.tagline}</p>
                </header>

                {/* Who We Are */}
                <section className={styles.glassCard}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionIcon}>🔍</div>
                        <h2 className={styles.sectionTitle}>{t.who.title}</h2>
                    </div>
                    <div className={styles.content}>
                        <p dangerouslySetInnerHTML={{ __html: t.who.content1.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        <p>{t.who.content2}</p>
                    </div>
                </section>

                {/* Methodology */}
                <section className={styles.glassCard}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionIcon}>⚙️</div>
                        <h2 className={styles.sectionTitle}>{t.methodology.title}</h2>
                    </div>
                    <div className={styles.content}>
                        <p dangerouslySetInnerHTML={{ __html: t.methodology.intro.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />

                        <div className={styles.methodologyGrid}>
                            <div className={styles.methodStep}>
                                <span className={styles.stepNumber}>Step 01</span>
                                <h3 className={styles.stepTitle}>{t.methodology.step1.title}</h3>
                                <p className={styles.stepContent}>{t.methodology.step1.content}</p>
                            </div>
                            <div className={styles.methodStep}>
                                <span className={styles.stepNumber}>Step 02</span>
                                <h3 className={styles.stepTitle}>{t.methodology.step2.title}</h3>
                                <p className={styles.stepContent}>{t.methodology.step2.content}</p>
                            </div>
                            <div className={styles.methodStep}>
                                <span className={styles.stepNumber}>Step 03</span>
                                <h3 className={styles.stepTitle}>{t.methodology.step3.title}</h3>
                                <p className={styles.stepContent}>{t.methodology.step3.content}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Editor Profile */}
                <section className={styles.glassCard}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionIcon}>✍️</div>
                        <h2 className={styles.sectionTitle}>{t.editor.title}</h2>
                    </div>
                    <div className={styles.editorFlex}>
                        <div className={styles.editorImagePlaceholder}>☕</div>
                        <div className={styles.editorInfo}>
                            <h3 className={styles.editorName}>{t.editor.name}</h3>
                            <p className={styles.editorBio}>{t.editor.bio}</p>
                            <div className={styles.editorBadges}>
                                <span className={styles.badge}>U.S. Tech Stocks</span>
                                <span className={styles.badge}>Quantitative Analysis</span>
                                <span className={styles.badge}>Macro Trends</span>
                            </div>
                            <div className={styles.philosophy}>
                                {t.editor.philosophy}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Ethics */}
                <section className={styles.glassCard}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionIcon}>⚖️</div>
                        <h2 className={styles.sectionTitle}>{t.ethics.title}</h2>
                    </div>
                    <div className={styles.content}>
                        <p dangerouslySetInnerHTML={{ __html: t.ethics.intro.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        <ul className={styles.ethicsList}>
                            <li className={styles.ethicsItem}>
                                <span className={styles.checkIcon}>✓</span>
                                <span>{t.ethics.factcheck}</span>
                            </li>
                            <li className={styles.ethicsItem}>
                                <span className={styles.checkIcon}>✓</span>
                                <span>{t.ethics.nohype}</span>
                            </li>
                            <li className={styles.ethicsItem}>
                                <span className={styles.checkIcon}>✓</span>
                                <span>{t.ethics.correction}</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Contact Footer */}
                <div className={styles.contactBar}>
                    <div className={styles.contactItem}>
                        <span>✉️ Email:</span>
                        <a href={`mailto:${t.contact.email}`} className={styles.contactLink}>
                            {t.contact.email}
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
