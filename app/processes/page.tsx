import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { documents, DOC_TYPE_LABELS, type DocType } from '@/lib/document-directory-data';

export const metadata: Metadata = {
  title: 'Processes | Division of Inclusive Excellence',
  description: 'Official division and college policies and step-by-step operational procedures for IE.',
};

function DocList({ items }: { items: { id: string; name: string; href: string; type: DocType; lastUpdated?: string }[] }) {
  if (items.length === 0) return <p className="text-whitman-gray">No entries yet.</p>;
  return (
    <ul className="space-y-3">
      {items.map((d) => {
        const ext = d.href.startsWith('http');
        return (
          <li key={d.id}>
            {ext ? (
              <a href={d.href} target="_blank" rel="noopener noreferrer" className="text-whitman-blue hover:underline font-medium">
                {d.name} ↗
              </a>
            ) : (
              <Link href={d.href} className="text-whitman-blue hover:underline font-medium">
                {d.name}
              </Link>
            )}
            <span className="text-sm text-whitman-gray ml-2">
              ({d.type} — {DOC_TYPE_LABELS[d.type]}
              {d.lastUpdated ? ` · Updated ${d.lastUpdated}` : ''})
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default function ProcessesPage() {
  const policies = documents.filter((d) => d.type === 'POL');
  const procedures = documents.filter((d) => d.type === 'PRO');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Processes' }]} />
      <h1 className="text-3xl font-bold text-whitman-navy mb-4">Processes</h1>
      <p className="text-lg text-whitman-gray mb-10">
        This page groups official policies and procedures that appear in the handbook. For a searchable list of all document types (including guides, forms, and references), use the{' '}
        <Link href="/#directory" className="text-whitman-blue hover:underline">
          A–Z Document Directory
        </Link>{' '}
        on the home page.
      </p>

      <section className="mb-12" aria-labelledby="policies-heading">
        <h2 id="policies-heading" className="text-2xl font-semibold text-whitman-navy mb-4 border-b border-whitman-navy pb-2">
          Policies
        </h2>
        <p className="text-whitman-gray mb-4">Official division and college policies with brief context in the directory listing.</p>
        <DocList items={policies} />
      </section>

      <section aria-labelledby="procedures-heading">
        <h2 id="procedures-heading" className="text-2xl font-semibold text-whitman-navy mb-4 border-b border-whitman-navy pb-2">
          Procedures
        </h2>
        <p className="text-whitman-gray mb-4">Step-by-step operational procedures and recurring deadlines.</p>
        <DocList items={procedures} />
      </section>
    </div>
  );
}
