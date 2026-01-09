'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/Card';
import Breadcrumbs from '@/components/Breadcrumbs';
import Tabs from '@/components/Tabs';
import { ContentPage, Person } from '@/lib/content/types';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('all');
  const [allResults, setAllResults] = useState<{
    tasks: ContentPage[];
    policies: ContentPage[];
    tools: ContentPage[];
    people: Person[];
    news: ContentPage[];
  }>({
    tasks: [],
    policies: [],
    tools: [],
    people: [],
    news: [],
  });

  // Load content on client side for static export
  useEffect(() => {
    // For static export, we'll need to fetch content data
    // This is a placeholder - in production, you'd load from a JSON file or API
    setAllResults({
      tasks: [],
      policies: [],
      tools: [],
      people: [],
      news: [],
    });
  }, []);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'people', label: 'People' },
    { id: 'policies', label: 'Policies' },
    { id: 'howto', label: 'How-To' },
    { id: 'tools', label: 'Tools' },
  ];

  const getFilteredResults = () => {
    switch (activeTab) {
      case 'people':
        return { ...allResults, tasks: [], policies: [], tools: [], news: [] };
      case 'policies':
        return { ...allResults, tasks: [], tools: [], people: [], news: [] };
      case 'howto':
        return { ...allResults, policies: [], tools: [], people: [], news: [] };
      case 'tools':
        return { ...allResults, tasks: [], policies: [], people: [], news: [] };
      default:
        return allResults;
    }
  };

  const filteredResults = getFilteredResults();
  const totalResults = 
    filteredResults.tasks.length +
    filteredResults.policies.length +
    filteredResults.tools.length +
    filteredResults.people.length +
    filteredResults.news.length;

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Search' }]} />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Results</h1>
      
      {query && (
        <p className="text-lg text-gray-600 mb-6">
          Found {totalResults} result{totalResults !== 1 ? 's' : ''} for &quot;{query}&quot;
        </p>
      )}

      {!query && (
        <p className="text-lg text-gray-600 mb-6">
          Enter a search query to find people, policies, tasks, tools, and more.
        </p>
      )}

      {query && (
        <>
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tasks / How-To */}
          {filteredResults.tasks.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">How-To Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResults.tasks.map((task) => (
                  <Card key={task.frontmatter.slug} href={`/tasks/${task.frontmatter.slug}`}>
                    <h3 className="font-semibold text-gray-900 mb-2">{task.frontmatter.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{task.frontmatter.summary}</p>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Policies */}
          {filteredResults.policies.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Policies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResults.policies.map((policy) => (
                  <Card key={policy.frontmatter.slug} href={`/policies/${policy.frontmatter.slug}`}>
                    <h3 className="font-semibold text-gray-900 mb-2">{policy.frontmatter.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {policy.frontmatter.summary}
                    </p>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Tools */}
          {filteredResults.tools.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResults.tools.map((tool) => (
                  <Card key={tool.frontmatter.slug} href={`/tools/${tool.frontmatter.slug}`}>
                    <h3 className="font-semibold text-gray-900 mb-2">{tool.frontmatter.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{tool.frontmatter.summary}</p>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* People */}
          {filteredResults.people.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">People</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResults.people.map((person) => (
                  <Card key={person.id} href={`/directory/${person.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-1">{person.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{person.role}</p>
                    <p className="text-xs text-gray-500">{person.department}</p>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* News */}
          {filteredResults.news.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">News</h2>
              <div className="space-y-4">
                {filteredResults.news.map((item) => (
                  <Card key={item.frontmatter.slug} href={`/news/${item.frontmatter.slug}`}>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.frontmatter.title}</h3>
                    <p className="text-sm text-gray-600">{item.frontmatter.excerpt || item.frontmatter.summary}</p>
                    {item.frontmatter.date && (
                      <p className="text-xs text-gray-500 mt-2">{item.frontmatter.date}</p>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          )}

          {totalResults === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No results found for &quot;{query}&quot;.</p>
              <p className="text-sm text-gray-500 mt-2">Try different keywords or browse by category.</p>
            </div>
          )}
        </>
      )}
    </>
  );
}

