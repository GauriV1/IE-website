import Link from 'next/link';
import Card from '@/components/Card';
import HeroCarousel from '@/components/HeroCarousel';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-whitman-navy mb-4">
          Division of Inclusive Excellence
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-whitman-blue mb-4">
          Digital Handbook
        </h2>
        <p className="text-lg text-whitman-gray max-w-3xl">
          Your central hub for resources, policies, and services from Whitman College's Division of Inclusive Excellence. 
          Find what you need quickly and easily.
        </p>
      </div>

      {/* Featured Image Section */}
      <section className="mb-16">
        <HeroCarousel />
      </section>

      {/* Quick Access Sections */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-whitman-navy mb-6">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card href="/tasks" className="hover:border-whitman-blue transition-colors">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-whitman-lightblue rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-whitman-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-whitman-navy mb-2">Tasks & Services</h3>
                <p className="text-sm text-whitman-gray">
                  Step-by-step guides for common tasks and services
                </p>
              </div>
            </div>
          </Card>

          <Card href="/policies" className="hover:border-whitman-blue transition-colors">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-whitman-lightblue rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-whitman-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-whitman-navy mb-2">Policies & Resources</h3>
                <p className="text-sm text-whitman-gray">
                  Browse policies, procedures, and resources
                </p>
              </div>
            </div>
          </Card>

          <Card href="/teams" className="hover:border-whitman-blue transition-colors">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-whitman-lightblue rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-whitman-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-whitman-navy mb-2">Teams & Departments</h3>
                <p className="text-sm text-whitman-gray">
                  Learn about teams, their missions, and contacts
                </p>
              </div>
            </div>
          </Card>

          <Card href="/tools" className="hover:border-whitman-blue transition-colors">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-whitman-lightblue rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-whitman-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-whitman-navy mb-2">Tools & Applications</h3>
                <p className="text-sm text-whitman-gray">
                  Access tools and applications organized by category
                </p>
              </div>
            </div>
          </Card>

          <Card href="/news" className="hover:border-whitman-blue transition-colors">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-whitman-lightblue rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-whitman-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-whitman-navy mb-2">News & Announcements</h3>
                <p className="text-sm text-whitman-gray">
                  Stay up to date with news and announcements
                </p>
              </div>
            </div>
          </Card>

          <Card href="/directory" className="hover:border-whitman-blue transition-colors">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-whitman-lightblue rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-whitman-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-whitman-navy mb-2">Directory</h3>
                <p className="text-sm text-whitman-gray">
                  Find colleagues and team members across the organization
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section className="mb-16 bg-whitman-lightblue rounded-lg p-8 border border-whitman-blue">
        <h2 className="text-2xl font-bold text-whitman-navy mb-4">About the Division of Inclusive Excellence</h2>
        <p className="text-whitman-gray leading-relaxed mb-4">
          The Division of Inclusive Excellence at Whitman College is dedicated to fostering an inclusive, 
          equitable, and welcoming environment for all members of our community. This digital handbook serves 
          as a comprehensive resource for policies, procedures, resources, and support services.
        </p>
        <p className="text-whitman-gray leading-relaxed">
          Use the navigation above to explore tasks, policies, teams, tools, news, and directory information. 
          All content is organized to help you find what you need quickly and efficiently.
        </p>
      </section>
    </div>
  );
}
