'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/Card';
import Breadcrumbs from '@/components/Breadcrumbs';
import FilterChips from '@/components/FilterChips';
import { policies, policyCategories } from '@/lib/mockData';

export default function PoliciesPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const selectedCategory = searchParams.get('category');

  const filteredPolicies = useMemo(() => {
    return policies.filter(policy => {
      const matchesSearch = searchQuery === '' || 
        policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.keyBullets.some(bullet => bullet.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = !selectedCategory || policy.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Policies & Resources' }]} />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Policies & Resources</h1>
      <p className="text-lg text-gray-600 mb-8">
        Browse company policies, procedures, and resources.
      </p>

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
      <FilterChips 
        filters={policyCategories} 
        paramName="category"
        label="Filter by Category"
      />

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPolicies.map((policy) => (
          <Card key={policy.id} href={`/policies/${policy.slug}`}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 flex-1">{policy.title}</h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded ml-2">
                {policy.category}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">Last updated: {policy.lastUpdated}</p>
            <ul className="text-sm text-gray-600 space-y-1">
              {policy.keyBullets.slice(0, 3).map((bullet, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span className="line-clamp-1">{bullet}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {filteredPolicies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No policies found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

