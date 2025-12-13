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

    // Filter. Category can now be an object { en: "Stocks", ko: "주식" }
    const filteredArticles = allPosts.filter(article => {
        if (!article.category) return false;

        // Handle both string (legacy) and object (new i18n) formats
        if (typeof article.category === 'string') {
            return article.category.toLowerCase() === categoryName.toLowerCase();
        }

        // Check all language variations
        const categoryValues = Object.values(article.category);
        return categoryValues.some(cat =>
            cat && cat.toLowerCase() === categoryName.toLowerCase()
        );
    });

    return (
        <main>
            <div className="container" style={{ paddingTop: '2rem' }}>
                <NewsGrid articles={filteredArticles} title={`${categoryName} News`} />
            </div>
        </main>
    );
}
