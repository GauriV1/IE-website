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
  const tasks = getContentPages('tasks');
  return tasks.map((task) => ({
    slug: task.frontmatter.slug,
  }));
}

export default function TaskDetailPage({ params }: PageProps) {
  const task = getContentPage('tasks', params.slug);

  if (!task) {
    notFound();
  }

  // Get related policies
  const relatedPolicies = task.frontmatter.relatedPolicies
    ? task.frontmatter.relatedPolicies
        .map(slug => getContentPage('policies', slug))
        .filter(Boolean)
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'Tasks & Services', href: '/tasks' },
        { label: task.frontmatter.title }
      ]} />

      <div className="mb-6">
        {task.frontmatter.tags && task.frontmatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {task.frontmatter.tags.map((tag) => (
              <span key={tag} className="inline-block text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{task.frontmatter.title}</h1>
        <p className="text-lg text-gray-600">{task.frontmatter.summary}</p>
      </div>

      {/* Step-by-step guide */}
      {task.frontmatter.steps && task.frontmatter.steps.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How-To Guide</h2>
          <ol className="space-y-4">
            {task.frontmatter.steps.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                  {index + 1}
                </span>
                <p className="text-gray-700 pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Main content */}
      {task.content && (
        <section className="mb-8">
          <MarkdownContent content={task.content} />
        </section>
      )}

      {/* Related Forms */}
      {task.frontmatter.relatedForms && task.frontmatter.relatedForms.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Forms</h2>
          <ul className="space-y-2">
            {task.frontmatter.relatedForms.map((form, index) => (
              <li key={index} className="text-gray-700">
                • {form}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related Policies */}
      {relatedPolicies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Policies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedPolicies.map((policy) => (
              <Card key={policy.frontmatter.slug} href={`/policies/${policy.frontmatter.slug}`}>
                <h3 className="font-semibold text-gray-900 mb-2">{policy.frontmatter.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {policy.frontmatter.summary}
                </p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Contacts */}
      {task.frontmatter.contacts && task.frontmatter.contacts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Contact:</p>
            <ul className="space-y-1">
              {task.frontmatter.contacts.map((contact, index) => {
                const contactStr = typeof contact === 'string' ? contact : contact.email;
                return (
                  <li key={index} className="text-gray-900">
                    <a href={`mailto:${contactStr}`} className="text-blue-600 hover:text-blue-800">
                      {contactStr}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* Back to tasks */}
      <div className="pt-8 border-t border-gray-200">
        <Link href="/tasks" className="text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Tasks & Services
        </Link>
      </div>
    </div>
  );
}


