import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import Card from '@/components/Card';
import { getContentPage, getContentPages } from '@/lib/content/loader.server';
import { MarkdownContent } from '@/lib/content/markdown';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const policies = getContentPages('policies');
  return policies.map((policy) => ({
    slug: policy.frontmatter.slug,
  }));
}

export default function PolicyDetailPage({ params }: PageProps) {
  const policy = getContentPage('policies', params.slug);

  if (!policy) {
    notFound();
  }

  // Get related tasks
  const relatedTasks = policy.frontmatter.relatedTasks
    ? policy.frontmatter.relatedTasks
        .map(slug => getContentPage('tasks', slug))
        .filter((task): task is NonNullable<typeof task> => task !== null)
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'Policies & Resources', href: '/policies' },
        { label: policy.frontmatter.title }
      ]} />

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {policy.frontmatter.tags && policy.frontmatter.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {policy.frontmatter.tags.map((tag) => (
                <span key={tag} className="inline-block text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {policy.frontmatter.lastUpdated && (
            <span className="text-sm text-gray-500">Last updated: {policy.frontmatter.lastUpdated}</span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{policy.frontmatter.title}</h1>
        <p className="text-lg text-gray-600 mb-6">{policy.frontmatter.summary}</p>
      </div>

      {/* Key Bullets */}
      {policy.frontmatter.keyBullets && policy.frontmatter.keyBullets.length > 0 && (
        <section className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Points</h2>
          <ul className="space-y-2">
            {policy.frontmatter.keyBullets.map((bullet, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="mr-3 text-blue-600 font-bold">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Main content */}
      {policy.content && (
        <section className="mb-8">
          <MarkdownContent content={policy.content} />
        </section>
      )}

      {/* Sections (if no markdown content) */}
      {policy.frontmatter.sections && policy.frontmatter.sections.length > 0 && (
        <section className="mb-8">
          {policy.frontmatter.sections.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">{section.title}</h2>
              <p className="text-gray-700 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </section>
      )}

      {/* Related Tasks */}
      {relatedTasks.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedTasks.map((task) => (
              <Card key={task.frontmatter.slug} href={`/tasks/${task.frontmatter.slug}`}>
                <h3 className="font-semibold text-gray-900 mb-2">{task.frontmatter.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{task.frontmatter.summary}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Related Forms */}
      {policy.frontmatter.relatedForms && policy.frontmatter.relatedForms.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Forms</h2>
          <ul className="space-y-2">
            {policy.frontmatter.relatedForms.map((form, index) => (
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


