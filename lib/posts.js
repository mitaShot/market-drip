import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

// Helper to parse file info: returns { id, lang, ext } or null
function parseFileInfo(fileName) {
    const match = fileName.match(/^(.+?)(?:_([a-z]{2}))?\.(md|html)$/);
    if (!match) return null;
    return {
        id: match[1],
        lang: match[2] || 'en', // Default to 'en' if no suffix
        ext: match[3]
    };
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

        const { id, lang } = info;
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        if (!postsById[id]) {
            postsById[id] = { id, variations: {} };
        }

        // Store metadata for this language
        postsById[id].variations[lang] = matterResult.data;
    });

    const allPostsData = Object.values(postsById).map(post => {
        // Create a unified post object with localized fields
        const variationLangs = Object.keys(post.variations);
        const baseLang = variationLangs.includes('en') ? 'en' : variationLangs[0];
        const baseData = post.variations[baseLang];

        // Merge fields: title, category, etc become objects { en: "...", ko: "..." }
        // Date and image are usually shared, but we'll take from baseLang
        // For simplicity, we create specific localized objects for text fields

        const localizedFields = ['title', 'excerpt', 'category', 'author'];
        const combinedData = {
            id: post.id,
            date: baseData.date || '', // Use base date
            image: baseData.image || '', // Use base image
            tags: baseData.tags || [],
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
    const ids = new Set();

    fileNames.forEach(fileName => {
        const info = parseFileInfo(fileName);
        if (info) ids.add(info.id);
    });

    return Array.from(ids).map(id => {
        return {
            params: {
                id: id,
            },
        };
    });
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
        const matterResult = matter(fileContents);

        let contentHtml;
        if (info.ext === 'md') {
            const processedContent = await remark()
                .use(html)
                .process(matterResult.content);
            contentHtml = processedContent.toString();
        } else {
            contentHtml = matterResult.content;
        }

        variations[info.lang] = {
            ...matterResult.data,
            contentHtml
        };

        if (info.lang === 'en' || !baseData) {
            baseData = matterResult.data;
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
        contentHtml: {},
        title: {},
        category: {},
        author: {},
        excerpt: {},
    };

    langs.forEach(lang => {
        result.contentHtml[lang] = variations[lang].contentHtml;
        result.title[lang] = variations[lang].title;
        result.category[lang] = variations[lang].category;
        result.author[lang] = variations[lang].author;
        result.excerpt[lang] = variations[lang].excerpt;
    });

    return result;
}
