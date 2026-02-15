"use client";

import { useLanguage } from '@/context/LanguageContext';
import styles from './ArticleViewer.module.css';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function ArticleViewer({ article }) {
    const { language } = useLanguage();
    const bodyRef = useRef(null);

    // Helper to get localized content with fallback
    const getLocalized = (obj) => {
        if (!obj) return '';
        if (obj[language]) return obj[language];
        if (obj['en']) return obj['en'];
        return Object.values(obj)[0] || '';
    };

    const title = getLocalized(article.title);
    const contentHtml = getLocalized(article.contentHtml);
    const category = getLocalized(article.category);
    const author = getLocalized(article.author);

    useEffect(() => {
        if (!bodyRef.current) return;

        // IntersectionObserver를 사용하여 테이블이 실제로 화면에 렌더링되었을 때 스크롤 실행
        const observer = new MutationObserver(() => {
            const tables = bodyRef.current.querySelectorAll('table[id^="earnings-table-"]');
            tables.forEach(table => {
                if (typeof window.scrollToToday === 'function') {
                    // DOM이 완전히 업데이트될 시간을 확보하기 위해 약간의 지연 후 실행
                    setTimeout(() => window.scrollToToday(table.id), 100);
                }
            });
        });

        observer.observe(bodyRef.current, { childList: true, subtree: true });

        // 초기 수동 트리거
        const initialTables = bodyRef.current.querySelectorAll('table[id^="earnings-table-"]');
        initialTables.forEach(table => {
            if (typeof window.scrollToToday === 'function') {
                setTimeout(() => window.scrollToToday(table.id), 500);
            }
        });

        return () => observer.disconnect();
    }, [contentHtml]);

    return (
        <>
            <header className={styles.header}>
                <div className="container">
                    <Link href={`/${language}/tag/${String(category).toLowerCase()}`} className={styles.categoryBack}>
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
                                <Link key={tag} href={`/${language}/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`} className={styles.tag}>
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </header>
            <div className={`container ${styles.contentContainer}`}>
                {article.image && <img src={article.image} alt={title} className={styles.image} referrerPolicy="no-referrer" />}

                <div className={styles.body} ref={bodyRef}>
                    <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                </div>
            </div>
        </>
    );
}
