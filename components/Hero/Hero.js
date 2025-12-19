
"use client";

import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function Hero() {
    const { t } = useLanguage();

    const categories = [
        { name: t('categories.Stocks'), path: '/tag/stocks' },
        { name: t('categories.Dividends'), path: '/tag/dividends' },
        { name: t('categories.Banking'), path: '/tag/banking' },
        { name: t('categories.Crypto'), path: '/tag/crypto' },
    ];

    return (
        <section className={styles.hero}>
            <div className={styles.bgWrap}>
                <Image
                    alt="Market Drip Background"
                    src="/hero-bg.png"
                    fill
                    priority
                    sizes="100vw"
                    style={{ objectFit: "cover" }}
                />
            </div>
            <div className={`container ${styles.container}`}>
                <h1 className={styles.title}>{t('hero.title')}</h1>
                <p className={styles.subtitle}>
                    {t('hero.subtitle')}
                </p>
                <div className={styles.chips}>
                    {categories.map((cat) => (
                        <Link key={cat.path} href={cat.path} className={styles.chip}>
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
