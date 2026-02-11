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
const OUTPUT_DIRS = [PUBLIC_DIR, path.join(process.cwd(), 'out')];

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

function generateLanguageSitemap(lang, posts, categories) {
    const urls = [];

    // Home page
    urls.push(`${BASE_URL}/${lang}`);

    // Category/Tag pages
    categories.forEach(cat => {
        urls.push(`${BASE_URL}/${lang}/tag/${cat}`);
    });

    // Post pages
    posts.forEach(post => {
        urls.push(`${BASE_URL}/${lang}/article/${post.id}`);
    });

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(url => {
        const pathSuffix = url.replace(`${BASE_URL}/${lang}`, '');
        const isPost = pathSuffix.startsWith('/article/');
        const post = posts.find(p => url.endsWith(p.id));
        const lastMod = (isPost && post) ? post.date.toISOString() : new Date().toISOString();
        const priority = url === `${BASE_URL}/${lang}` ? '1.0' : (pathSuffix.startsWith('/tag/') ? '0.8' : '0.7');

        return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastMod}</lastmod>
    <priority>${priority}</priority>
${LANGUAGES.map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${escapeXml(`${BASE_URL}/${l}${pathSuffix}`)}" />`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${BASE_URL}/en${pathSuffix}`)}" />
  </url>`;
    }).join('\n')}
</urlset>`;

    OUTPUT_DIRS.forEach(baseDir => {
        if (!fs.existsSync(baseDir)) return;

        const langDir = path.join(baseDir, lang);
        if (!fs.existsSync(langDir)) {
            fs.mkdirSync(langDir, { recursive: true });
        }

        fs.writeFileSync(path.join(langDir, `sitemap-${lang}.xml`), sitemapContent);

        // Clean up old sitemap at root if it exists
        const oldPath = path.join(baseDir, `sitemap-${lang}.xml`);
        if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
        }
    });

    console.log(`✅ sitemap-${lang}.xml generated.`);
}

function generateSitemapIndex() {
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${LANGUAGES.map(lang => `  <sitemap>
    <loc>${BASE_URL}/${lang}/sitemap-${lang}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    OUTPUT_DIRS.forEach(baseDir => {
        if (!fs.existsSync(baseDir)) return;
        fs.writeFileSync(path.join(baseDir, 'sitemap.xml'), sitemapIndex);
    });

    console.log('✅ sitemap.xml (index) generated.');
}

function generateSitemaps() {
    const posts = getPosts();
    const categories = ['stocks', 'etf', 'crypto', 'ai', 'dividends', 'banking'];

    LANGUAGES.forEach(lang => {
        generateLanguageSitemap(lang, posts, categories);
    });

    generateSitemapIndex();
}

generateSitemaps();
