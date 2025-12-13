"use client";

import { useLanguage } from '@/context/LanguageContext';
import styles from '@/app/article/[id]/page.module.css'; // We'll reuse page styles or create new ones
import Link from 'next/link';

export default function ArticleViewer({ article }) {
    const { language, setLanguage } = useLanguage();

    // Helper to get localized content with fallback
    const getLocalized = (obj) => {
        if (!obj) return '';
        // 1. Try current language
        if (obj[language]) return obj[language];
        // 2. Try 'en'
        if (obj['en']) return obj['en'];
        // 3. Take first available
        return Object.values(obj)[0] || '';
    };

    const title = getLocalized(article.title);
    const contentHtml = getLocalized(article.contentHtml);
    const category = getLocalized(article.category);
    const author = getLocalized(article.author);
    const excerpt = getLocalized(article.excerpt);

    // If current language content is missing, show a warning or fallback?
    // For now silent fallback.

    return (
        <>
            <header className={styles.header}>
                <div className="container">
                    <Link href={`/category/${String(category).toLowerCase()}`} className={styles.categoryBack}>
                        &larr; Back to {category}
                    </Link>
                    <h1 className={styles.title}>{title}</h1>
                    <div className={styles.meta}>
                        <span className={styles.author}>By {author}</span>
                        <span className={styles.date}>{article.date}</span>
                    </div>
                    {article.tags && article.tags.length > 0 && (
                        <div className={styles.tags}>
                            {article.tags.map(tag => (
                                <Link key={tag} href={`/tag/${tag.toLowerCase()}`} className={styles.tag}>
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </header>
            <div className={`container ${styles.contentContainer}`}>
                {article.image && <img src={article.image} alt={title} className={styles.image} />}
                <div className={styles.body}>
                    <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                </div>
            </div>
            {/* Optional: Language switcher for the article specifically if not provided globally */}
        </>
    );
}
