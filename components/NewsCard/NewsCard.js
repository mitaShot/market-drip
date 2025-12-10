import Link from 'next/link';
import styles from './NewsCard.module.css';

export default function NewsCard({ article }) {
    return (
        <Link href={`/article/${article.id}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={article.image} alt={article.title} className={styles.image} />
            </div>
            <div className={styles.content}>
                <span className={styles.category}>{article.category}</span>
                <h3 className={styles.title}>{article.title}</h3>
                <p className={styles.excerpt}>{article.excerpt}</p>
                <div className={styles.meta}>
                    <span className={styles.author}>{article.author}</span>
                    <span className={styles.date}>{article.date}</span>
                </div>
            </div>
        </Link>
    );
}
