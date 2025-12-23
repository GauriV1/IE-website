'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/Card';
import Breadcrumbs from '@/components/Breadcrumbs';
import FilterChips from '@/components/FilterChips';
import { tools, toolTypes } from '@/lib/mockData';

export default function ToolsPage() {
  const searchParams = useSearchParams();
  const selectedType = searchParams.get('type');

  const toolsByType = toolTypes.reduce((acc, type) => {
    acc[type] = tools.filter(tool => tool.type === type);
    return acc;
  }, {} as Record<string, typeof tools>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Tools & Applications' }]} />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Tools & Applications</h1>
      <p className="text-lg text-gray-600 mb-8">
        Access company tools and applications organized by category.
      </p>

      {/* Filters */}
      <FilterChips 
        filters={toolTypes} 
        paramName="type"
        label="Filter by Type"
      />

      {/* Tools grouped by type */}
      {toolTypes.map((type) => {
        const typeTools = toolsByType[type];
        if (typeTools.length === 0) return null;
        if (selectedType && selectedType !== type) return null;

        return (
          <section key={type} className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{type}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {typeTools.map((tool) => (
                <Card key={tool.id} href={`/tools/${tool.slug}`}>
                  <div className="mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{tool.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{tool.description}</p>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

