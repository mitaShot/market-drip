import { getAllPostIds } from '@/lib/posts';

export async function generateStaticParams() {
    const paths = getAllPostIds();
    const ids = Array.from(new Set(paths.map(p => p.params.id)));
    return ids.map(id => ({ id }));
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const baseUrl = 'https://market-drip.com';
    return {
        // Signal to Google that /en/article/[id] is the canonical URL
        alternates: {
            canonical: `${baseUrl}/en/article/${id}`,
        },
        robots: {
            index: false,
            follow: true,
        },
    };
}

export default async function ArticleOldPage({ params }) {
    const { id } = await params;
    const targetUrl = `/en/article/${id}`;

    return (
        <>
            {/* Hard meta-refresh so Google follows this even without JS */}
            <meta httpEquiv="refresh" content={`0; url=${targetUrl}`} />
            <link rel="canonical" href={`https://market-drip.com/en/article/${id}`} />
            <style>{`body{background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif}`}</style>
            <p>
                Redirecting to{' '}
                <a href={targetUrl}>{targetUrl}</a>…
            </p>
        </>
    );
}
