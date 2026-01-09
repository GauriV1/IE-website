'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/Card';
import FilterChips from '@/components/FilterChips';
import { ContentPage } from '@/lib/content/types';

interface ToolsClientProps {
  tools: ContentPage[];
  toolTypes: string[];
}

export default function ToolsClient({ tools, toolTypes }: ToolsClientProps) {
  const searchParams = useSearchParams();
  const selectedType = searchParams.get('type');

  const toolsByType = useMemo(() => {
    return toolTypes.reduce((acc, type) => {
      acc[type] = tools.filter(tool => tool.frontmatter.type === type);
      return acc;
    }, {} as Record<string, typeof tools>);
  }, [tools, toolTypes]);

  return (
    <>
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
                <Card key={tool.frontmatter.slug} href={`/tools/${tool.frontmatter.slug}`}>
                  <div className="mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{tool.frontmatter.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{tool.frontmatter.summary}</p>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}

