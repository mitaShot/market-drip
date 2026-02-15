
"use client";

import styles from './Footer.module.css';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
    const { t, language } = useLanguage();
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.links}>
                    <Link href={`/${language}/privacy`}>{t('footer.links.privacy')}</Link>
                    <Link href={`/${language}/terms`}>{t('footer.links.terms')}</Link>
                    <Link href={`/${language}/contact`}>{t('footer.links.contact')}</Link>
                </div>
                <p>&copy; {new Date().getFullYear()} Market Drip. {t('footer.rights')}</p>
                <p className={styles.disclaimer}>
                    {t('footer.disclaimer')}
                </p>
            </div>
        </footer>
    );
}
