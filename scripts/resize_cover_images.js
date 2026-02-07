const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(process.cwd(), 'public', 'posts', 'img');
const TARGET_WIDTH = 800;
const TARGET_HEIGHT = 450;

async function resizeCoverImages() {
    const files = fs.readdirSync(imgDir).filter(f => f.includes('_cover'));

    console.log(`Found ${files.length} cover images to resize...`);

    for (const file of files) {
        const srcPath = path.join(imgDir, file);
        const ext = path.extname(file);
        const baseName = path.basename(file, ext);

        // Always output as WebP for best compression
        const destPath = path.join(imgDir, `${baseName}.webp`);

        try {
            const info = await sharp(srcPath)
                .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: 'cover' })
                .webp({ quality: 80 })
                .toFile(destPath + '.tmp');

            // If original was not WebP, we need to handle the naming
            if (ext.toLowerCase() !== '.webp') {
                // Delete the original non-webp file
                fs.unlinkSync(srcPath);
                // Rename temp to final
                fs.renameSync(destPath + '.tmp', destPath);
                console.log(`✅ Resized and converted: ${file} -> ${baseName}.webp (${info.size} bytes)`);
            } else {
                // Overwrite the original webp
                fs.unlinkSync(srcPath);
                fs.renameSync(destPath + '.tmp', destPath);
                console.log(`✅ Resized: ${file} (${info.size} bytes)`);
            }
        } catch (err) {
            console.error(`❌ Failed to resize ${file}:`, err.message);
        }
    }

    console.log('\nDone! All cover images resized to 800x450.');
}

resizeCoverImages();
