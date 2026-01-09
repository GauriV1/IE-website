'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/Card';
import FilterChips from '@/components/FilterChips';
import { Person } from '@/lib/content/types';

interface DirectoryClientProps {
  people: Person[];
  departments: string[];
}

export default function DirectoryClient({ people, departments }: DirectoryClientProps) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const selectedDepartment = searchParams.get('department');

  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      const matchesSearch = searchQuery === '' || 
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = !selectedDepartment || person.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }, [searchQuery, selectedDepartment, people]);

  return (
    <>
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, role, or department..."
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Filters */}
      <FilterChips 
        filters={departments} 
        paramName="department"
        label="Filter by Department"
      />

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPeople.map((person) => (
          <Card key={person.id} href={`/directory/${person.id}`}>
            <h3 className="font-semibold text-gray-900 mb-1">{person.name}</h3>
            <p className="text-sm text-gray-600 mb-1">{person.role}</p>
            <p className="text-xs text-gray-500 mb-3">{person.department}</p>
            <a href={`mailto:${person.email}`} className="text-sm text-blue-600 hover:text-blue-800">
              {person.email}
            </a>
          </Card>
        ))}
      </div>

      {filteredPeople.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No people found matching your criteria.</p>
        </div>
      )}
    </>
  );
}

