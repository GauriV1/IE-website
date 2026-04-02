import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Budget Resources | Division of Inclusive Excellence',
  description: 'GL codes, Chrome River, expense guidelines, and travel policy links for IE budget management.',
};

export default function BudgetPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Budget' }]} />
      <h1 className="text-3xl font-bold text-whitman-navy mb-4">Budget</h1>
      <p className="text-lg text-whitman-gray mb-8">
        Access budget-related resources, college Business Office tools, and expense policies. Expand the sections below for quick reference.
      </p>

      <div className="space-y-4 mb-10">
        <details className="bg-white border border-whitman-navy rounded-lg p-4 group">
          <summary className="font-semibold text-whitman-navy cursor-pointer list-none flex justify-between items-center">
            GL code structure
            <span className="text-whitman-blue group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <p className="mt-3 text-whitman-gray text-sm leading-relaxed">
            Account strings (GL) typically combine fund, department, and object code segments. Your budget manager or the Business Office can confirm the correct string for your purchases. See the college{' '}
            <a
              href="https://www.whitman.edu/business-office/staff-and-faculty-resources/general-ledger"
              className="text-whitman-blue hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              General Ledger resources ↗
            </a>{' '}
            for official guidance.
          </p>
        </details>

        <details className="bg-white border border-whitman-navy rounded-lg p-4 group">
          <summary className="font-semibold text-whitman-navy cursor-pointer list-none flex justify-between items-center">
            Common expense categories
            <span className="text-whitman-blue group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <ul className="mt-3 text-whitman-gray text-sm list-disc list-inside space-y-1">
            <li>Travel and airfare (object codes differ for domestic vs. foreign)</li>
            <li>Meals and entertainment (document business purpose and attendees)</li>
            <li>Supplies and professional development</li>
            <li>Student payroll and student employment (separate processes)</li>
          </ul>
        </details>

        <details className="bg-white border border-whitman-navy rounded-lg p-4 group">
          <summary className="font-semibold text-whitman-navy cursor-pointer list-none flex justify-between items-center">
            Deadlines & reminders
            <span className="text-whitman-blue group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <p className="mt-3 text-whitman-gray text-sm leading-relaxed">
            Purchasing card expenses are generally reconciled monthly in Emburse Enterprise (Chrome River). Reimbursement requests should follow the college&apos;s accountable plan timelines. See the{' '}
            <Link href="/policies/travel-business-expense" className="text-whitman-blue hover:underline">
              Travel &amp; Business Expense Policy
            </Link>{' '}
            for the 60-day substantiation rule and other requirements.
          </p>
        </details>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-whitman-navy mb-3">Chrome River / Emburse Enterprise</h2>
        <p className="text-whitman-gray mb-3">Access training and forms through the Business Office.</p>
        <a
          href="https://www.whitman.edu/business-office/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-whitman-blue font-medium hover:underline"
        >
          Whitman Business Office ↗
        </a>
        {' · '}
        <a
          href="https://www.whitman.edu/business-office/forms"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-whitman-blue font-medium hover:underline"
        >
          Forms (TME, vendor, travel advance) ↗
        </a>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-whitman-navy mb-3">Travel & expense</h2>
        <ul className="space-y-2 text-whitman-gray">
          <li>
            <Link href="/policies/travel-business-expense" className="text-whitman-blue hover:underline">
              Travel &amp; Business Expense Policy
            </Link>{' '}
            (full text)
          </li>
          <li>
            <Link href="/policies/travel-meals" className="text-whitman-blue hover:underline">
              Travel &amp; Meals
            </Link>{' '}
            (division guidance)
          </li>
          <li>
            <Link href="/tasks/cards" className="text-whitman-blue hover:underline">
              Purchasing cards
            </Link>{' '}
            (reconciliation basics)
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-whitman-navy mb-3">Tips</h2>
        <ul className="list-disc list-inside text-whitman-gray text-sm space-y-2">
          <li>Keep itemized receipts and note business purpose on every expense.</li>
          <li>Use college-preferred vendors (Amazon Business, Alaska EasyBiz, Enterprise/National, etc.) when required by policy.</li>
          <li>Ask ABS or your budget lead before charging unusual or high-dollar items.</li>
        </ul>
      </section>
    </div>
  );
}
