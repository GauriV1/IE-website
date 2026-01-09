import Breadcrumbs from '@/components/Breadcrumbs';
import { getPeople } from '@/lib/content/loader.server';
import DirectoryClient from './DirectoryClient';

export default function DirectoryPage() {
  const people = getPeople();
  const departments = Array.from(new Set(people.map(p => p.department)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Directory' }]} />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Employee Directory</h1>
      <p className="text-lg text-gray-600 mb-8">
        Find colleagues and team members across the organization.
      </p>

      <DirectoryClient people={people} departments={departments} />
    </div>
  );
}

