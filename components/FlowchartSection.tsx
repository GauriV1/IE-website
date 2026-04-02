'use client';

import Link from 'next/link';

const hoverNotes = {
  onboarding:
    'New to IE? Start here for orientation materials, welcome guides, and first-day essentials.',
  processes:
    'Find step-by-step procedures and official policies for IE operations.',
  budget:
    'Access GL codes, expense guidelines, Chrome River instructions, and budget management tools.',
  support: 'Need assistance? Submit a support ticket or find contact information.',
} as const;

const steps = [
  {
    key: 'onboarding' as const,
    title: 'Onboarding',
    href: '/onboarding',
    cta: 'Get Started',
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
  {
    key: 'processes' as const,
    title: 'Processes',
    href: '/processes',
    cta: 'View Processes',
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: 'budget' as const,
    title: 'Budget',
    href: '/budget',
    cta: 'Budget Resources',
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'support' as const,
    title: 'Support',
    href: '/support',
    cta: 'Get Help',
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function FlowchartSection() {
  return (
    <section id="flowchart" className="scroll-mt-24 py-10 md:py-14" aria-labelledby="flowchart-heading">
      <h2 id="flowchart-heading" className="text-2xl md:text-3xl font-bold text-whitman-navy text-center mb-10">
        Your IE Handbook Journey
      </h2>
      <div className="flex flex-col xl:flex-row xl:items-stretch xl:justify-center gap-0 xl:gap-2">
        {steps.map((step, index) => (
          <div key={step.key} className="flex flex-col xl:flex-row xl:items-stretch flex-1 min-w-0 max-w-md mx-auto xl:max-w-none w-full">
            <article
              className="relative flex-1 bg-white border-2 border-whitman-navy rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 group"
              title={hoverNotes[step.key]}
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className="text-whitman-blue mb-3">{step.icon}</div>
                <h3 className="text-lg font-bold text-whitman-navy mb-2">{step.title}</h3>
                <p className="text-sm text-whitman-gray mb-3 md:opacity-0 md:group-hover:opacity-100 md:absolute md:left-2 md:right-2 md:top-[calc(100%-0.5rem)] md:z-20 md:bg-white md:border md:border-whitman-navy md:rounded-lg md:p-3 md:shadow-lg md:transition-opacity md:duration-200 md:pointer-events-none">
                  {hoverNotes[step.key]}
                </p>
                <p className="text-sm text-whitman-gray mb-4 md:hidden">{hoverNotes[step.key]}</p>
                <div className="mt-auto w-full">
                  <Link
                    href={step.href}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-whitman-navy text-white text-sm font-semibold hover:bg-whitman-blue transition-colors w-full"
                  >
                    {step.cta}
                  </Link>
                </div>
              </div>
            </article>
            {index < steps.length - 1 && (
              <div
                className="hidden xl:flex items-center justify-center text-whitman-navy text-2xl font-bold px-2 shrink-0 self-center"
                aria-hidden
              >
                →
              </div>
            )}
            {index < steps.length - 1 && (
              <div className="flex xl:hidden justify-center py-3 text-whitman-navy text-2xl" aria-hidden>
                ↓
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
