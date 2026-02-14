
"use client";

import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function Hero() {
    const { language, t } = useLanguage();

    const categories = [];

    return (
        <section className={styles.hero}>
            <div className={styles.bgWrap}>
                <Image
                    alt="Market Drip Background"
                    src="/hero-bg.webp"
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
                {categories.length > 0 && (
                    <div className={styles.chips}>
                        {categories.map((cat) => (
                            <Link key={cat.path} href={cat.path} className={styles.chip}>
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
