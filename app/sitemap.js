import { getSortedPostsData } from '@/lib/posts';

export const dynamic = 'force-static';

export default function sitemap() {
    const allPosts = getSortedPostsData();
    const baseUrl = 'https://market-drip.pages.dev'; // Updated domain

    const posts = allPosts.map((post) => ({
        url: `${baseUrl}/article/${post.id}`,
        lastModified: post.date,
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    const categories = ['stocks', 'retirement', 'banking', 'credit-cards'].map((cat) => ({
        url: `${baseUrl}/category/${cat}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...categories,
        ...posts,
    ];
}
