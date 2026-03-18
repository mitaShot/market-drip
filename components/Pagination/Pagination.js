import Link from 'next/link';
import styles from './Pagination.module.css';

export default function Pagination({ totalPages, currentPage, lang, basePath = '' }) {
    if (totalPages <= 1) return null;

    const pages = [];
    // Simple logic: show all pages for now as the count isn't massive
    // If it gets very large, we can add ellipsis (...)
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    const getPageLink = (page) => {
        if (page === 1) return `/${lang}${basePath}`;
        return `/${lang}${basePath}/page/${page}`;
    };

    return (
        <nav className={styles.pagination} aria-label="Pagination">
            {currentPage > 1 && (
                <Link href={getPageLink(currentPage - 1)} className={styles.arrow} aria-label="Previous page">
                    &larr;
                </Link>
            )}

            <div className={styles.pages}>
                {pages.map(page => (
                    <Link
                        key={page}
                        href={getPageLink(page)}
                        className={`${styles.pageNumber} ${page === currentPage ? styles.active : ''}`}
                        aria-current={page === currentPage ? 'page' : undefined}
                    >
                        {page}
                    </Link>
                ))}
            </div>

            {currentPage < totalPages && (
                <Link href={getPageLink(currentPage + 1)} className={styles.arrow} aria-label="Next page">
                    &rarr;
                </Link>
            )}
        </nav>
    );
}
