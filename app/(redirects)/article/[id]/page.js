import { getAllPostIds, getPostData } from '@/lib/posts';

export async function generateStaticParams() {
    const paths = getAllPostIds();
    const ids = Array.from(new Set(paths.map(p => p.params.id)));
    return ids.map(id => ({ id }));
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const article = await getPostData(id);
    const baseUrl = 'https://market-drip.com';

    if (!article) return { robots: { index: false } };

    const availableLangs = Object.keys(article.title || {});
    const defaultLang = availableLangs.includes('en') ? 'en' : availableLangs[0];

    return {
        alternates: {
            canonical: `${baseUrl}/${defaultLang}/article/${id}`,
        },
        robots: {
            index: false,
            follow: true,
        },
    };
}

export default async function ArticleOldPage({ params }) {
    const { id } = await params;
    const article = await getPostData(id);

    if (!article) return <div className="container">Article not found</div>;

    const availableLangs = Object.keys(article.title || {});
    const defaultLang = availableLangs.includes('en') ? 'en' : availableLangs[0];
    const targetUrl = `/${defaultLang}/article/${id}`;

    return (
        <>
            <meta httpEquiv="refresh" content={`0; url=${targetUrl}`} />
            <link rel="canonical" href={`https://market-drip.com${targetUrl}`} />
            <style>{`body{background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif}`}</style>
            <p>
                Redirecting to{' '}
                <a href={targetUrl}>{targetUrl}</a>…
            </p>
        </>
    );
}
