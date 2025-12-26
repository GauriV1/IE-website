import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import Card from '@/components/Card';
import { policies, tasks } from '@/lib/mockData';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return policies.map((policy) => ({
    slug: policy.slug,
  }));
}

export default function PolicyDetailPage({ params }: PageProps) {
  const policy = policies.find(p => p.slug === params.slug);

  if (!policy) {
    notFound();
  }

  const relatedTasks = policy.relatedTasks
    ? tasks.filter(t => policy.relatedTasks?.includes(t.slug))
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'Policies & Resources', href: '/policies' },
        { label: policy.title }
      ]} />

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-block text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {policy.category}
          </span>
          <span className="text-sm text-gray-500">Last updated: {policy.lastUpdated}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{policy.title}</h1>
      </div>

      {/* Key Bullets */}
      <section className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Points</h2>
        <ul className="space-y-2">
          {policy.keyBullets.map((bullet, index) => (
            <li key={index} className="flex items-start text-gray-700">
              <span className="mr-3 text-blue-600 font-bold">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Sections */}
      <section className="mb-8">
        {policy.sections.map((section, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">{section.title}</h2>
            <p className="text-gray-700 leading-relaxed">{section.content}</p>
          </div>
        ))}
      </section>

      {/* Related Tasks */}
      {relatedTasks.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedTasks.map((task) => (
              <Card key={task.id} href={`/tasks/${task.slug}`}>
                <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{task.summary}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Related Forms */}
      {policy.relatedForms && policy.relatedForms.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Forms</h2>
          <ul className="space-y-2">
            {policy.relatedForms.map((form, index) => (
              <li key={index} className="text-gray-700">
                • {form}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Back to policies */}
      <div className="pt-8 border-t border-gray-200">
        <Link href="/policies" className="text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Policies & Resources
        </Link>
      </div>
    </div>
  );
}


