import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BASE_URL = 'https://market-drip.pages.dev';
const POSTS_DIR = path.join(process.cwd(), 'posts');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Ensure public directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR);
}

function getPosts() {
    if (!fs.existsSync(POSTS_DIR)) return [];

    const fileNames = fs.readdirSync(POSTS_DIR);
    // Based on lib/posts.js parsing logic
    const posts = fileNames
        .map((fileName) => {
            const match = fileName.match(/^(.+?)(?:_([a-z]{2}))?\.(md|html|json)$/);
            if (!match) return null;

            const id = match[1];
            // We only include the base ID in sitemap, or specific logic? 
            // The original sitemap.xml/route.js used:
            // const url = `${baseUrl}/article/${post.id}`;
            // And it iterated over allPosts.
            // Let's replicate that behavior. 
            // Note: original route used getSortedPostsData() which grouped by ID.

            return {
                fileName,
                id,
                lang: match[2] || 'en',
            };
        })
        .filter(Boolean);

    // We need to group to get the latest date for the ID, 
    // or just follow the logic of "one URL per article ID".
    // The original code: allPosts.forEach(post => url = .../article/${post.id})
    // getSortedPostsData returns grouped posts.

    // Let's parse files to get dates
    const postsData = posts.map(post => {
        const fullPath = path.join(POSTS_DIR, post.fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        let date;

        if (post.fileName.endsWith('.json')) {
            try {
                const json = JSON.parse(fileContents);
                date = json.seo?.published_date || json.date;
            } catch (e) {
                console.error(`Error parsing JSON file ${post.fileName}:`, e);
            }
        } else {
            const { data } = matter(fileContents);
            date = data.date;
        }

        return {
            id: post.id,
            date: date ? new Date(date) : new Date(),
            lang: post.lang
        };
    });

    // Group by ID to dedup (if multiple langs exist for same ID, we want one URL per ID usually, 
    // unless we have localized routes like /ko/article/..., but current route is /article/[id])
    // The original route produced: `${baseUrl}/article/${post.id}`
    const uniquePosts = {};

    postsData.forEach(p => {
        if (!uniquePosts[p.id] || new Date(p.date) > new Date(uniquePosts[p.id].date)) {
            uniquePosts[p.id] = p;
        }
    });

    return Object.values(uniquePosts).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function generateSitemap() {
    const posts = getPosts();

    const mainPages = [
        {
            url: BASE_URL,
            changeFrequency: 'daily',
            priority: 1.0,
        },
    ];

    const categories = ['stocks', 'etf', 'crypto', 'ai', 'dividends', 'banking'].map((cat) => ({
        url: `${BASE_URL}/tag/${cat}`,
        changeFrequency: 'daily',
        priority: 0.8,
    }));

    const postUrls = posts.map((post) => ({
        url: `${BASE_URL}/article/${post.id}`,
        lastModified: post.date.toISOString(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    const allUrls = [...mainPages, ...categories, ...postUrls];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
            .map((page) => {
                return `  <url>
    <loc>${page.url}</loc>
    ${page.lastModified ? `<lastmod>${page.lastModified}</lastmod>` : `<lastmod>${new Date().toISOString()}</lastmod>`}
    ${page.changeFrequency ? `<changefreq>${page.changeFrequency}</changefreq>` : ''}
    ${page.priority ? `<priority>${page.priority}</priority>` : ''}
  </url>`;
            })
            .join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
    console.log('✅ sitemap.xml generated successfully in public/');
}

generateSitemap();
