import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BASE_URL = 'https://market-drip.com';
const POSTS_DIR = path.join(process.cwd(), 'posts');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Ensure public directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR);
}

const LANGUAGES = ['en', 'ko', 'ja'];

function getPosts() {
    if (!fs.existsSync(POSTS_DIR)) return [];

    const fileNames = fs.readdirSync(POSTS_DIR);
    const posts = fileNames
        .map((fileName) => {
            const match = fileName.match(/^(.+?)(?:_([a-z]{2}))?\.(md|html|json)$/);
            if (!match) return null;

            const id = match[1];
            return {
                fileName,
                id,
                lang: match[2] || 'en',
            };
        })
        .filter(Boolean);

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

    // Group by ID to get the latest date for each article ID
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
    const categories = ['stocks', 'etf', 'crypto', 'ai', 'dividends', 'banking'];

    const allUrls = [];

    LANGUAGES.forEach(lang => {
        // Home pages
        allUrls.push({
            url: `${BASE_URL}/${lang}`,
            changeFrequency: 'daily',
            priority: 1.0,
        });

        // Category/Tag pages
        categories.forEach(cat => {
            allUrls.push({
                url: `${BASE_URL}/${lang}/tag/${cat}`,
                changeFrequency: 'daily',
                priority: 0.8,
            });
        });

        // Post pages
        posts.forEach(post => {
            allUrls.push({
                url: `${BASE_URL}/${lang}/article/${post.id}`,
                lastModified: post.date.toISOString(),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        });
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
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
