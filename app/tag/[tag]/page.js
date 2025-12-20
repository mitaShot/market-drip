import NewsGrid from '@/components/NewsGrid/NewsGrid';
import { getSortedPostsData } from '@/lib/posts';

export async function generateStaticParams() {
    // In a real build, we should fetch all unique tags from all posts.
    // For now we can return an empty array or pre-calculate popular ones if we want SSG for them.
    // Dynamic params are allowed by default so returning empty list is fine for dev.
    const allPosts = getSortedPostsData();
    const tags = new Set();
    allPosts.forEach(post => {
        if (post.tags) {
            post.tags.forEach(tag => tags.add(tag.toLowerCase()));
        }
    });

    // Ensure default categories always exist to prevent 404s
    // These match the links in Hero.js and Sitemap
    ['stocks', 'dividends', 'banking', 'crypto', 'etf', 'ai'].forEach(tag => tags.add(tag));

    return Array.from(tags).map(tag => ({
        tag: encodeURIComponent(tag)
    }));
}

export default async function TagPage({ params }) {
    const { tag } = await params;
    // Decode (handle cases where it might be double encoded or just standard)
    const decodedTag = decodeURIComponent(tag);
    const allPosts = getSortedPostsData();

    // Filter by tag
    const filteredArticles = allPosts.filter(article =>
        article.tags && article.tags.some(t => t.toLowerCase() === decodedTag.toLowerCase())
    );

    return (
        <main>
            <div className="container" style={{ paddingTop: '2rem' }}>
                <h1><span style={{ color: 'var(--color-primary-dark)', textTransform: 'capitalize' }}>#{decodedTag}</span></h1>
                <NewsGrid articles={filteredArticles} title={`Posts tagged with "${decodedTag}"`} />
            </div>
        </main>
    );
}
