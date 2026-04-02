import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Onboarding | Division of Inclusive Excellence',
  description: 'Orientation materials, welcome guides, and first-day essentials for new IE staff.',
};

export default function OnboardingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-whitman-navy mb-4">Onboarding</h1>
      <p className="text-lg text-whitman-gray mb-8">
        Welcome to the Division of Inclusive Excellence. Use this page as a starting point for orientation,
        key handbook links, and who to contact with questions.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-whitman-navy mb-4">First-week checklist</h2>
        <ol className="list-decimal list-inside space-y-2 text-whitman-gray">
          <li>Review the <Link href="/#about" className="text-whitman-blue hover:underline">About</Link> section on the handbook home page.</li>
          <li>Browse the <Link href="/directory" className="text-whitman-blue hover:underline">A–Z Document Directory</Link> for policies that apply to your role.</li>
          <li>Read the <Link href="/policies/mission" className="text-whitman-blue hover:underline">DI Mission Statement</Link> and{' '}
            <Link href="/policies/excellence" className="text-whitman-blue hover:underline">Inclusive Excellence Plan</Link>.</li>
          <li>Complete telework acknowledgment if applicable:{' '}
            <Link href="/policies/remotework" className="text-whitman-blue hover:underline">Telework policy</Link>.</li>
          <li>Familiarize yourself with <Link href="/tasks/signrequest" className="text-whitman-blue hover:underline">SignRequest</Link> for approvals.</li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-whitman-navy mb-4">Key documents</h2>
        <ul className="space-y-2 text-whitman-gray">
          <li>
            <Link href="/policies/institutional-information" className="text-whitman-blue hover:underline">Institutional Information</Link>{' '}
            — HR, benefits, and college-wide resources
          </li>
          <li>
            <Link href="/policies/abbreviations" className="text-whitman-blue hover:underline">Abbreviations glossary</Link>
          </li>
          <li>
            <Link href="/processes" className="text-whitman-blue hover:underline">Processes</Link> — policies and procedures index
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-whitman-navy mb-4">Questions?</h2>
        <p className="text-whitman-gray">
          Contact your supervisor or division leadership, or use the{' '}
          <Link href="/support" className="text-whitman-blue hover:underline">Support</Link> page to submit a ticket.
        </p>
      </section>
    </div>
  );
}
