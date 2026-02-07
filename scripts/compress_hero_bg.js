const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const srcPath = path.join(process.cwd(), 'public', 'hero-bg.png');
const destPath = path.join(process.cwd(), 'public', 'hero-bg.webp');

console.log(`Compressing: ${srcPath}`);

if (!fs.existsSync(srcPath)) {
    console.error('Source file not found!');
    process.exit(1);
}

sharp(srcPath)
    .webp({ quality: 80 }) // Slightly higher quality for hero background
    .toFile(destPath)
    .then(info => {
        console.log('Compression successful:', info);
        // Optional: Delete original if successful
        // fs.unlinkSync(srcPath); 
        // console.log('Original file deleted.');
    })
    .catch(err => {
        console.error('Compression failed:', err);
        process.exit(1);
    });
