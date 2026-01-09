import { getContentPages, getPeople, searchContent } from '@/lib/content/loader.server';
import SearchClient from './SearchClient';

interface PageProps {
  searchParams: {
    q?: string;
  };
}

export default function SearchPage({ searchParams }: PageProps) {
  const query = searchParams.q || '';

  // Search content pages
  const tasks = query ? searchContent(query, ['tasks']) : [];
  const policies = query ? searchContent(query, ['policies']) : [];
  const tools = query ? searchContent(query, ['tools']) : [];
  const news = query ? searchContent(query, ['news']) : [];

  // Search people
  const people = getPeople();
  const lowerQuery = query.toLowerCase();
  const filteredPeople = query ? people.filter(person =>
    person.name.toLowerCase().includes(lowerQuery) ||
    person.role.toLowerCase().includes(lowerQuery) ||
    person.department.toLowerCase().includes(lowerQuery)
  ) : [];

  const allResults = {
    tasks,
    policies,
    tools,
    people: filteredPeople,
    news,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SearchClient allResults={allResults} />
    </div>
  );
}
