
"use client";

import Link from 'next/link';
import styles from './Header.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
    const { t } = useLanguage();

    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    Market<span style={{ color: 'var(--color-primary-dark)' }}>Drip</span>
                </Link>
                <nav className={styles.nav}>
                    <Link href="/category/stocks" className={styles.link}>{t('header.stocks')}</Link>
                    <Link href="/category/etf" className={styles.link}>{t('header.etf')}</Link>
                    <Link href="/category/crypto" className={styles.link}>{t('header.crypto')}</Link>
                    <Link href="/category/ai" className={styles.link}>{t('header.ai')}</Link>
                </nav>

            </div>
        </header>
    );
}
