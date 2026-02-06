import { getAllPostIds, getPostData } from '@/lib/posts';

import ArticleViewer from '@/components/ArticleViewer/ArticleViewer';

export async function generateStaticParams() {
    const paths = getAllPostIds();
    // paths is [{ params: { lang: 'en', id: '...' } }, ...]
    return paths.map((path) => path.params);
}

export async function generateMetadata({ params }) {
    const { lang, id } = await params;
    const article = await getPostData(id);

    if (!article) {
        return {
            title: 'Article Not Found',
        }
    }

    const getMetadataValue = (obj, l) => {
        if (typeof obj === 'string') return obj;
        if (!obj) return '';
        return obj[l] || obj['en'] || Object.values(obj)[0] || '';
    };

    const title = getMetadataValue(article.title, lang);
    const excerpt = getMetadataValue(article.excerpt, lang);
    const author = getMetadataValue(article.author, lang);

    const baseUrl = 'https://market-drip.com';

    return {
        title: `${title} | Market Drip`,
        description: excerpt,
        alternates: {
            canonical: `${baseUrl}/${lang}/article/${id}`,
            languages: {
                'en': `${baseUrl}/en/article/${id}`,
                'ko': `${baseUrl}/ko/article/${id}`,
                'ja': `${baseUrl}/ja/article/${id}`,
                'x-default': `${baseUrl}/en/article/${id}`,
            },
        },
        openGraph: {
            title: title,
            description: excerpt,
            url: `${baseUrl}/${lang}/article/${id}`,
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
    const { lang, id } = await params;
    const article = await getPostData(id);

    if (!article) {
        return <div className="container">Article not found</div>;
    }

    const title = article.title[lang] || article.title['en'] || Object.values(article.title)[0];
    const authorName = article.author[lang] || article.author['en'] || Object.values(article.author)[0];
    const excerpt = article.excerpt[lang] || article.excerpt['en'] || Object.values(article.excerpt)[0];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: title,
        image: [article.image],
        datePublished: article.date,
        dateModified: article.date,
        author: [{
            '@type': 'Person',
            name: authorName,
            url: `https://market-drip.com/author/team`
        }],
        description: excerpt,
    };

    return (
        <article>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ArticleViewer article={article} />
        </article>
    );
}
