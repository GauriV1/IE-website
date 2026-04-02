'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  documents as allDocuments,
  filterDocuments,
  type DocType,
  type DirectoryDocument,
  DOC_TYPE_LABELS,
} from '@/lib/document-directory-data';

const badgeClass: Record<DocType, string> = {
  POL: 'bg-blue-100 text-blue-900 border border-blue-200',
  PRO: 'bg-green-100 text-green-900 border border-green-200',
  GDE: 'bg-teal-100 text-teal-900 border border-teal-200',
  REF: 'bg-gray-200 text-gray-800 border border-gray-300',
  FRM: 'bg-orange-100 text-orange-900 border border-orange-200',
  AGR: 'bg-purple-100 text-purple-900 border border-purple-200',
};

interface DocumentDirectorySectionProps {
  /** When true, show a shorter intro (homepage embed) */
  embedded?: boolean;
}

export default function DocumentDirectorySection({ embedded = false }: DocumentDirectorySectionProps) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<DocType | 'all'>('all');

  const filtered = useMemo(
    () => filterDocuments(allDocuments, query, typeFilter),
    [query, typeFilter]
  );

  return (
    <section
      className={`${embedded ? '' : 'py-10'} rounded-xl border-2 border-whitman-navy bg-white shadow-sm`}
      aria-labelledby="document-directory-heading"
    >
      <div className={embedded ? '' : 'p-6 md:p-8'}>
        <h2 id="document-directory-heading" className="text-2xl md:text-3xl font-bold text-whitman-navy mb-2">
          A–Z Document Directory
        </h2>
        <p className="text-whitman-gray mb-6 max-w-3xl">
          Search policies, procedures, guides, forms, and references. This is a document directory—not a people directory.
        </p>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center text-whitman-gray" aria-hidden>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documents, policies, forms…"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-whitman-blue focus:border-whitman-blue"
              aria-label="Search documents"
            />
          </div>
          <div className="lg:w-56">
            <label htmlFor="doc-type-filter" className="sr-only">
              Filter by type
            </label>
            <select
              id="doc-type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as DocType | 'all')}
              className="w-full py-3 px-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-whitman-blue focus:border-whitman-blue"
            >
              <option value="all">All types</option>
              {(Object.keys(DOC_TYPE_LABELS) as DocType[]).map((t) => (
                <option key={t} value={t}>
                  {t} — {DOC_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6" role="region" aria-label="Document list">
          {filtered.length === 0 ? (
            <p className="text-whitman-gray py-8 text-center">No documents match your search.</p>
          ) : (
            <ul className="space-y-0">
              {filtered.map((doc) => (
                <li key={doc.id}>
                  <DirectoryRow doc={doc} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function DirectoryRow({ doc }: { doc: DirectoryDocument }) {
  const isExternal = doc.href.startsWith('http');
  const inner = (
    <>
      <span className="font-medium text-whitman-navy group-hover:text-whitman-blue min-w-0 flex-1">
        {doc.name}
      </span>
      <span
        className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded ${badgeClass[doc.type]}`}
        title={DOC_TYPE_LABELS[doc.type]}
      >
        {doc.type}
      </span>
      {doc.lastUpdated && (
        <span className="text-xs text-gray-600 shrink-0 whitespace-nowrap">Updated {doc.lastUpdated}</span>
      )}
    </>
  );

  const className =
    'group flex flex-wrap sm:flex-nowrap items-center gap-3 py-3 border-b border-gray-100 hover:bg-whitman-lightblue/40 rounded px-2 -mx-2 transition-colors';

  if (isExternal) {
    return (
      <a href={doc.href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
        <span className="text-xs text-whitman-blue shrink-0" aria-hidden>
          ↗
        </span>
      </a>
    );
  }

  return (
    <Link href={doc.href} className={className}>
      {inner}
    </Link>
  );
}
