import Breadcrumbs from '@/components/Breadcrumbs';
import { getContentPages } from '@/lib/content/loader.server';
import ToolsClient from './ToolsClient';

export default function ToolsPage() {
  const tools = getContentPages('tools');
  
  // Extract unique types from tools
  const toolTypes = Array.from(new Set(
    tools.map(t => t.frontmatter.type).filter(Boolean)
  ));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Tools & Applications' }]} />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Tools & Applications</h1>
      <p className="text-lg text-gray-600 mb-8">
        Access company tools and applications organized by category.
      </p>

      <ToolsClient tools={tools} toolTypes={toolTypes} />
    </div>
  );
}

