import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { people } from '@/lib/mockData';

interface PageProps {
  params: {
    id: string;
  };
}

export default function PersonDetailPage({ params }: PageProps) {
  const person = people.find(p => p.id === params.id);

  if (!person) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'Directory', href: '/directory' },
        { label: person.name }
      ]} />

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl font-semibold text-gray-600">
              {person.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{person.name}</h1>
          <p className="text-lg text-gray-600 mb-1">{person.role}</p>
          <p className="text-gray-500">{person.department}</p>
        </div>

        <div className="space-y-4 pt-6 border-t border-gray-200">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
            <a href={`mailto:${person.email}`} className="text-blue-600 hover:text-blue-800">
              {person.email}
            </a>
          </div>
          {person.phone && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
              <a href={`tel:${person.phone}`} className="text-gray-900">
                {person.phone}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Back to directory */}
      <div className="pt-8">
        <Link href="/directory" className="text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Directory
        </Link>
      </div>
    </div>
  );
}


