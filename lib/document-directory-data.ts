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
  { id: 'abbreviations', name: 'Abbreviations Glossary', href: '/policies/abbreviations', type: 'REF', lastUpdated: '2024-01-15' },
  { id: 'calendarshare', name: 'Calendar Share', href: '/policies/calendarshare', type: 'REF', lastUpdated: '2024-01-15' },
  { id: 'cards', name: 'Purchasing Cards (Screen, Sum, Stamp)', href: '/tasks/cards', type: 'PRO', lastUpdated: '2024-01-15' },
  { id: 'excellence', name: 'Inclusive Excellence Plan', href: '/policies/excellence', type: 'POL', lastUpdated: '2024-11-01' },
  { id: 'folio', name: 'Combine PDFs (Folio)', href: '/policies/folio', type: 'GDE', lastUpdated: '2024-01-15' },
  { id: 'institutional-information', name: 'Institutional Information', href: '/policies/institutional-information', type: 'REF', lastUpdated: '2024-01-15' },
  { id: 'mission', name: 'DI Mission Statement', href: '/policies/mission', type: 'REF', lastUpdated: '2024-01-15' },
  { id: 'office-setup', name: 'Office Setup & Phones', href: '/policies/office-setup', type: 'GDE', lastUpdated: '2024-01-15' },
  { id: 'orgs', name: 'Student Activities & Organizations', href: '/policies/orgs', type: 'REF', lastUpdated: '2024-01-15' },
  { id: 'remotework', name: 'Telework Remote and Hybrid Work Policy', href: '/policies/remotework', type: 'POL', lastUpdated: '2021-08-01' },
  { id: 'request-time-off', name: 'Request Time Off', href: '/tasks/request-time-off', type: 'PRO', lastUpdated: '2024-01-15' },
  { id: 'signrequest', name: 'SignRequest', href: '/tasks/signrequest', type: 'GDE', lastUpdated: '2024-01-15' },
  { id: 'stamps', name: 'Stamping Your Paperwork', href: '/policies/stamps', type: 'PRO', lastUpdated: '2024-01-15' },
  { id: 'stresscalendar', name: 'Student Stress Calendar', href: '/policies/stresscalendar', type: 'REF', lastUpdated: '2024-01-15' },
  { id: 'studentemployment', name: 'Student Employment', href: '/tasks/studentemployment', type: 'POL', lastUpdated: '2024-01-15' },
  { id: 'summer-hours', name: 'Summer Hours', href: '/policies/summer-hours', type: 'POL', lastUpdated: '2024-01-15' },
  { id: 'time-off-policy', name: 'Time Off Policy', href: '/policies/time-off-policy', type: 'POL', lastUpdated: '2024-01-15' },
  { id: 'travel-business-expense', name: 'Travel and Business Expense Policy', href: '/policies/travel-business-expense', type: 'POL', lastUpdated: '2025-06-30' },
  { id: 'travel-meals', name: 'Travel & Meals', href: '/policies/travel-meals', type: 'POL', lastUpdated: '2024-01-15' },
  { id: 'transition', name: 'Exempt to Professional Nonexempt Transition', href: '/policies/transition', type: 'POL', lastUpdated: '2024-01-15' },
  { id: 'chrome-river', name: 'Chrome River / Emburse Enterprise (Whitman)', href: 'https://www.whitman.edu/business-office/', type: 'GDE', lastUpdated: '2025-01-01' },
  { id: 'student-handbook-pdf', name: 'Student Employment Handbook (PDF)', href: 'https://www.whitman.edu/documents/Campus%20Life/Student%20Life/StudentEmployment/Sort/Whitman-College-Student-Employment-Handbook.pdf', type: 'REF', lastUpdated: '2024-01-01' },
  { id: 'staff-handbook', name: 'Staff Handbook (Whitman HR)', href: 'https://www.whitman.edu/human-resources/employee-resources/staff-handbook', type: 'REF', lastUpdated: '2024-01-01' },
  { id: 'gift-card-form', name: 'Gift Card Reporting Form', href: 'https://docs.google.com/forms/d/e/1FAIpQLScyskt2PzWinC5uZGfTPgoBoge4g6Rp36fawtmwS2nv5luICw/viewform', type: 'FRM', lastUpdated: '2024-01-01' },
  { id: 'business-office-forms', name: 'Business Office Forms (TME, Vendor, Travel Advance)', href: 'https://www.whitman.edu/business-office/forms', type: 'FRM', lastUpdated: '2024-01-01' },
];

export const documents: DirectoryDocument[] = [..._documents].sort((a, b) =>
  a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
);

export function groupDocumentsByLetter(docs: DirectoryDocument[]): Map<string, DirectoryDocument[]> {
  const map = new Map<string, DirectoryDocument[]>();
  for (const doc of docs) {
    const letter = doc.name.charAt(0).toUpperCase();
    const key = /[A-Z]/.test(letter) ? letter : '#';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(doc);
  }
  return map;
}

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
