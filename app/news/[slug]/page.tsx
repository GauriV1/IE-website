import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { newsItems } from '@/lib/mockData';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return newsItems.map((item) => ({
    slug: item.slug,
  }));
}

export default function NewsDetailPage({ params }: PageProps) {
  const item = newsItems.find(n => n.slug === params.slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'News', href: '/news' },
        { label: item.title }
      ]} />

      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-4">{item.date}</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h1>
      </div>

      <div className="prose max-w-none">
        <p className="text-lg text-gray-600 mb-6">{item.excerpt}</p>
        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
          {item.content}
        </div>
      </div>

      {/* Back to news */}
      <div className="pt-8 border-t border-gray-200 mt-8">
        <Link href="/news" className="text-blue-600 hover:text-blue-800 font-medium">
          ← Back to News & Announcements
        </Link>
      </div>
    </div>
  );
}


