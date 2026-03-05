'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/Card';
import FilterChips from '@/components/FilterChips';
import { ContentPage } from '@/lib/content/types';

interface PoliciesClientProps {
  policies: ContentPage[];
  categories: string[];
}

export default function PoliciesClient({ policies, categories }: PoliciesClientProps) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const selectedCategory = searchParams?.get('category') ?? null;

  const filteredPolicies = useMemo(() => {
    const list = policies ?? [];
    const q = (searchQuery ?? '').trim().toLowerCase();
    return list.filter((policy) => {
      const fm = policy?.frontmatter;
      if (!fm) return false;
      const title = (fm.title ?? '').toLowerCase();
      const summary = (fm.summary ?? '').toLowerCase();
      const bullets = fm.keyBullets ?? [];
      const tags = fm.tags ?? [];
      const matchesSearch =
        q === '' ||
        title.includes(q) ||
        summary.includes(q) ||
        bullets.some((b) => (b ?? '').toLowerCase().includes(q));
      const matchesCategory = !selectedCategory || tags.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, policies]);

  return (
    <>
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search policies..."
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Filters */}
      {(categories ?? []).length > 0 && (
        <FilterChips 
          filters={categories} 
          paramName="category"
          label="Filter by Category"
        />
      )}

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(filteredPolicies ?? []).map((policy) => {
          const slug = policy?.frontmatter?.slug;
          if (!slug) return null;
          return (
            <Card key={slug} href={`/policies/${slug}`}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 flex-1">{policy?.frontmatter?.title ?? ''}</h3>
                {policy?.frontmatter?.tags?.length ? (
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded ml-2">
                    {policy.frontmatter.tags[0]}
                  </span>
                ) : null}
              </div>
              {policy?.frontmatter?.lastUpdated ? (
                <p className="text-xs text-gray-600 mb-3">Last updated: {policy.frontmatter.lastUpdated}</p>
              ) : null}
              <p className="text-sm text-gray-700 line-clamp-3">{policy?.frontmatter?.summary ?? ''}</p>
              {policy?.frontmatter?.keyBullets?.length ? (
                <ul className="text-sm text-gray-700 space-y-1 mt-2">
                  {policy.frontmatter.keyBullets.slice(0, 3).map((bullet, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="line-clamp-1">{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Card>
          );
        })}
      </div>

      {filteredPolicies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No policies found matching your criteria.</p>
        </div>
      )}
    </>
  );
}

