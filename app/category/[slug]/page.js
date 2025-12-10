import NewsGrid from '@/components/NewsGrid/NewsGrid';
import { getSortedPostsData } from '@/lib/posts';

export async function generateStaticParams() {
    const categories = ['stocks', 'retirement', 'banking', 'credit-cards'];
    return categories.map((slug) => ({
        slug: slug,
    }));
}

function getCategoryName(slug) {
    const map = {
        'stocks': 'Stocks',
        'retirement': 'Retirement',
        'banking': 'Banking',
        'credit-cards': 'Credit Cards'
    };
    return map[slug] || slug;
}

export default async function CategoryPage({ params }) {
    const { slug } = await params;
    const categoryName = getCategoryName(slug);
    const allPosts = getSortedPostsData();

    // Filter. Category in MD is strict string.
    const filteredArticles = allPosts.filter(article =>
        article.category && article.category.toLowerCase() === categoryName.toLowerCase()
    );

    return (
        <main>
            <div className="container" style={{ paddingTop: '2rem' }}>
                <NewsGrid articles={filteredArticles} title={`${categoryName} News`} />
            </div>
        </main>
    );
}
