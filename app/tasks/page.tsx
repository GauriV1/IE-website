import Link from 'next/link';
import Card from '@/components/Card';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getContentPages } from '@/lib/content/loader.server';

export default function TasksPage() {
  const tasks = getContentPages('tasks');
  
  // Group tasks by category (from frontmatter or use a default)
  const tasksByCategory = tasks.reduce((acc, task) => {
    // Try to extract category from tags or use a default
    const category = task.frontmatter.tags?.[0] || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);
  
  const categories = Object.keys(tasksByCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Tasks & Services' }]} />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Tasks & Services</h1>
      <p className="text-lg text-gray-600 mb-8">
        Find step-by-step guides for common tasks and services across the organization.
      </p>

      {categories.map((category) => {
        const categoryTasks = tasksByCategory[category];
        if (categoryTasks.length === 0) return null;

        return (
          <section key={category} className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">{category}</h2>
              <Link 
                href={`/tasks/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTasks.slice(0, 6).map((task) => (
                <Card key={task.frontmatter.slug} href={`/tasks/${task.frontmatter.slug}`}>
                  <h3 className="font-semibold text-gray-900 mb-2">{task.frontmatter.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{task.frontmatter.summary}</p>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}




