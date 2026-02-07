const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const srcPath = path.join(process.cwd(), 'public', 'posts', 'img', 'palantir-pltr-earnings-guidance-ai-growth-20260118_cover.webp');
const destPath = path.join(process.cwd(), 'public', 'posts', 'img', 'palantir-pltr-earnings-guidance-ai-growth-20260118_cover_small.webp');

console.log(`Compressing: ${srcPath}`);

sharp(srcPath)
    .webp({ quality: 75 })
    .toFile(destPath)
    .then(info => {
        console.log('Compression successful:', info);
    })
    .catch(err => {
        console.error('Compression failed:', err);
        process.exit(1);
    });
