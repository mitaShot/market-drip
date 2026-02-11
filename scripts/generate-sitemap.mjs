import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BASE_URL = 'https://market-drip.com';
const POSTS_DIR = path.join(process.cwd(), 'posts');
const OUT_DIR = path.join(process.cwd(), 'public');
const LANGUAGES = ['en', 'ko', 'ja'];
const CATEGORIES = ['stocks', 'etf', 'crypto', 'ai', 'dividends', 'banking'];

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

function generateLanguageSitemap(lang, posts) {
    const urls = [];

    // Home page
    urls.push({ loc: `${BASE_URL}/${lang}`, priority: '1.0' });

    // Category/Tag pages
    CATEGORIES.forEach(cat => {
        urls.push({ loc: `${BASE_URL}/${lang}/tag/${cat}`, priority: '0.8' });
    });

    // Post pages
    posts.forEach(post => {
        urls.push({
            loc: `${BASE_URL}/${lang}/article/${post.id}`,
            priority: '0.7',
            lastmod: post.date.toISOString()
        });
    });

    const now = new Date().toISOString();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(url => {
        const pathSuffix = url.loc.replace(`${BASE_URL}/${lang}`, '');
        const lastmod = url.lastmod || now;

        return `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${url.priority}</priority>
${LANGUAGES.map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${escapeXml(`${BASE_URL}/${l}${pathSuffix}`)}" />`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${BASE_URL}/en${pathSuffix}`)}" />
  </url>`;
    }).join('\n')}
</urlset>`;

    // Write to out/<lang>/sitemap-<lang>.xml
    const langDir = path.join(OUT_DIR, lang);
    if (!fs.existsSync(langDir)) {
        fs.mkdirSync(langDir, { recursive: true });
    }
    const filePath = path.join(langDir, `sitemap-${lang}.xml`);
    fs.writeFileSync(filePath, xml);
    console.log(`✅ ${lang}/sitemap-${lang}.xml generated (${urls.length} URLs)`);
}

function generateSitemapIndex() {
    const now = new Date().toISOString();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${LANGUAGES.map(lang => `  <sitemap>
    <loc>${BASE_URL}/${lang}/sitemap-${lang}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    const filePath = path.join(OUT_DIR, 'sitemap_index.xml');
    fs.writeFileSync(filePath, xml);
    console.log(`✅ sitemap_index.xml generated`);
}

function main() {
    if (!fs.existsSync(OUT_DIR)) {
        console.error('❌ out/ directory not found. Run "next build" first.');
        process.exit(1);
    }

    const posts = getPosts();
    console.log(`📦 Found ${posts.length} unique posts`);

    LANGUAGES.forEach(lang => generateLanguageSitemap(lang, posts));
    generateSitemapIndex();

    console.log('\n🎉 All sitemaps generated successfully!');
}

main();
