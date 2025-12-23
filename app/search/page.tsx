'use client';

import { Suspense } from 'react';
import SearchContent from './SearchContent';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
