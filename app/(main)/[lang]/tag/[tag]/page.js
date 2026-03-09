import NewsGrid from '@/components/NewsGrid/NewsGrid';
import { getSortedPostsData } from '@/lib/posts';

function normalizeTag(tag) {
    if (!tag) return '';
    return tag.toLowerCase()
        .replace(/[|,\/]/g, ' ') // replace separators with spaces first
        .trim()
        .replace(/\s+/g, '-')    // then spaces to dashes
        .replace(/[^-a-z0-9]/g, '') // strip anything else except a-z, 0-9, and dashes
        .replace(/-+/g, '-');    // deduplicate dashes
}

export const dynamicParams = false;

export async function generateStaticParams() {
    const allPosts = getSortedPostsData();
    const tags = new Set();

    allPosts.forEach(post => {
        // Collect from tags
        if (post.tags) {
            post.tags.forEach(tag => tags.add(normalizeTag(tag)));
        }
        // Collect from category (split if multiple)
        if (post.category) {
            // Get categories for all languages to be safe
            Object.values(post.category).forEach(catStr => {
                if (catStr) {
                    String(catStr).split(/[|,\/]/).forEach(c => tags.add(normalizeTag(c.trim())));
                }
            });
        }
    });

    ['stocks', 'dividends', 'banking', 'crypto', 'etf', 'ai'].forEach(tag => tags.add(tag));

    const langs = ['en', 'ko', 'ja'];
    const params = [];

    langs.forEach(lang => {
        Array.from(tags).forEach(tag => {
            if (tag) {
                params.push({
                    lang: lang,
                    tag: tag
                });
            }
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

    const filteredArticles = allPosts.filter(article => {
        // Check tags
        const hasTag = article.tags && article.tags.some(t => normalizeTag(t) === decodedTag.toLowerCase());

        // Check category (split if multiple)
        const catStr = article.category[lang] || article.category['en'] || Object.values(article.category || {})[0] || '';
        const hasCategory = catStr && String(catStr).split(/[|,\/]/).some(c => normalizeTag(c.trim()) === decodedTag.toLowerCase());

        return hasTag || hasCategory;
    });

    const displayTag = decodedTag.replace(/-/g, ' ');

    return (
        <main>
            <div className="container" style={{ paddingTop: '2rem' }}>
                <h1 style={{ marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--color-primary-dark)', textTransform: 'capitalize' }}>
                        #{displayTag}
                    </span>
                </h1>
                <NewsGrid articles={filteredArticles} title={`Posts related to "${displayTag}"`} />
            </div>
        </main>
    );
}
