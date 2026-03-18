import NewsGrid from '@/components/NewsGrid/NewsGrid';
import Pagination from '@/components/Pagination/Pagination';
import { getSortedPostsData } from '@/lib/posts';

const POSTS_PER_PAGE = 12;

export async function generateStaticParams() {
    const allPostsData = getSortedPostsData();
    const totalPages = Math.ceil(allPostsData.length / POSTS_PER_PAGE);

    const langs = ['en', 'ko', 'ja'];
    const params = [];

    langs.forEach(lang => {
        // Page 1 is handled by the root /[lang] page, but we generate it anyway for consistency 
        // OR we can skip page 1 here if we want to avoid duplication (redirects/canonical will handle it)
        for (let i = 1; i <= totalPages; i++) {
            params.push({
                lang,
                page: i.toString()
            });
        }
    });

    return params;
}

export async function generateMetadata({ params }) {
    const { lang, page } = await params;
    const baseUrl = 'https://market-drip.com';

    return {
        title: `Investment Insights - Page ${page} | Market Drip`,
        description: `Explore investment news and AI-driven insights on page ${page} of Market Drip (${lang.toUpperCase()}).`,
        alternates: {
            canonical: `${baseUrl}/${lang}/page/${page}`,
            languages: {
                'en': `${baseUrl}/en/page/${page}`,
                'ko': `${baseUrl}/ko/page/${page}`,
                'ja': `${baseUrl}/ja/page/${page}`,
                'x-default': `${baseUrl}/en/page/${page}`,
            },
        },
        robots: {
            // Usually we want lists to be indexed if they provide value, 
            // but some prefer 'noindex, follow' for paginated results to focus on articles.
            // Google recommends indexing them if they have unique value.
            index: true,
            follow: true,
        }
    };
}

export default async function PaginatedHome({ params }) {
    const { lang, page } = await params;
    const pageNo = parseInt(page);
    const allPostsData = getSortedPostsData();
    const totalPages = Math.ceil(allPostsData.length / POSTS_PER_PAGE);

    const displayedPosts = allPostsData.slice(
        (pageNo - 1) * POSTS_PER_PAGE,
        pageNo * POSTS_PER_PAGE
    );

    return (
        <main>
            <div className="container" style={{ paddingTop: '2rem' }}>
                <NewsGrid
                    articles={displayedPosts}
                    title={`Investment News - Page ${pageNo}`}
                    lang={lang}
                />
                <Pagination
                    totalPages={totalPages}
                    currentPage={pageNo}
                    lang={lang}
                />
            </div>
        </main>
    );
}
