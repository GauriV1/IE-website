import Link from 'next/link';
import Card from '@/components/Card';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getContentPages } from '@/lib/content/loader.server';

export default function NewsPage() {
  const newsItems = getContentPages('news');
  
  // Sort by date (newest first)
  const sortedNews = [...newsItems].sort((a, b) => {
    const dateA = a.frontmatter.date || '';
    const dateB = b.frontmatter.date || '';
    return dateB.localeCompare(dateA);
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'News' }]} />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">News & Announcements</h1>
      <p className="text-lg text-gray-600 mb-8">
        Stay up to date with company news, announcements, and updates.
      </p>

      <div className="space-y-4">
        {sortedNews.map((item) => (
          <Card key={item.frontmatter.slug} href={`/news/${item.frontmatter.slug}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{item.frontmatter.title}</h2>
                <p className="text-gray-600 mb-3">{item.frontmatter.excerpt || item.frontmatter.summary}</p>
                {item.frontmatter.date && (
                  <p className="text-sm text-gray-500">{item.frontmatter.date}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}




