import { getSortedPostsData } from '@/lib/posts';
import ClientRedirector from '@/components/Redirector/Redirector';

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
    return Array.from(tags).map(tag => ({ tag }));
}

export default async function TagOldPage({ params }) {
    const { tag } = await params;
    return <ClientRedirector targetPath={`/tag/${tag}`} />;
}
