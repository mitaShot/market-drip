import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { parseJsonPost } from './jsonPostRenderer.js';

const postsDirectory = path.join(process.cwd(), 'posts');

// Helper to parse file info: returns { id, lang, ext } or null
function parseFileInfo(fileName) {
    // Support .md, .html, .json extensions
    const match = fileName.match(/^(.+?)(?:_([a-z]{2}))?\.(md|html|json)$/);
    if (!match) return null;

    let lang = match[2] || 'en';
    // Standardize 'jp' to 'ja' if needed
    if (lang === 'jp') lang = 'ja';

    return {
        id: match[1],
        lang: lang,
        ext: match[3]
    };
}

// Helper to infer ticker from metadata if not explicitly provided
function getTickerFromMetadata(metadata) {
    if (metadata.ticker) return metadata.ticker;
    if (metadata._raw?.meta_info?.selected_ticker) return metadata._raw.meta_info.selected_ticker;

    // Try to find ticker in tags (usually all uppercase, 3-5 chars)
    if (metadata.tags && Array.isArray(metadata.tags)) {
        const tickerTag = metadata.tags.find(tag => /^[A-Z]{2,5}$/.test(tag));
        if (tickerTag) return tickerTag;
    }

    // Try to find ticker in title (often in parentheses like "Palantir (PLTR)")
    if (metadata.title) {
        const match = metadata.title.match(/\(([A-Z]{2,5})\)/);
        if (match) return match[1];
    }

    return null;
}

export function getSortedPostsData() {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }
    const fileNames = fs.readdirSync(postsDirectory);

    // Group by ID
    const postsById = {};

    fileNames.forEach(fileName => {
        const info = parseFileInfo(fileName);
        if (!info) return;

        const { id, lang, ext } = info;
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        let metadata;
        if (ext === 'json') {
            // Parse JSON file
            try {
                const jsonData = JSON.parse(fileContents);
                const parsed = parseJsonPost(jsonData, id, lang);
                metadata = {
                    title: parsed.title,
                    date: parsed.date,
                    category: parsed.category,
                    author: parsed.author,
                    excerpt: parsed.excerpt,
                    image: parsed.image,
                    tags: parsed.tags,
                    ticker: parsed._raw?.meta_info?.selected_ticker
                };
            } catch (e) {
                console.error(`Error parsing JSON file ${fileName}:`, e);
                return;
            }
        } else {
            // Parse md/html with gray-matter
            const matterResult = matter(fileContents);
            metadata = matterResult.data;
        }

        if (!postsById[id]) {
            postsById[id] = { id, variations: {} };
        }

        // Store metadata for this language
        postsById[id].variations[lang] = metadata;
    });

    const allPostsData = Object.values(postsById).map(post => {
        // Create a unified post object with localized fields
        const variationLangs = Object.keys(post.variations);
        const baseLang = variationLangs.includes('en') ? 'en' : variationLangs[0];
        const baseData = post.variations[baseLang];

        // Merge fields: title, category, etc become objects { en: "...", ko: "..." }
        // Date and image are usually shared, but we'll take from baseLang
        // For simplicity, we create specific localized objects for text fields

        const localizedFields = ['title', 'excerpt', 'category'];
        const combinedData = {
            id: post.id,
            date: baseData.date || '', // Use base date
            image: baseData.image || '', // Use base image
            tags: baseData.tags || [],
            author: 'Market Drip',
            ticker: getTickerFromMetadata(baseData),
            // ... copy other non-localized fields
        };

        localizedFields.forEach(field => {
            const fieldObj = {};
            variationLangs.forEach(lang => {
                if (post.variations[lang][field]) {
                    fieldObj[lang] = post.variations[lang][field];
                }
            });
            // If only one lang exists (e.g. en), populate others as fallback? 
            // Better: just pass the object. The UI will pick.
            combinedData[field] = fieldObj;
        });

        return combinedData;
    });

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getAllPostIds() {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }
    const fileNames = fs.readdirSync(postsDirectory);
    const paths = [];

    fileNames.forEach(fileName => {
        const info = parseFileInfo(fileName);
        if (info) {
            paths.push({
                params: {
                    lang: info.lang,
                    id: info.id,
                },
            });
        }
    });

    return paths;
}

export async function getPostData(id) {
    const fileNames = fs.readdirSync(postsDirectory);
    const variations = {};
    let baseData = null;

    for (const fileName of fileNames) {
        const info = parseFileInfo(fileName);
        if (!info || info.id !== id) continue;

        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        let contentHtml;
        let metadata;

        if (info.ext === 'json') {
            // Parse JSON file
            try {
                const jsonData = JSON.parse(fileContents);
                const parsed = parseJsonPost(jsonData, id, info.lang);
                contentHtml = parsed.contentHtml;
                metadata = {
                    title: parsed.title,
                    date: parsed.date,
                    category: parsed.category,
                    author: parsed.author,
                    excerpt: parsed.excerpt,
                    image: parsed.image,
                    tags: parsed.tags,
                    ticker: parsed._raw?.meta_info?.selected_ticker
                };
            } catch (e) {
                console.error(`Error parsing JSON file ${fileName}:`, e);
                continue;
            }
        } else if (info.ext === 'md') {
            const matterResult = matter(fileContents);
            const processedContent = await remark()
                .use(html)
                .process(matterResult.content);
            contentHtml = processedContent.toString();
            metadata = matterResult.data;
        } else {
            // HTML file
            const matterResult = matter(fileContents);
            contentHtml = matterResult.content;
            metadata = matterResult.data;
        }

        variations[info.lang] = {
            ...metadata,
            contentHtml
        };

        if (info.lang === 'en' || !baseData) {
            baseData = metadata;
        }
    }

    if (!baseData && Object.keys(variations).length > 0) {
        baseData = Object.values(variations)[0];
    }

    if (Object.keys(variations).length === 0) {
        return null;
    }

    // Structure data for client
    // We send contentHtml as an object { en: html, ko: html }
    // Same for title, etc.

    const langs = Object.keys(variations);
    const result = {
        id,
        date: baseData.date,
        image: baseData.image,
        tags: baseData.tags,
        ticker: getTickerFromMetadata(baseData),
        contentHtml: {},
        title: {},
        category: {},
        author: 'Market Drip',
        excerpt: {},
    };

    langs.forEach(lang => {
        result.contentHtml[lang] = variations[lang].contentHtml;
        result.title[lang] = variations[lang].title;
        result.category[lang] = variations[lang].category;
        result.excerpt[lang] = variations[lang].excerpt;
    });

    return result;
}

export function getRelatedPosts(ticker, currentPostId) {
    if (!ticker) return [];

    const allPosts = getSortedPostsData();
    const related = allPosts.filter(post =>
        post.ticker === ticker && post.id !== currentPostId
    );

    // Create simple array for usage (only need id, title, date)
    return related.slice(0, 3);
}
