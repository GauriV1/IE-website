export type DocType = 'POL' | 'PRO' | 'GDE' | 'REF' | 'FRM' | 'AGR';

export interface DirectoryDocument {
  id: string;
  name: string;
  href: string;
  type: DocType;
  lastUpdated?: string;
}

export const DOC_TYPE_LABELS: Record<DocType, string> = {
  POL: 'Policy',
  PRO: 'Procedure',
  GDE: 'Guide',
  REF: 'Reference',
  FRM: 'Form',
  AGR: 'Agreement',
};

const _documents: DirectoryDocument[] = [
  {
    id: 'abbreviations-glossary',
    name: 'Abbreviations Glossary',
    href: '/policies/abbreviations',
    type: 'REF',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'budget-guidelines',
    name: 'Budget Guidelines',
    href: '/budget',
    type: 'POL',
    lastUpdated: '2024-03-01',
  },
  {
    id: 'business-office-forms',
    name: 'Business Office Forms',
    href: 'https://www.whitman.edu/business-office/forms',
    type: 'FRM',
    lastUpdated: '2024-01-01',
  },
  {
    id: 'chrome-river-user-guide',
    name: 'Chrome River User Guide',
    href: 'https://www.whitman.edu/business-office/',
    type: 'GDE',
    lastUpdated: '2024-09-26',
  },
  {
    id: 'cic-belong-overview',
    name: 'CIC Belong Overview',
    href: 'https://www.whitman.edu/about/inclusive-excellence',
    type: 'REF',
    lastUpdated: '2024-02-15',
  },
  {
    id: 'dept-social-media',
    name: 'Departmental Social Media Guidelines',
    href: 'https://www.whitman.edu/communications/',
    type: 'POL',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'gaic-donation-form',
    name: 'GAIC Donation Form',
    href: 'https://www.whitman.edu/giving/',
    type: 'FRM',
    lastUpdated: '2024-12-05',
  },
  {
    id: 'gl-codes-reference',
    name: 'GL Codes Reference',
    href: 'https://www.whitman.edu/business-office/staff-and-faculty-resources/general-ledger',
    type: 'REF',
    lastUpdated: '2024-06-01',
  },
  {
    id: 'handshake-job-posting',
    name: 'Handshake Job Posting Guide',
    href: 'https://www.whitman.edu/human-resources/student-employment',
    type: 'GDE',
    lastUpdated: '2024-07-15',
  },
  {
    id: 'ie-org-chart',
    name: 'IE Org Chart',
    href: '/policies/excellence',
    type: 'REF',
    lastUpdated: '2022-10-06',
  },
  {
    id: 'ie-staff-directory',
    name: 'IE Staff Directory',
    href: 'https://www.whitman.edu/directory',
    type: 'REF',
    lastUpdated: '2022-07-01',
  },
  {
    id: 'marcus-whitman-hotel',
    name: 'Marcus Whitman Hotel Agreement',
    href: 'https://www.whitman.edu/business-office/',
    type: 'AGR',
    lastUpdated: '2024-07-02',
  },
  {
    id: 'mfa-duo-guide',
    name: 'MFA/Duo Enrollment Guide',
    href: 'https://www.whitman.edu/offices/information-technology/',
    type: 'GDE',
    lastUpdated: '2022-12-05',
  },
  {
    id: 'quarterly-updates-deadlines',
    name: 'Quarterly Updates Deadlines',
    href: '/policies/home',
    type: 'PRO',
    lastUpdated: '2024-07-22',
  },
  {
    id: 'student-leadership-workbook',
    name: 'Student Leadership Workbook',
    href: 'https://www.whitman.edu/campus-life/student-activities',
    type: 'GDE',
    lastUpdated: '2024-01-01',
  },
  {
    id: 'telework-agreement-form',
    name: 'Telework Agreement Form',
    href: 'https://www.whitman.edu/business-office/forms',
    type: 'FRM',
    lastUpdated: '2021-08-23',
  },
  {
    id: 'telework-remote-hybrid-policy',
    name: 'Telework Remote & Hybrid Policy',
    href: '/policies/remotework',
    type: 'POL',
    lastUpdated: '2021-08-30',
  },
  {
    id: 'travel-business-expense',
    name: 'Travel & Business Expense Policy',
    href: '/policies/travel-business-expense',
    type: 'POL',
    lastUpdated: '2024-01-16',
  },
  {
    id: 'travel-time-compensation',
    name: 'Travel Time Compensation Policy',
    href: 'https://www.whitman.edu/human-resources/employee-resources/staff-handbook',
    type: 'POL',
    lastUpdated: '2021-12-01',
  },
  {
    id: 'whitlife-ergs',
    name: 'WhitLife & ERGs Overview',
    href: 'https://www.whitman.edu/about/inclusive-excellence',
    type: 'GDE',
    lastUpdated: '2024-02-01',
  },
];

export const documents: DirectoryDocument[] = [..._documents].sort((a, b) =>
  a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
);

export function filterDocuments(
  docs: DirectoryDocument[],
  query: string,
  typeFilter: DocType | 'all'
): DirectoryDocument[] {
  const q = query.trim().toLowerCase();
  return docs.filter((d) => {
    if (typeFilter !== 'all' && d.type !== typeFilter) return false;
    if (!q) return true;
    return (
      d.name.toLowerCase().includes(q) ||
      DOC_TYPE_LABELS[d.type].toLowerCase().includes(q) ||
      d.type.toLowerCase().includes(q)
    );
  });
}
