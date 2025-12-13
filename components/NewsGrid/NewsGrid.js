
"use client";

import NewsCard from '../NewsCard/NewsCard';
import styles from './NewsGrid.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function NewsGrid({ articles, title }) {
    const { t } = useLanguage();

    // Translate title if it matches the default English string
    const displayTitle = title === 'Latest Investment News' ? t('newsGrid.title') : title;

    return (
        <section className={styles.section}>
            <div className={`container ${styles.container}`}>
                {displayTitle && <h2 className={styles.heading}>{displayTitle}</h2>}
                <div className={styles.grid}>
                    {articles.map((article) => (
                        <NewsCard key={article.id} article={article} />
                    ))}
                </div>
            </div>
        </section>
    );
}
