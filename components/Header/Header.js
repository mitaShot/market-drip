"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Header.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
    const { language, t } = useLanguage();
    const pathname = usePathname();
    const router = useRouter();

    const switchLanguage = (newLang) => {
        // Pathname starts with /en, /ko, /ja or it's the root redirector?
        // Lang-based layouts always have pathname starting with /[lang]
        const segments = pathname.split('/');
        segments[1] = newLang; // Replace the lang segment
        const newPath = segments.join('/');
        router.push(newPath);
    };

    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <Link href={`/${language}`} className={styles.logo}>
                    Market<span style={{ color: 'var(--color-primary-dark)' }}>Drip</span>
                </Link>
                <nav className={styles.nav}>
                    <Link href={`/${language}/tag/stocks`} className={styles.link}>{t('header.stocks')}</Link>
                    <Link href={`/${language}/tag/etf`} className={styles.link}>{t('header.etf')}</Link>
                    <Link href={`/${language}/tag/crypto`} className={styles.link}>{t('header.crypto')}</Link>
                    <Link href={`/${language}/tag/ai`} className={styles.link}>{t('header.ai')}</Link>
                </nav>

                <div className={styles.langSwitcher}>
                    <button
                        onClick={() => switchLanguage('en')}
                        className={`${styles.langBtn} ${language === 'en' ? styles.activeLang : ''}`}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => switchLanguage('ko')}
                        className={`${styles.langBtn} ${language === 'ko' ? styles.activeLang : ''}`}
                    >
                        KO
                    </button>
                    <button
                        onClick={() => switchLanguage('ja')}
                        className={`${styles.langBtn} ${language === 'ja' ? styles.activeLang : ''}`}
                    >
                        JA
                    </button>
                </div>
            </div>
        </header>
    );
}
