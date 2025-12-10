import { getSortedPostsData } from '@/lib/posts';

export default function sitemap() {
    const allPosts = getSortedPostsData();
    const baseUrl = 'https://your-domain.com'; // Replace with actual domain

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
