'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Card from '@/components/Card';
import Breadcrumbs from '@/components/Breadcrumbs';
import Tabs from '@/components/Tabs';
import { ContentPage, Person } from '@/lib/content/types';

interface SearchClientProps {
  tasks?: ContentPage[];
  policies?: ContentPage[];
  tools?: ContentPage[];
  people?: Person[];
  news?: ContentPage[];
}

function safeLower(s: string | undefined | null): string {
  return (s ?? '').toLowerCase();
}

function matchesQuery(str: string | undefined | null, q: string): boolean {
  return safeLower(str).includes(q);
}

export default function SearchClient({
  tasks = [],
  policies = [],
  tools = [],
  people = [],
  news = [],
}: SearchClientProps) {
  const searchParams = useSearchParams();
  const query = (searchParams?.get('q') ?? '').trim().toLowerCase();
  const [activeTab, setActiveTab] = useState('all');

  const filteredByQuery = useMemo(() => {
    const tasksList = Array.isArray(tasks) ? tasks : [];
    const policiesList = Array.isArray(policies) ? policies : [];
    const toolsList = Array.isArray(tools) ? tools : [];
    const peopleList = Array.isArray(people) ? people : [];
    const newsList = Array.isArray(news) ? news : [];
    if (!query) {
      return {
        tasks: tasksList,
        policies: policiesList,
        tools: toolsList,
        people: peopleList,
        news: newsList,
      };
    }
    return {
      tasks: tasksList.filter((t) => {
        const fm = t?.frontmatter;
        if (!fm) return false;
        return (
          matchesQuery(fm.title, query) ||
          matchesQuery(fm.summary, query) ||
          (Array.isArray(fm.tags) && fm.tags.some((tag) => matchesQuery(tag, query)))
        );
      }),
      policies: policiesList.filter((p) => {
        const fm = p?.frontmatter;
        if (!fm) return false;
        return (
          matchesQuery(fm.title, query) ||
          matchesQuery(fm.summary, query) ||
          (Array.isArray(fm.keyBullets) && fm.keyBullets.some((b) => matchesQuery(b, query)))
        );
      }),
      tools: toolsList.filter((t) => {
        const fm = t?.frontmatter;
        if (!fm) return false;
        return matchesQuery(fm.title, query) || matchesQuery(fm.summary, query);
      }),
      people: peopleList.filter((p) => {
        if (!p) return false;
        return (
          matchesQuery(p.name, query) ||
          matchesQuery(p.role, query) ||
          matchesQuery(p.department, query)
        );
      }),
      news: newsList.filter((n) => {
        const fm = n?.frontmatter;
        if (!fm) return false;
        return (
          matchesQuery(fm.title, query) ||
          matchesQuery(fm.summary, query) ||
          matchesQuery(fm.excerpt, query)
        );
      }),
    };
  }, [query, tasks, policies, tools, people, news]);

  const filteredResults = useMemo(() => {
    switch (activeTab) {
      case 'people':
        return { ...filteredByQuery, tasks: [], policies: [], tools: [], news: [] };
      case 'policies':
        return { ...filteredByQuery, tasks: [], tools: [], people: [], news: [] };
      case 'howto':
        return { ...filteredByQuery, policies: [], tools: [], people: [], news: [] };
      case 'tools':
        return { ...filteredByQuery, tasks: [], policies: [], people: [], news: [] };
      default:
        return filteredByQuery;
    }
  }, [activeTab, filteredByQuery]);

  const totalResults =
    (filteredResults.tasks?.length ?? 0) +
    (filteredResults.policies?.length ?? 0) +
    (filteredResults.tools?.length ?? 0) +
    (filteredResults.people?.length ?? 0) +
    (filteredResults.news?.length ?? 0);

  const taskList = filteredResults.tasks ?? [];
  const policyList = filteredResults.policies ?? [];
  const toolList = filteredResults.tools ?? [];
  const personList = filteredResults.people ?? [];
  const newsItemList = filteredResults.news ?? [];

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Search' }]} />

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Results</h1>

      {query ? (
        <p className="text-lg text-gray-700 mb-6">
          Found {totalResults} result{totalResults !== 1 ? 's' : ''} for &quot;{query}&quot;
        </p>
      ) : (
        <p className="text-lg text-gray-700 mb-6">
          Enter a search query to find people, policies, tasks, tools, and more.
        </p>
      )}

      {query && (
        <>
          <Tabs tabs={[
            { id: 'all', label: 'All' },
            { id: 'people', label: 'People' },
            { id: 'policies', label: 'Policies' },
            { id: 'howto', label: 'How-To' },
            { id: 'tools', label: 'Tools' },
          ]} activeTab={activeTab} onTabChange={setActiveTab} />

          {taskList.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">How-To Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {taskList.map((task) => {
                  const slug = task?.frontmatter?.slug;
                  const title = task?.frontmatter?.title ?? '';
                  const summary = task?.frontmatter?.summary ?? '';
                  if (!slug) return null;
                  return (
                    <Card key={slug} href={`/tasks/${slug}`}>
                      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                      <p className="text-sm text-gray-700 line-clamp-2">{summary}</p>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {policyList.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Policies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {policyList.map((policy) => {
                  const slug = policy?.frontmatter?.slug;
                  const title = policy?.frontmatter?.title ?? '';
                  const summary = policy?.frontmatter?.summary ?? '';
                  if (!slug) return null;
                  return (
                    <Card key={slug} href={`/policies/${slug}`}>
                      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                      <p className="text-sm text-gray-700 line-clamp-2">{summary}</p>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {toolList.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {toolList.map((tool) => {
                  const slug = tool?.frontmatter?.slug;
                  const title = tool?.frontmatter?.title ?? '';
                  const summary = tool?.frontmatter?.summary ?? '';
                  if (!slug) return null;
                  return (
                    <Card key={slug} href={`/tools/${slug}`}>
                      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                      <p className="text-sm text-gray-700 line-clamp-2">{summary}</p>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {personList.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">People</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {personList.map((person) => {
                  const id = person?.id;
                  if (!id) return null;
                  return (
                    <Card key={id} href={`/directory/${id}`}>
                      <h3 className="font-semibold text-gray-900 mb-1">{person?.name ?? ''}</h3>
                      <p className="text-sm text-gray-700 mb-1">{person?.role ?? ''}</p>
                      <p className="text-xs text-gray-600">{person?.department ?? ''}</p>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {newsItemList.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">News</h2>
              <div className="space-y-4">
                {newsItemList.map((item) => {
                  const slug = item?.frontmatter?.slug;
                  const title = item?.frontmatter?.title ?? '';
                  const excerpt = item?.frontmatter?.excerpt ?? item?.frontmatter?.summary ?? '';
                  const date = item?.frontmatter?.date;
                  if (!slug) return null;
                  return (
                    <Card key={slug} href={`/news/${slug}`}>
                      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                      <p className="text-sm text-gray-700">{excerpt}</p>
                      {date && (
                        <p className="text-xs text-gray-600 mt-2">{date}</p>
                      )}
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {totalResults === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-700">No results found for &quot;{query}&quot;.</p>
              <p className="text-sm text-gray-600 mt-2">Try different keywords or browse by category.</p>
            </div>
          )}
        </>
      )}
    </>
  );
}
