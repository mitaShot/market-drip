import NewsGrid from '@/components/NewsGrid/NewsGrid';
import { getSortedPostsData } from '@/lib/posts';

function normalizeTag(tag) {
    return tag.toLowerCase().replace(/\s+/g, '-');
}

export async function generateStaticParams() {
    const allPosts = getSortedPostsData();
    const tags = new Set();
    allPosts.forEach(post => {
        if (post.tags) {
            post.tags.forEach(tag => tags.add(normalizeTag(tag)));
        }
    });

    ['stocks', 'dividends', 'banking', 'crypto', 'etf', 'ai'].forEach(tag => tags.add(tag));

    const langs = ['en', 'ko', 'ja'];
    const params = [];

    langs.forEach(lang => {
        Array.from(tags).forEach(tag => {
            params.push({
                lang: lang,
                tag: tag
            });
        });
    });

    return params;
}

export async function generateMetadata({ params }) {
    const { lang, tag } = await params;
    const decodedTag = decodeURIComponent(tag);
    const displayTag = decodedTag.replace(/-/g, ' ');
    const baseUrl = 'https://market-drip.com';

    return {
        title: `#${displayTag} | Market Drip`,
        description: `Explore investment insights for ${displayTag} in ${lang}.`,
        alternates: {
            canonical: `${baseUrl}/${lang}/tag/${tag}`,
            languages: {
                'en': `${baseUrl}/en/tag/${tag}`,
                'ko': `${baseUrl}/ko/tag/${tag}`,
                'ja': `${baseUrl}/ja/tag/${tag}`,
                'x-default': `${baseUrl}/en/tag/${tag}`,
            },
        },
    };
}

export default async function TagPage({ params }) {
    const { lang, tag } = await params;
    const decodedTag = decodeURIComponent(tag);
    const allPosts = getSortedPostsData();

    const filteredArticles = allPosts.filter(article =>
        article.tags && article.tags.some(t => normalizeTag(t) === decodedTag.toLowerCase())
    );

    const displayTag = decodedTag.replace(/-/g, ' ');

    return (
        <main>
            <div className="container" style={{ paddingTop: '2rem' }}>
                <h1><span style={{ color: 'var(--color-primary-dark)', textTransform: 'capitalize' }}>#{displayTag}</span></h1>
                <NewsGrid articles={filteredArticles} title={`Posts tagged with "${displayTag}"`} />
            </div>
        </main>
    );
}
