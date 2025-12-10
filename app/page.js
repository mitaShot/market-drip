import Hero from '@/components/Hero/Hero';
import NewsGrid from '@/components/NewsGrid/NewsGrid';
import { getSortedPostsData } from '@/lib/posts';

export default function Home() {
  const allPostsData = getSortedPostsData();
  return (
    <main>
      <Hero />
      <NewsGrid articles={allPostsData} title="Latest Investment News" />
    </main>
  );
}
