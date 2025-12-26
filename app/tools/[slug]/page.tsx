import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { tools } from '@/lib/mockData';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export default function ToolDetailPage({ params }: PageProps) {
  const tool = tools.find(t => t.slug === params.slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'Tools & Applications', href: '/tools' },
        { label: tool.name }
      ]} />

      <div className="mb-6">
        <span className="inline-block text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full mb-4">
          {tool.type}
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{tool.name}</h1>
        <p className="text-lg text-gray-600">{tool.description}</p>
      </div>

      {/* Open Tool Button */}
      <div className="mb-8">
        <a
          href={tool.url || '#'}
          className="inline-block bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          Open Tool →
        </a>
      </div>

      {/* Back to tools */}
      <div className="pt-8 border-t border-gray-200">
        <Link href="/tools" className="text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Tools & Applications
        </Link>
      </div>
    </div>
  );
}


