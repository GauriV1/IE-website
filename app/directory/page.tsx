import type { Metadata } from 'next';
import DocumentDirectorySection from '@/components/DocumentDirectorySection';

export const metadata: Metadata = {
  title: 'A–Z Document Directory | Division of Inclusive Excellence',
  description:
    'Searchable alphabetical directory of IE handbook documents, policies, procedures, guides, and forms.',
};

export default function DirectoryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <DocumentDirectorySection />
    </div>
  );
}
