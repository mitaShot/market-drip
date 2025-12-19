
import { getSortedPostsData } from '@/lib/posts';

export const dynamic = 'force-static';

export async function GET() {
    const allPosts = getSortedPostsData();
    const baseUrl = 'https://market-drip.pages.dev';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Static pages
    const mainPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
    ];

    const categories = ['stocks', 'etf', 'crypto', 'ai'].map((cat) => ({
        url: `${baseUrl}/category/${cat}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
    }));

    // Add static pages to XML
    [...mainPages, ...categories].forEach((page) => {
        xml += `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified.toISOString()}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Add blog posts to XML
    allPosts.forEach((post) => {
        // Ensure date is in ISO format
        const date = post.date ? new Date(post.date).toISOString() : new Date().toISOString();
        const url = `${baseUrl}/article/${post.id}`;

        xml += `
  <url>
    <loc>${url}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    return new Response(xml.trim(), {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
