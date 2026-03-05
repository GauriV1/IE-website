import { Suspense } from 'react';
import { getContentPages } from '@/lib/content/loader.server';
import { getPeople } from '@/lib/content/loader.server';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import SearchClient from './SearchClient';

export default function SearchPage() {
  const tasks = getContentPages('tasks');
  const policies = getContentPages('policies');
  const tools = getContentPages('tools');
  const news = getContentPages('news');
  const people = getPeople();

  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="text-gray-900 p-8">Loading...</div>}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SearchClient
            tasks={tasks}
            policies={policies}
            tools={tools}
            people={people}
            news={news}
          />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
