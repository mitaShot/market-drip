import { getAllPostIds } from '@/lib/posts';
import ClientRedirector from '@/components/Redirector/Redirector';

export async function generateStaticParams() {
    const paths = getAllPostIds();
    const ids = Array.from(new Set(paths.map(p => p.params.id)));
    return ids.map(id => ({ id }));
}

export default async function ArticleOldPage({ params }) {
    const { id } = await params;
    return <ClientRedirector targetPath={`/article/${id}`} />;
}
