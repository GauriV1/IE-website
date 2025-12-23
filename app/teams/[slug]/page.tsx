import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import Card from '@/components/Card';
import { teams, tasks, policies, tools } from '@/lib/mockData';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function TeamDetailPage({ params }: PageProps) {
  const team = teams.find(t => t.slug === params.slug);

  if (!team) {
    notFound();
  }

  const relatedTasksList = team.relatedTasks
    ? tasks.filter(t => team.relatedTasks?.includes(t.slug))
    : [];
  
  const relatedPoliciesList = team.relatedPolicies
    ? policies.filter(p => team.relatedPolicies?.includes(p.slug))
    : [];
  
  const relatedToolsList = team.relatedTools
    ? tools.filter(t => team.relatedTools?.includes(t.slug))
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'Teams', href: '/teams' },
        { label: team.name }
      ]} />

      <h1 className="text-3xl font-bold text-gray-900 mb-4">{team.name}</h1>

      {/* Mission */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">What We Do</h2>
        <p className="text-gray-700 leading-relaxed">{team.mission}</p>
      </section>

      {/* Key Contacts */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Contacts</h2>
        <div className="bg-gray-50 rounded-lg p-6">
          <ul className="space-y-4">
            {team.contacts.map((contact, index) => (
              <li key={index}>
                <div className="font-semibold text-gray-900">{contact.name}</div>
                <div className="text-sm text-gray-600">{contact.role}</div>
                <a href={`mailto:${contact.email}`} className="text-sm text-blue-600 hover:text-blue-800">
                  {contact.email}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Related Tasks */}
      {relatedTasksList.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedTasksList.map((task) => (
              <Card key={task.id} href={`/tasks/${task.slug}`}>
                <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{task.summary}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Related Policies */}
      {relatedPoliciesList.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Policies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedPoliciesList.map((policy) => (
              <Card key={policy.id} href={`/policies/${policy.slug}`}>
                <h3 className="font-semibold text-gray-900 mb-2">{policy.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {policy.keyBullets[0]}
                </p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Related Tools */}
      {relatedToolsList.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedToolsList.map((tool) => (
              <Card key={tool.id} href={`/tools/${tool.slug}`}>
                <h3 className="font-semibold text-gray-900 mb-2">{tool.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{tool.description}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Back to teams */}
      <div className="pt-8 border-t border-gray-200">
        <Link href="/teams" className="text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Teams
        </Link>
      </div>
    </div>
  );
}


