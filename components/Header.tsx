'use client';

import Link from 'next/link';
import { useState } from 'react';
import SearchBar from './SearchBar';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation items - can be loaded from content/navigation.json on server side if needed
  // For now, using default navigation
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Tasks & Services', href: '/tasks' },
    { label: 'Policies & Resources', href: '/policies' },
    { label: 'Teams', href: '/teams' },
    { label: 'Tools & Applications', href: '/tools' },
    { label: 'News', href: '/news' },
    { label: 'Directory', href: '/directory' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-whitman-navy shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex flex-col">
              <div className="text-xl font-bold text-whitman-navy leading-tight">Whitman College</div>
              <div className="text-sm font-medium text-whitman-blue">Division of Inclusive Excellence</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-whitman-gray hover:text-whitman-navy hover:bg-whitman-lightblue rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md ml-4">
            <SearchBar />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-whitman-navy hover:bg-whitman-lightblue"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-whitman-navy">
            <div className="mb-4">
              <SearchBar />
            </div>
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-whitman-gray hover:text-whitman-navy hover:bg-whitman-lightblue rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

