"use client";

import { useState } from 'react';
import NewsCard from '../NewsCard/NewsCard';
import styles from './NewsGrid.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function NewsGrid({ articles, title, lang }) {
    const { t, language } = useLanguage();
    const [visibleCount, setVisibleCount] = useState(9); // Show 9 initially

    // Use server-provided lang for links (SSR-safe), fall back to client context
    const effectiveLang = lang || language;

    // Translate title if it matches the default English string
    const displayTitle = title === 'Latest Investment News' ? t('newsGrid.title') : title;

    const showMore = () => {
        setVisibleCount(prev => prev + 9);
    };

    const visibleArticles = articles.slice(0, visibleCount);
    const hasMore = visibleCount < articles.length;

    return (
        <section className={styles.section}>
            <div className={`container ${styles.container}`}>
                {displayTitle && <h2 className={styles.heading}>{displayTitle}</h2>}
                <div className={styles.grid}>
                    {visibleArticles.map((article) => (
                        <NewsCard key={article.id} article={article} lang={effectiveLang} />
                    ))}
                </div>

                {hasMore && (
                    <div className={styles.buttonWrapper}>
                        <button
                            className={styles.loadMoreButton}
                            onClick={showMore}
                        >
                            {t('newsGrid.loadMore') || 'Show More Articles'}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
