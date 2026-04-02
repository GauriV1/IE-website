import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-whitman-navy text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Division of Inclusive Excellence</h3>
            <p className="text-sm text-gray-200">
              Digital Handbook for Whitman College resources, policies, and services.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Handbook</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/directory" className="text-sm text-white hover:text-whitman-gold">
                  A–Z Document Directory
                </Link>
              </li>
              <li>
                <Link href="/#flowchart" className="text-sm text-white hover:text-whitman-gold">
                  Flowchart
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-sm text-white hover:text-whitman-gold">
                  About
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-white hover:text-whitman-gold">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Whitman College</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.whitman.edu/" target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-whitman-gold">
                  Main Website
                </a>
              </li>
              <li>
                <a href="https://www.whitman.edu/about/inclusive-excellence" target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-whitman-gold">
                  Inclusive Excellence
                </a>
              </li>
              <li>
                <a href="https://www.whitman.edu/about/contact-us" target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-whitman-gold">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-600">
          <p className="text-sm text-gray-200 text-center">
            © {new Date().getFullYear()} Whitman College. All rights reserved. | 345 Boyer Ave., Walla Walla, WA 99362
          </p>
        </div>
      </div>
    </footer>
  );
}
