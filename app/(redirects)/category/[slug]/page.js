export async function generateStaticParams() {
    const categories = ['stocks', 'etf', 'crypto', 'ai', 'dividends', 'banking'];
    return categories.map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const baseUrl = 'https://market-drip.com';
    return {
        alternates: {
            canonical: `${baseUrl}/en/tag/${slug}`,
        },
        robots: {
            index: false,
            follow: true,
        },
    };
}

export default async function CategoryOldPage({ params }) {
    const { slug } = await params;
    // Map /category/[slug] → /en/tag/[slug]
    const targetUrl = `/en/tag/${slug}`;

    return (
        <>
            <meta httpEquiv="refresh" content={`0; url=${targetUrl}`} />
            <link rel="canonical" href={`https://market-drip.com/en/tag/${slug}`} />
            <style>{`body{background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif}`}</style>
            <p>
                Redirecting to{' '}
                <a href={targetUrl}>{targetUrl}</a>…
            </p>
        </>
    );
}
