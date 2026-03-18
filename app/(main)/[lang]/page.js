import Hero from '@/components/Hero/Hero';
import NewsGrid from '@/components/NewsGrid/NewsGrid';
import { getSortedPostsData } from '@/lib/posts';

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const baseUrl = 'https://market-drip.com';

    return {
        title: 'Market Drip | Smart Investing News',
        description: 'Fresh financial insights, brewed daily. Market Drip covers stocks, ETFs, crypto, and AI-driven investing.',
        alternates: {
            canonical: `${baseUrl}/${lang}`,
            languages: {
                'en': `${baseUrl}/en`,
                'ko': `${baseUrl}/ko`,
                'ja': `${baseUrl}/ja`,
                'x-default': `${baseUrl}/en`,
            },
        },
    };
}

import Pagination from '@/components/Pagination/Pagination';

const POSTS_PER_PAGE = 12;

export default async function Home({ params }) {
    const { lang } = await params;
    const allPostsData = getSortedPostsData();
    const totalPages = Math.ceil(allPostsData.length / POSTS_PER_PAGE);
    const currentPage = 1;

    const displayedPosts = allPostsData.slice(0, POSTS_PER_PAGE);

    return (
        <main>
            <Hero />
            <div className="container">
                <NewsGrid articles={displayedPosts} title="Latest Investment News" lang={lang} />
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    lang={lang}
                />
            </div>
        </main>
    );
}
