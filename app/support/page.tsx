import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import SupportTicketForm from '@/components/SupportTicketForm';

export const metadata: Metadata = {
  title: 'Support | Division of Inclusive Excellence',
  description: 'Submit a support ticket, find FAQs, and contact the Division of Inclusive Excellence.',
};

export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Support' }]} />
      <h1 className="text-3xl font-bold text-whitman-navy mb-4 text-center">Support</h1>
      <p className="text-lg text-whitman-gray mb-10 text-center max-w-xl mx-auto">
        Need help with handbook content, budget questions, or policies? Use the form below or reach out using the contacts listed.
      </p>

      <SupportTicketForm />

      <section className="mt-14 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-whitman-navy mb-3">Contact</h2>
          <p className="text-whitman-gray">
            Email:{' '}
            <a href="mailto:blakena@whitman.edu" className="text-whitman-blue hover:underline">
              blakena@whitman.edu
            </a>
          </p>
          <p className="text-whitman-gray mt-2">
            Whitman College · Division of Inclusive Excellence · 345 Boyer Ave., Walla Walla, WA 99362
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-whitman-navy mb-3">Office hours</h2>
          <p className="text-whitman-gray text-sm">
            Standard college business hours apply (Monday–Friday, except holidays). Response times for tickets are typically within two business days.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-whitman-navy mb-3">FAQ</h2>
          <dl className="space-y-4 text-sm text-whitman-gray">
            <div>
              <dt className="font-semibold text-whitman-navy">Where is the full policy text for travel?</dt>
              <dd className="mt-1">
                See{' '}
                <Link href="/policies/travel-business-expense" className="text-whitman-blue hover:underline">
                  Travel &amp; Business Expense Policy
                </Link>{' '}
                in the handbook.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-whitman-navy">How do I find a form?</dt>
              <dd className="mt-1">
                Use the{' '}
                <Link href="/#directory" className="text-whitman-blue hover:underline">
                  A–Z Document Directory
                </Link>{' '}
                on the home page and filter by type &quot;FRM&quot; (Form).
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-whitman-navy">Chrome River or p-card questions?</dt>
              <dd className="mt-1">
                Visit the <Link href="/budget" className="text-whitman-blue hover:underline">Budget</Link> page for Business Office links, or choose &quot;Chrome River Help&quot; in the ticket form.
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
