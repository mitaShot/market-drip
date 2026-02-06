import Hero from '@/components/Hero/Hero';
import NewsGrid from '@/components/NewsGrid/NewsGrid';
import { getSortedPostsData } from '@/lib/posts';

export async function generateMetadata({ params }) {
    const { lang } = params;
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

export default function Home({ params }) {
    const allPostsData = getSortedPostsData();
    return (
        <main>
            <Hero />
            <NewsGrid articles={allPostsData} title="Latest Investment News" />
        </main>
    );
}
