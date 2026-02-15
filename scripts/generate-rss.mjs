import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BASE_URL = 'https://market-drip.com';
const POSTS_DIR = path.join(process.cwd(), 'posts');
const OUT_DIR = path.join(process.cwd(), 'public');
const LANGUAGES = ['en', 'ko', 'ja'];

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

function getRFC822Date(date) {
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const d = new Date(date);
    const day = dayName[d.getUTCDay()];
    const dateNum = String(d.getUTCDate()).padStart(2, '0');
    const month = monthName[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    const seconds = String(d.getUTCSeconds()).padStart(2, '0');

    return `${day}, ${dateNum} ${month} ${year} ${hours}:${minutes}:${seconds} +0000`;
}

function getPosts() {
    if (!fs.existsSync(POSTS_DIR)) return [];

    const fileNames = fs.readdirSync(POSTS_DIR);
    const postsResult = [];

    fileNames.forEach(fileName => {
        const match = fileName.match(/^(.+?)(?:_([a-z]{2}))?\.(md|html|json)$/);
        if (!match) return;

        const id = match[1];
        const lang = match[2] || 'en';
        const fullPath = path.join(POSTS_DIR, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        let title = '';
        let excerpt = '';
        let date = '';

        if (fileName.endsWith('.json')) {
            try {
                const json = JSON.parse(fileContents);
                title = json.seo?.title || '';
                excerpt = json.content?.excerpt || json.seo?.meta_description || '';
                date = json.seo?.published_date || json.date;
            } catch (e) {
                console.error(`Error parsing JSON file ${fileName}:`, e);
            }
        } else {
            const { data } = matter(fileContents);
            title = data.title || '';
            excerpt = data.excerpt || '';
            date = data.date;
        }

        postsResult.push({
            id,
            lang,
            title,
            excerpt,
            date: date ? new Date(date) : new Date(),
            url: `${BASE_URL}/${lang}/article/${id}`
        });
    });

    return postsResult.sort((a, b) => b.date - a.date);
}

function generateLanguageRss(lang, posts) {
    const langPosts = posts.filter(p => p.lang === lang).slice(0, 20);
    const lastBuildDate = getRFC822Date(new Date());

    const channelTitle = lang === 'ko' ? 'Market Drip - 급등락주 및 핫티커 분석' :
        lang === 'ja' ? 'Market Drip - 急騰落株・ホットティッカー分析' :
            'Market Drip - Trending Tickers & Volatility Analysis';

    const channelDesc = lang === 'ko' ? '급등락주와 실시간 핫한 티커 분석. 시장의 가장 뜨거운 투자 인사이트를 매일 아침 전해드립니다.' :
        lang === 'ja' ? '急騰・急落株やリアルタイムで話題のティッカーを分析。市場で最もホットな投資インサイトを毎朝お届けします。' :
            'Deep dive into top gainers, losers, and trending tickers. Get the hottest market insights every morning.';

    const itemsXml = langPosts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(post.url)}</link>
      <guid isPermaLink="true">${escapeXml(post.url)}</guid>
      <pubDate>${getRFC822Date(post.date)}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(channelTitle)}</title>
  <link>${BASE_URL}/${lang}</link>
  <description>${escapeXml(channelDesc)}</description>
  <language>${lang}</language>
  <lastBuildDate>${lastBuildDate}</lastBuildDate>
  <atom:link href="${BASE_URL}/rss-${lang}.xml" rel="self" type="application/rss+xml" />
  ${itemsXml}
</channel>
</rss>`;

    const filePath = path.join(OUT_DIR, `rss-${lang}.xml`);
    fs.writeFileSync(filePath, xml);
    console.log(`✅ rss-${lang}.xml generated (${langPosts.length} items)`);
}

function main() {
    if (!fs.existsSync(OUT_DIR)) {
        fs.mkdirSync(OUT_DIR, { recursive: true });
    }

    const posts = getPosts();
    console.log(`📦 Found ${posts.length} posts for RSS`);

    LANGUAGES.forEach(lang => generateLanguageRss(lang, posts));

    console.log('\n🎉 All RSS feeds generated successfully!');
}

main();
