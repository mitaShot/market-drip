import NewsGrid from '@/components/NewsGrid/NewsGrid';
import { getSortedPostsData } from '@/lib/posts';

// 태그 이름 정규화: 공백을 하이픈으로 변환, 소문자로 통일
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

    // Ensure default categories always exist to prevent 404s
    ['stocks', 'dividends', 'banking', 'crypto', 'etf', 'ai'].forEach(tag => tags.add(tag));

    return Array.from(tags).map(tag => ({
        tag: tag
    }));
}

export default async function TagPage({ params }) {
    const { tag } = await params;
    const decodedTag = decodeURIComponent(tag);
    const allPosts = getSortedPostsData();

    // Filter by normalized tag (공백->하이픈 변환된 태그로 비교)
    const filteredArticles = allPosts.filter(article =>
        article.tags && article.tags.some(t => normalizeTag(t) === decodedTag.toLowerCase())
    );

    // 표시용 태그 이름 (하이픈을 공백으로 복원)
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
