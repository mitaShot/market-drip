import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BASE_URL = 'https://market-drip.com';
const POSTS_DIR = path.join(process.cwd(), 'posts');
const OUT_DIR = path.join(process.cwd(), 'public');
const LANGUAGES = ['en', 'ko', 'ja'];
const CATEGORIES = ['stocks', 'etf', 'crypto', 'earnings'];

function escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

function getPosts() {
    if (!fs.existsSync(POSTS_DIR)) return [];

    const fileNames = fs.readdirSync(POSTS_DIR);
    const posts = fileNames
        .map((fileName) => {
            const match = fileName.match(/^(.+?)(?:_([a-z]{2}))?\.((md|html|json))$/);
            if (!match) return null;
            return { fileName, id: match[1], lang: match[2] || 'en' };
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

    // Deduplicate by ID, keeping latest date
    const uniquePosts = {};
    postsData.forEach(p => {
        if (!uniquePosts[p.id] || new Date(p.date) > new Date(uniquePosts[p.id].date)) {
            uniquePosts[p.id] = p;
        }
    });

    return Object.values(uniquePosts).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function generateSitemap(posts) {
    const now = new Date().toISOString();
    const urls = [];

    // Home pages (per language)
    LANGUAGES.forEach(lang => {
        urls.push({
            loc: `${BASE_URL}/${lang}`,
            lastmod: now,
            priority: '1.0',
            pathSuffix: ''
        });
    });

    // Category pages (per language)
    LANGUAGES.forEach(lang => {
        CATEGORIES.forEach(cat => {
            urls.push({
                loc: `${BASE_URL}/${lang}/tag/${cat}`,
                lastmod: now,
                priority: '0.5',
                pathSuffix: `/tag/${cat}`
            });
        });
    });

    // Article pages (per language per post)
    LANGUAGES.forEach(lang => {
        posts.forEach(post => {
            urls.push({
                loc: `${BASE_URL}/${lang}/article/${post.id}`,
                lastmod: post.date.toISOString(),
                priority: '0.7',
                pathSuffix: `/article/${post.id}`
            });
        });
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(url => {
        return `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <priority>${url.priority}</priority>
${LANGUAGES.map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${escapeXml(`${BASE_URL}/${l}${url.pathSuffix}`)}" />`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${BASE_URL}/en${url.pathSuffix}`)}" />
  </url>`;
    }).join('\n')}
</urlset>`;

    const filePath = path.join(OUT_DIR, 'sitemap.xml');
    fs.writeFileSync(filePath, xml);
    console.log(`✅ sitemap.xml generated (${urls.length} URLs)`);
}

function cleanupOldSitemaps() {
    // Remove old sitemap_index.xml
    const indexPath = path.join(OUT_DIR, 'sitemap_index.xml');
    if (fs.existsSync(indexPath)) {
        fs.unlinkSync(indexPath);
        console.log('🗑️  Removed old sitemap_index.xml');
    }

    // Remove old language-specific sitemaps
    LANGUAGES.forEach(lang => {
        const oldPath = path.join(OUT_DIR, lang, `sitemap-${lang}.xml`);
        if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
            console.log(`🗑️  Removed old ${lang}/sitemap-${lang}.xml`);
        }
    });
}

function main() {
    if (!fs.existsSync(OUT_DIR)) {
        console.error('❌ public/ directory not found.');
        process.exit(1);
    }

    const posts = getPosts();
    console.log(`📦 Found ${posts.length} unique posts`);

    generateSitemap(posts);
    cleanupOldSitemaps();

    console.log('\n🎉 Sitemap generated successfully!');
}

main();
