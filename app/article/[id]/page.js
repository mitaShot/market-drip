import { getAllPostIds, getPostData } from '@/lib/posts';
import styles from './page.module.css';
import Link from 'next/link';

export async function generateStaticParams() {
    const paths = getAllPostIds();
    return paths.map((path) => path.params);
}

export async function generateMetadata({ params }) {
    // In Next.js 15+ params is a promise
    const { id } = await params;
    const article = await getPostData(id);

    if (!article) {
        return {
            title: 'Article Not Found',
        }
    }

    return {
        title: `${article.title} | Market Drip`,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            images: [
                {
                    url: article.image,
                    width: 800,
                    height: 600,
                    alt: article.title,
                }
            ],
            type: 'article',
            publishedTime: article.date,
            authors: [article.author],
            tags: article.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt,
            images: [article.image],
        },
    }
}

export default async function ArticlePage({ params }) {
    // In Next.js 15+ (if using that), params might be a promise, but for now assuming standard 14 behavior or unwrapping.
    const { id } = await params;
    console.log('Fetching article id:', id);
    const article = await getPostData(id);
    console.log('Article fetched:', article ? article.title : 'Not found');
    console.log('Content HTML length:', article?.contentHtml?.length);
    console.log('Content HTML snippet:', article?.contentHtml?.substring(0, 100));

    if (!article) {
        return <div className="container">Article not found</div>;
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.title,
        image: [article.image],
        datePublished: article.date,
        dateModified: article.date,
        author: [{
            '@type': 'Person',
            name: article.author,
            url: `https://your-domain.com/author/${article.author.replace(' ', '-').toLowerCase()}` // Optional: link to author page
        }],
        description: article.excerpt,
    };

    return (
        <article className={styles.article}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <header className={styles.header}>
                <div className="container">
                    <Link href={`/category/${article.category.toLowerCase()}`} className={styles.categoryBack}>
                        &larr; Back to {article.category}
                    </Link>
                    <h1 className={styles.title}>{article.title}</h1>
                    <div className={styles.meta}>
                        <span className={styles.author}>By {article.author}</span>
                        <span className={styles.date}>{article.date}</span>
                    </div>
                    {article.tags && article.tags.length > 0 && (
                        <div className={styles.tags}>
                            {article.tags.map(tag => (
                                <Link key={tag} href={`/tag/${tag}`} className={styles.tag}>
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </header>
            <div className={`container ${styles.contentContainer}`}>
                <img src={article.image} alt={article.title} className={styles.image} />
                <div className={styles.body}>
                    <div dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
                </div>
            </div>
        </article>
    );
}
