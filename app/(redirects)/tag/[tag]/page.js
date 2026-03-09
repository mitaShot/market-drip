import { getSortedPostsData } from '@/lib/posts';

function normalizeTag(tag) {
    if (!tag) return '';
    return tag.toLowerCase()
        .replace(/[|,\/]/g, ' ')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^-a-z0-9]/g, '')
        .replace(/-+/g, '-');
}

export async function generateStaticParams() {
    const allPosts = getSortedPostsData();
    const tags = new Set();
    allPosts.forEach(post => {
        if (post.tags) {
            post.tags.forEach(tag => tags.add(normalizeTag(tag)));
        }
        if (post.category) {
            Object.values(post.category).forEach(catStr => {
                if (catStr) {
                    String(catStr).split(/[|,\/]/).forEach(c => tags.add(normalizeTag(c.trim())));
                }
            });
        }
    });
    ['stocks', 'dividends', 'banking', 'crypto', 'etf', 'ai'].forEach(tag => tags.add(tag));
    return Array.from(tags).filter(Boolean).map(tag => ({ tag }));
}

export async function generateMetadata({ params }) {
    const { tag } = await params;
    const baseUrl = 'https://market-drip.com';
    return {
        alternates: {
            canonical: `${baseUrl}/en/tag/${tag}`,
        },
        robots: {
            index: false,
            follow: true,
        },
    };
}

export default async function TagOldPage({ params }) {
    const { tag } = await params;
    const targetUrl = `/en/tag/${tag}`;

    return (
        <>
            <meta httpEquiv="refresh" content={`0; url=${targetUrl}`} />
            <link rel="canonical" href={`https://market-drip.com/en/tag/${tag}`} />
            <style>{`body{background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif}`}</style>
            <p>
                Redirecting to{' '}
                <a href={targetUrl}>{targetUrl}</a>…
            </p>
        </>
    );
}
