import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-whitman-navy text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Division of Inclusive Excellence</h3>
            <p className="text-sm text-gray-300">
              Digital Handbook for Whitman College resources, policies, and services.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/policies" className="text-sm text-gray-300 hover:text-white">
                  Policies & Resources
                </Link>
              </li>
              <li>
                <Link href="/tasks" className="text-sm text-gray-300 hover:text-white">
                  Tasks & Services
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-sm text-gray-300 hover:text-white">
                  Tools & Applications
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-sm text-gray-300 hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/directory" className="text-sm text-gray-300 hover:text-white">
                  Directory
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Whitman College</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.whitman.edu/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white">
                  Main Website
                </a>
              </li>
              <li>
                <a href="https://www.whitman.edu/about/inclusive-excellence" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white">
                  Inclusive Excellence
                </a>
              </li>
              <li>
                <a href="https://www.whitman.edu/about/contact-us" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-600">
          <p className="text-sm text-gray-300 text-center">
            © {new Date().getFullYear()} Whitman College. All rights reserved. | 345 Boyer Ave., Walla Walla, WA 99362
          </p>
        </div>
      </div>
    </footer>
  );
}

