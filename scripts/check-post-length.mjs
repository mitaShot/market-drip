import fs from 'fs';
import path from 'path';

const postsDir = path.join(process.cwd(), 'posts');

function getTextLength(jsonContent) {
    let text = '';

    // Hook Summary
    if (jsonContent.hook_summary && jsonContent.hook_summary.points) {
        text += jsonContent.hook_summary.points.join(' ');
    }

    // Sections
    if (jsonContent.content && jsonContent.content.sections) {
        jsonContent.content.sections.forEach(section => {
            if (section.content) text += section.content;
            if (section.bull_case) text += section.bull_case;
            if (section.bear_case) text += section.bear_case;
            if (section.strategy) text += section.strategy;

            if (section.companies) {
                section.companies.forEach(c => {
                    if (c.description) text += c.description;
                });
            }
        });
    } else if (jsonContent.sections) {
        // Handle case where content might be directly at root (older structure?) or just strictly follow the structure
        jsonContent.sections.forEach(section => {
            if (section.content) text += section.content;
            if (section.bull_case) text += section.bull_case;
            if (section.bear_case) text += section.bear_case;
            if (section.strategy) text += section.strategy;
            if (section.companies) {
                section.companies.forEach(c => {
                    if (c.description) text += c.description;
                });
            }
        });
    }

    // Remove HTML tags if any (rough)
    text = text.replace(/<[^>]*>?/gm, '');
    // Remove whitespace
    return text.replace(/\s/g, '').length;
}

function checkFiles() {
    if (!fs.existsSync(postsDir)) {
        console.log('Posts directory not found.');
        return;
    }

    const files = fs.readdirSync(postsDir);
    const shortPosts = [];

    const over2000 = [];

    files.forEach(file => {
        if (!file.endsWith('.json')) return;

        const filePath = path.join(postsDir, file);
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const json = JSON.parse(content);
            const length = getTextLength(json);

            if (length >= 2000) {
                over2000.push({ file, length });
            }
        } catch (e) {
            console.error(`Error reading ${file}:`, e.message);
        }
    });

    over2000.sort((a, b) => b.length - a.length); // Sort descending

    let output = '=== Posts >= 2000 chars ===\n';
    if (over2000.length === 0) output += 'None found.\n';
    else output += over2000.map(p => `- ${p.file}: ${p.length} chars`).join('\n') + '\n';

    fs.writeFileSync('long-posts.txt', output);
    console.log('Results written to long-posts.txt');
}

checkFiles();
