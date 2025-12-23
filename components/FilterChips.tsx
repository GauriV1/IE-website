'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface FilterChipsProps {
  filters: string[];
  paramName: string;
  label?: string;
}

export default function FilterChips({ filters, paramName, label }: FilterChipsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeFilter = searchParams.get(paramName);

  const handleFilter = (filter: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter && filter !== 'all') {
      params.set(paramName, filter);
    } else {
      params.delete(paramName);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mb-6">
      {label && <h3 className="text-sm font-medium text-gray-700 mb-3">{label}</h3>}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFilter(null)}
          className={`px-4 py-2 text-sm rounded-full border transition-colors ${
            !activeFilter || activeFilter === 'all'
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilter(filter)}
            className={`px-4 py-2 text-sm rounded-full border transition-colors ${
              activeFilter === filter
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}


