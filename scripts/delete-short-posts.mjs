import fs from 'fs';
import path from 'path';

const postsDir = path.join(process.cwd(), 'posts');

const targetIds = [
    'ai-semiconductor-stock-drivers-20260118',
    'tesla-stock-analysis-waymo-competition-insider-selling-20260214',
    'coinbase-coin-earnings-miss-buyback-rally-20260213',
    'nvidia-stock-xai-apollo-deal-analysis',
    'stock-market-update-20260118',
    'sndk-stock-surge-earnings-volume-warning',
    'bitcoin-crash-81k-liquidation-iran-risk-20260202',
    'crypto-market-sentiment-key-drivers-20260118',
    'capital-flows-signals-investors-20260118'
];

if (!fs.existsSync(postsDir)) {
    console.error('Posts directory does not exist.');
    process.exit(1);
}

const files = fs.readdirSync(postsDir);
let deletedCount = 0;

targetIds.forEach(id => {
    // Match files that start with the ID followed by _, ., or are exactly the ID (unlikely for json but possible)
    // We strictly want to delete variations like ID_en.json, ID_ko.json, ID_ja.json
    const matchingFiles = files.filter(file =>
        file.startsWith(id + '_') || file === id + '.json'
    );

    matchingFiles.forEach(file => {
        const filePath = path.join(postsDir, file);
        try {
            fs.unlinkSync(filePath);
            console.log(`Deleted: ${file}`);
            deletedCount++;
        } catch (error) {
            console.error(`Failed to delete ${file}:`, error.message);
        }
    });
});

console.log(`Total files deleted: ${deletedCount}`);
