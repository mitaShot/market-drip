import { getAllPostIds, getPostData } from '@/lib/posts';
import styles from './page.module.css';
import Link from 'next/link';
import ArticleViewer from '@/components/ArticleViewer/ArticleViewer';

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

    const getMetadataValue = (obj) => {
        if (typeof obj === 'string') return obj;
        if (!obj) return '';
        return obj.en || Object.values(obj)[0] || '';
    };

    const title = getMetadataValue(article.title);
    const excerpt = getMetadataValue(article.excerpt);
    const author = getMetadataValue(article.author);

    const baseUrl = 'https://market-drip.pages.dev';

    return {
        title: `${title} | Market Drip`,
        description: excerpt,
        alternates: {
            canonical: `${baseUrl}/article/${id}`,
        },
        openGraph: {
            title: title,
            description: excerpt,
            url: `${baseUrl}/article/${id}`,
            images: [
                {
                    url: article.image.startsWith('http') ? article.image : `${baseUrl}${article.image}`,
                    width: 800,
                    height: 600,
                    alt: title,
                }
            ],
            type: 'article',
            publishedTime: article.date,
            authors: [author],
            tags: article.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: excerpt,
            images: [article.image.startsWith('http') ? article.image : `${baseUrl}${article.image}`],
        },
    }
}

export default async function ArticlePage({ params }) {
    // In Next.js 15+ (if using that), params might be a promise, but for now assuming standard 14 behavior or unwrapping.
    const { id } = await params;
    console.log('Fetching article id:', id);
    const article = await getPostData(id);
    console.log('Article fetched:', article ? (article.title.en || Object.values(article.title)[0]) : 'Not found');
    // ContentHtml is an object now { en: "...", ko: "..." }
    const contentEn = article?.contentHtml?.en || Object.values(article?.contentHtml || {})[0];
    console.log('Content HTML length (en):', contentEn?.length);

    if (!article) {
        return <div className="container">Article not found</div>;
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.title.en || Object.values(article.title)[0], // Fallback for SEO
        image: [article.image],
        datePublished: article.date,
        dateModified: article.date,
        author: [{
            '@type': 'Person',
            name: article.author.en || Object.values(article.author)[0],
            url: `https://market-drip.pages.dev/author/team`
        }],
        description: article.excerpt.en || Object.values(article.excerpt)[0],
    };

    return (
        <article className={styles.article}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ArticleViewer article={article} />
        </article>
    );
}
