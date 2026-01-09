import Breadcrumbs from '@/components/Breadcrumbs';
import { getContentPages } from '@/lib/content/loader.server';
import PoliciesClient from './PoliciesClient';

export default function PoliciesPage() {
  const policies = getContentPages('policies');
  
  // Extract unique categories from tags
  const categories = Array.from(new Set(
    policies.flatMap(p => p.frontmatter.tags || [])
  ));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Policies & Resources' }]} />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Policies & Resources</h1>
      <p className="text-lg text-gray-600 mb-8">
        Browse company policies, procedures, and resources.
      </p>

      <PoliciesClient policies={policies} categories={categories} />
    </div>
  );
}

