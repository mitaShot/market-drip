"use client";

import { useLanguage } from '@/context/LanguageContext';
import styles from './ArticleViewer.module.css';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function ArticleViewer({ article, relatedPosts = [] }) {
    const { language, t } = useLanguage();
    const bodyRef = useRef(null);

    // Helper to get localized content with fallback
    const getLocalized = (obj) => {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        if (obj[language]) return obj[language];
        if (obj['en']) return obj['en'];
        return Object.values(obj)[0] || '';
    };

    const title = getLocalized(article.title);
    const contentHtml = getLocalized(article.contentHtml);
    const category = getLocalized(article.category);
    const author = getLocalized(article.author);
    const excerpt = getLocalized(article.excerpt);

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

    useEffect(() => {
        if (bodyRef.current) {
            const externalLinks = bodyRef.current.querySelectorAll('a[href^="http"]');
            externalLinks.forEach(link => {
                link.setAttribute('rel', 'nofollow');
                link.setAttribute('target', '_blank');
            });
        }
    }, [contentHtml]);

    return (
        <article className={styles.article}>
            <header className={styles.header}>
                <div className="container">
                    <Link href={`/${language}/category/${String(category).toLowerCase()}`} className={styles.categoryBack}>
                        &larr; Back to {category}
                    </Link>
                    <h1 className={styles.title}>{title}</h1>
                    <div className={styles.meta}>
                        <span className={styles.author}>By {author}</span>
                        <time className={styles.date} dateTime={article.date}>{article.date}</time>
                    </div>
                    {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
                    {article.tags && article.tags.length > 0 && (
                        <nav className={styles.tags} aria-label="Article tags">
                            {article.tags.map(tag => (
                                <Link key={tag} href={`/${language}/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`} className={styles.tag}>
                                    #{tag}
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>
            </header>

            <div className={`container ${styles.contentContainer}`}>
                {article.image && (
                    <figure className={styles.featuredImage}>
                        <img src={article.image} alt={title} className={styles.image} referrerPolicy="no-referrer" />
                    </figure>
                )}

                <div className={styles.body} ref={bodyRef}>
                    <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                </div>

                {relatedPosts && relatedPosts.length > 0 && (
                    <aside className={styles.relatedPosts} aria-labelledby="related-articles-title">
                        <h3 id="related-articles-title">{t('post.related_articles') || (language === 'ko' ? '관련 기사' : language === 'ja' ? '関連記事' : 'Related Articles')}</h3>
                        <ul>
                            {relatedPosts.map(post => {
                                const postTitle = getLocalized(post.title);
                                return (
                                    <li key={post.id}>
                                        <Link href={`/${language}/article/${post.id}`}>
                                            {postTitle}
                                        </Link>
                                        <time className={styles.relatedDate} dateTime={post.date}>{post.date}</time>
                                    </li>
                                );
                            })}
                        </ul>
                    </aside>
                )}

                <footer className={styles.disclaimer}>
                    <p>{t('footer.disclaimer')}</p>
                </footer>
            </div>
        </article>
    );
}
