import Link from 'next/link';
import Card from '@/components/Card';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getContentPages } from '@/lib/content/loader.server';

export default function TeamsPage() {
  const teams = getContentPages('teams');
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Teams' }]} />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Departments & Teams</h1>
      <p className="text-lg text-gray-600 mb-8">
        Learn about our departments, their missions, and how to get in touch.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card key={team.frontmatter.slug} href={`/teams/${team.frontmatter.slug}`}>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{team.frontmatter.title}</h2>
            <p className="text-sm text-gray-600 line-clamp-3 mb-4">{team.frontmatter.mission || team.frontmatter.summary}</p>
            {team.frontmatter.contacts && team.frontmatter.contacts.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Key Contacts:</p>
                <ul className="space-y-1">
                  {team.frontmatter.contacts.slice(0, 2).map((contact, idx) => {
                    const contactStr = typeof contact === 'string' ? contact : `${contact.name} - ${contact.role}`;
                    return (
                      <li key={idx} className="text-sm text-gray-700">
                        {contactStr}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}




