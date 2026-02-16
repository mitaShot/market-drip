"use client";

import { useLanguage } from '@/context/LanguageContext';
import styles from './about.module.css';

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <main className={styles.aboutMain}>
            <div className="container">
                {/* Hero Section */}
                <header className={styles.heroSection}>
                    <h1 className={styles.title}>{t('about.title')}</h1>
                    <p className={styles.tagline}>{t('about.tagline')}</p>
                </header>

                {/* Who We Are */}
                <section className={styles.glassCard}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionIcon}>🔍</div>
                        <h2 className={styles.sectionTitle}>{t('about.who.title')}</h2>
                    </div>
                    <div className={styles.content}>
                        <p dangerouslySetInnerHTML={{ __html: t('about.who.content1').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        <p>{t('about.who.content2')}</p>
                    </div>
                </section>

                {/* Methodology */}
                <section className={styles.glassCard}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionIcon}>⚙️</div>
                        <h2 className={styles.sectionTitle}>{t('about.methodology.title')}</h2>
                    </div>
                    <div className={styles.content}>
                        <p dangerouslySetInnerHTML={{ __html: t('about.methodology.intro').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />

                        <div className={styles.methodologyGrid}>
                            <div className={styles.methodStep}>
                                <span className={styles.stepNumber}>Step 01</span>
                                <h3 className={styles.stepTitle}>{t('about.methodology.step1.title')}</h3>
                                <p className={styles.stepContent}>{t('about.methodology.step1.content')}</p>
                            </div>
                            <div className={styles.methodStep}>
                                <span className={styles.stepNumber}>Step 02</span>
                                <h3 className={styles.stepTitle}>{t('about.methodology.step2.title')}</h3>
                                <p className={styles.stepContent}>{t('about.methodology.step2.content')}</p>
                            </div>
                            <div className={styles.methodStep}>
                                <span className={styles.stepNumber}>Step 03</span>
                                <h3 className={styles.stepTitle}>{t('about.methodology.step3.title')}</h3>
                                <p className={styles.stepContent}>{t('about.methodology.step3.content')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Editor Profile */}
                <section className={styles.glassCard}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionIcon}>✍️</div>
                        <h2 className={styles.sectionTitle}>{t('about.editor.title')}</h2>
                    </div>
                    <div className={styles.editorFlex}>
                        <div className={styles.editorImagePlaceholder}>☕</div>
                        <div className={styles.editorInfo}>
                            <h3 className={styles.editorName}>{t('about.editor.name')}</h3>
                            <p className={styles.editorBio}>{t('about.editor.bio')}</p>
                            <div className={styles.editorBadges}>
                                <span className={styles.badge}>U.S. Tech Stocks</span>
                                <span className={styles.badge}>Quantitative Analysis</span>
                                <span className={styles.badge}>Macro Trends</span>
                            </div>
                            <div className={styles.philosophy}>
                                {t('about.editor.philosophy')}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Ethics */}
                <section className={styles.glassCard}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionIcon}>⚖️</div>
                        <h2 className={styles.sectionTitle}>{t('about.ethics.title')}</h2>
                    </div>
                    <div className={styles.content}>
                        <p dangerouslySetInnerHTML={{ __html: t('about.ethics.intro').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        <ul className={styles.ethicsList}>
                            <li className={styles.ethicsItem}>
                                <span className={styles.checkIcon}>✓</span>
                                <span>{t('about.ethics.factcheck')}</span>
                            </li>
                            <li className={styles.ethicsItem}>
                                <span className={styles.checkIcon}>✓</span>
                                <span>{t('about.ethics.nohype')}</span>
                            </li>
                            <li className={styles.ethicsItem}>
                                <span className={styles.checkIcon}>✓</span>
                                <span>{t('about.ethics.correction')}</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Contact Footer */}
                <div className={styles.contactBar}>
                    <div className={styles.contactItem}>
                        <span>✉️ Email:</span>
                        <a href={`mailto:${t('about.contact.email')}`} className={styles.contactLink}>
                            {t('about.contact.email')}
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
