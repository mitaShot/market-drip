import { getSortedPostsData } from './lib/posts.js';

async function diagnose() {
    try {
        const posts = getSortedPostsData();
        console.log(`Total posts found: ${posts.length}`);

        const billPost = posts.find(p => p.id === 'bill-stock-surge-earnings-buyout-rumors-analysis');
        if (billPost) {
            console.log('✅ bill-stock-surge found:');
            console.log(JSON.stringify(billPost, null, 2));
        } else {
            console.log('❌ bill-stock-surge NOT found in sorted posts data.');
        }

    } catch (error) {
        console.error('❌ Error during diagnosis:', error);
    }
}

diagnose();
