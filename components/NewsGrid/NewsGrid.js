import NewsCard from '../NewsCard/NewsCard';
import styles from './NewsGrid.module.css';

export default function NewsGrid({ articles, title }) {
    return (
        <section className={styles.section}>
            <div className={`container ${styles.container}`}>
                {title && <h2 className={styles.heading}>{title}</h2>}
                <div className={styles.grid}>
                    {articles.map((article) => (
                        <NewsCard key={article.id} article={article} />
                    ))}
                </div>
            </div>
        </section>
    );
}
