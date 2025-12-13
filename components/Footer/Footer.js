
"use client";

import styles from './Footer.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();
    return (
        <footer className={styles.footer}>
            <div className="container">
                <p>&copy; {new Date().getFullYear()} Market Drip. {t('footer.rights')}</p>
                <p className={styles.disclaimer}>
                    {t('footer.disclaimer')}
                </p>
            </div>
        </footer>
    );
}
