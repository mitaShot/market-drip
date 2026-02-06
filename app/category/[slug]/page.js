import ClientRedirector from '@/components/Redirector/Redirector';

export async function generateStaticParams() {
    // Return the same tags as categories
    const categories = ['stocks', 'etf', 'crypto', 'ai', 'dividends', 'banking'];
    return categories.map(slug => ({ slug }));
}

export default async function CategoryOldPage({ params }) {
    const { slug } = await params;
    // Map /category/[slug] to /tag/[slug] in the new structure
    return <ClientRedirector targetPath={`/tag/${slug}`} />;
}
