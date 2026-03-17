
"use client";

import Link from 'next/link';
import styles from './NewsCard.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function NewsCard({ article, lang }) {
    const { language } = useLanguage();

    // lang prop (from server) takes priority over client-side context
    // This ensures the link href is correct in server-rendered HTML for Googlebot
    const effectiveLang = lang || language;

    const getLocalized = (obj) => {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        if (obj[effectiveLang]) return obj[effectiveLang];
        if (obj['en']) return obj['en'];
        return Object.values(obj)[0] || '';
    };

    const title = getLocalized(article.title);
    const excerpt = getLocalized(article.excerpt);
    const category = getLocalized(article.category);
    const author = getLocalized(article.author);

    return (
        <Link href={`/${effectiveLang}/article/${article.id}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={article.image} alt={title} className={styles.image} />
            </div>
            <div className={styles.content}>
                <span className={styles.category}>{category}</span>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.excerpt}>{excerpt}</p>
                <div className={styles.meta}>
                    <span className={styles.author}>{author}</span>
                    <span className={styles.date}>{article.date}</span>
                </div>
            </div>
        </Link>
    );
}
