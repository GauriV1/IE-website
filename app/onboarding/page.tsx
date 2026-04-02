import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Onboarding | Division of Inclusive Excellence',
  description: 'Orientation materials, welcome guides, and first-day essentials for new IE staff.',
};

export default function OnboardingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Onboarding' }]} />
      <h1 className="text-3xl font-bold text-whitman-navy mb-4">Onboarding</h1>
      <p className="text-lg text-whitman-gray mb-8">
        Welcome to the Division of Inclusive Excellence. This page highlights what to do in your first days, where to find essential handbook documents, and who can help.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-whitman-navy mb-4">Onboarding checklist</h2>
        <ol className="list-decimal list-inside space-y-2 text-whitman-gray">
          <li>
            Review the <Link href="/#about" className="text-whitman-blue hover:underline">About</Link> section on the handbook home page.
          </li>
          <li>
            Browse the{' '}
            <Link href="/#directory" className="text-whitman-blue hover:underline">
              A–Z Document Directory
            </Link>{' '}
            for policies and forms that apply to your role.
          </li>
          <li>
            Read the <Link href="/policies/mission" className="text-whitman-blue hover:underline">DI Mission Statement</Link> and{' '}
            <Link href="/policies/excellence" className="text-whitman-blue hover:underline">Inclusive Excellence Plan</Link>.
          </li>
          <li>
            Complete telework acknowledgment if applicable:{' '}
            <Link href="/policies/remotework" className="text-whitman-blue hover:underline">Telework Remote &amp; Hybrid Policy</Link>.
          </li>
          <li>
            Explore <Link href="/processes" className="text-whitman-blue hover:underline">Processes</Link> for policies and procedures,{' '}
            <Link href="/budget" className="text-whitman-blue hover:underline">Budget</Link> for expense tools, and{' '}
            <Link href="/support" className="text-whitman-blue hover:underline">Support</Link> if you need help.
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-whitman-navy mb-4">Essential first-day documents</h2>
        <ul className="space-y-2 text-whitman-gray">
          <li>
            <Link href="/policies/institutional-information" className="text-whitman-blue hover:underline">Institutional Information</Link>{' '}
            — HR, benefits, and college-wide resources
          </li>
          <li>
            <Link href="/policies/abbreviations" className="text-whitman-blue hover:underline">Abbreviations glossary</Link>
          </li>
          <li>
            <Link href="/tasks/signrequest" className="text-whitman-blue hover:underline">SignRequest</Link> — approvals and signatures
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-whitman-navy mb-4">Key contacts</h2>
        <p className="text-whitman-gray mb-2">
          Your supervisor and division leadership are your first points of contact for role-specific questions.
        </p>
        <p className="text-whitman-gray">
          For handbook or operational questions, email{' '}
          <a href="mailto:ie@whitman.edu" className="text-whitman-blue hover:underline">
            ie@whitman.edu
          </a>{' '}
          or use the <Link href="/support" className="text-whitman-blue hover:underline">Support</Link> page to submit a ticket.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-whitman-navy mb-4">More handbook sections</h2>
        <ul className="list-disc list-inside space-y-1 text-whitman-gray">
          <li>
            <Link href="/processes" className="text-whitman-blue hover:underline">Processes</Link> — policies and procedures
          </li>
          <li>
            <Link href="/budget" className="text-whitman-blue hover:underline">Budget</Link> — GL codes, Chrome River, travel and expense
          </li>
          <li>
            <Link href="/support" className="text-whitman-blue hover:underline">Support</Link> — tickets, FAQ, and office information
          </li>
        </ul>
      </section>
    </div>
  );
}
