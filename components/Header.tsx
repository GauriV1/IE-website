'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Directory', href: '/directory' },
    { label: 'Flowchart', href: '/#flowchart' },
    { label: 'About', href: '/#about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-whitman-navy shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3 shrink-0">
            <div className="flex flex-col">
              <div className="text-xl font-bold text-whitman-navy leading-tight">Whitman College</div>
              <div className="text-sm font-medium text-whitman-blue">Division of Inclusive Excellence</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center justify-center gap-1 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-5 py-2 text-sm font-semibold text-whitman-navy hover:text-white hover:bg-whitman-navy rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block w-32 shrink-0" aria-hidden />

          <button
            className="md:hidden p-2 rounded-md text-whitman-navy hover:bg-whitman-lightblue"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
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

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-whitman-navy">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-whitman-gray hover:text-whitman-navy hover:bg-whitman-lightblue rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
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
