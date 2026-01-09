// Mock data for the wireframe prototype

export interface Task {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  steps: string[];
  relatedForms?: string[];
  relatedPolicies?: string[];
  contacts?: string[];
}

export interface Policy {
  id: string;
  slug: string;
  title: string;
  category: string;
  lastUpdated: string;
  keyBullets: string[];
  sections: { title: string; content: string }[];
  relatedTasks?: string[];
  relatedForms?: string[];
}

export interface Team {
  id: string;
  slug: string;
  name: string;
  mission: string;
  contacts: { name: string; role: string; email: string }[];
  relatedTasks?: string[];
  relatedPolicies?: string[];
  relatedTools?: string[];
}

export interface Tool {
  id: string;
  slug: string;
  name: string;
  type: string;
  description: string;
  url?: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
}

// Tasks
export const tasks: Task[] = [
  {
    id: '1',
    slug: 'request-time-off',
    title: 'Request Time Off',
    category: 'HR & Finance',
    summary: 'Submit a request for vacation, sick leave, or personal time off.',
    steps: [
      'Log into the HR portal',
      'Navigate to Time Off section',
      'Select the type of leave you need',
      'Choose your dates',
      'Submit for approval',
      'Wait for manager confirmation'
    ],
    relatedForms: ['Time Off Request Form'],
    relatedPolicies: ['time-off-policy', 'leave-accrual-policy'],
    contacts: ['hr@company.com']
  },
  {
    id: '2',
    slug: 'submit-expense-report',
    title: 'Submit Expense Report',
    category: 'HR & Finance',
    summary: 'Submit business expenses for reimbursement.',
    steps: [
      'Access the expense management system',
      'Create a new expense report',
      'Add receipts and documentation',
      'Enter expense details',
      'Submit for approval'
    ],
    relatedForms: ['Expense Report Form'],
    relatedPolicies: ['expense-policy'],
    contacts: ['finance@company.com']
  },
  {
    id: '3',
    slug: 'update-benefits',
    title: 'Update Benefits Enrollment',
    category: 'HR & Finance',
    summary: 'Make changes to your health insurance, retirement, or other benefits.',
    steps: [
      'Log into benefits portal',
      'Review current selections',
      'Make desired changes',
      'Submit during open enrollment period',
      'Confirm changes via email'
    ],
    relatedPolicies: ['benefits-policy'],
    contacts: ['benefits@company.com']
  },
  {
    id: '4',
    slug: 'request-it-help',
    title: 'Request IT Help',
    category: 'IT Help',
    summary: 'Get technical support for computer, software, or network issues.',
    steps: [
      'Submit a ticket through the IT portal',
      'Describe your issue in detail',
      'Attach screenshots if applicable',
      'Set priority level',
      'Track ticket status'
    ],
    relatedPolicies: ['it-support-policy'],
    contacts: ['it-support@company.com']
  },
  {
    id: '5',
    slug: 'reset-password',
    title: 'Reset Password',
    category: 'IT Help',
    summary: 'Reset your account password if you\'ve forgotten it.',
    steps: [
      'Go to the password reset page',
      'Enter your email address',
      'Check your email for reset link',
      'Click the link and create new password',
      'Log in with new password'
    ],
    relatedPolicies: ['password-policy'],
    contacts: ['it-support@company.com']
  },
  {
    id: '6',
    slug: 'request-facilities',
    title: 'Request Facilities Support',
    category: 'Facilities',
    summary: 'Request maintenance, repairs, or workspace changes.',
    steps: [
      'Submit facilities request form',
      'Specify the type of request',
      'Provide location and details',
      'Set urgency level',
      'Receive confirmation and timeline'
    ],
    relatedForms: ['Facilities Request Form'],
    contacts: ['facilities@company.com']
  },
  {
    id: '7',
    slug: 'book-conference-room',
    title: 'Book Conference Room',
    category: 'Facilities',
    summary: 'Reserve a meeting room for your team.',
    steps: [
      'Access room booking system',
      'Select date and time',
      'Choose available room',
      'Add meeting details',
      'Confirm reservation'
    ],
    relatedPolicies: ['room-booking-policy'],
    contacts: ['facilities@company.com']
  },
  {
    id: '8',
    slug: 'register-for-event',
    title: 'Register for Company Event',
    category: 'Events',
    summary: 'Sign up for company-wide events, training, or social gatherings.',
    steps: [
      'Browse upcoming events',
      'Select event you want to attend',
      'Click Register',
      'Confirm your attendance',
      'Add to calendar'
    ],
    relatedPolicies: ['event-policy'],
    contacts: ['events@company.com']
  },
  {
    id: '9',
    slug: 'complete-onboarding',
    title: 'Complete New Employee Onboarding',
    category: 'Onboarding',
    summary: 'Complete required forms and training for new employees.',
    steps: [
      'Review onboarding checklist',
      'Complete I-9 form',
      'Set up direct deposit',
      'Complete required training modules',
      'Schedule orientation meeting'
    ],
    relatedForms: ['I-9 Form', 'Direct Deposit Form'],
    relatedPolicies: ['onboarding-policy'],
    contacts: ['hr@company.com']
  },
  {
    id: '10',
    slug: 'request-leadership-meeting',
    title: 'Request Leadership Meeting',
    category: 'Leadership',
    summary: 'Schedule time with leadership team members.',
    steps: [
      'Check leadership calendar availability',
      'Submit meeting request',
      'Include agenda and purpose',
      'Wait for confirmation',
      'Prepare materials'
    ],
    contacts: ['executive-assistant@company.com']
  }
];

// Policies
export const policies: Policy[] = [
  {
    id: '1',
    slug: 'time-off-policy',
    title: 'Time Off Policy',
    category: 'HR',
    lastUpdated: '2024-01-15',
    keyBullets: [
      'Full-time employees accrue 15 days of PTO per year',
      'Requests must be submitted at least 2 weeks in advance',
      'Manager approval required for all time off',
      'Unused PTO can be carried over up to 5 days'
    ],
    sections: [
      {
        title: 'Accrual Rates',
        content: 'Full-time employees accrue 1.25 days per month. Part-time employees accrue PTO on a pro-rated basis.'
      },
      {
        title: 'Request Process',
        content: 'All time off requests must be submitted through the HR portal and approved by your direct manager.'
      },
      {
        title: 'Blackout Dates',
        content: 'Certain dates may be restricted due to business needs. Check with your manager before requesting.'
      }
    ],
    relatedTasks: ['request-time-off'],
    relatedForms: ['Time Off Request Form']
  },
  {
    id: '2',
    slug: 'expense-policy',
    title: 'Expense Reimbursement Policy',
    category: 'Finance',
    lastUpdated: '2024-02-01',
    keyBullets: [
      'All expenses must be business-related',
      'Receipts required for expenses over $25',
      'Submit within 30 days of incurring expense',
      'Approval required from manager before submission'
    ],
    sections: [
      {
        title: 'Eligible Expenses',
        content: 'Business meals, travel, supplies, and other approved business expenses are eligible for reimbursement.'
      },
      {
        title: 'Submission Process',
        content: 'Submit expense reports through the expense management system with all required documentation.'
      }
    ],
    relatedTasks: ['submit-expense-report'],
    relatedForms: ['Expense Report Form']
  },
  {
    id: '3',
    slug: 'it-support-policy',
    title: 'IT Support Policy',
    category: 'IT',
    lastUpdated: '2024-01-20',
    keyBullets: [
      'IT support available Monday-Friday, 8am-6pm',
      'Submit tickets through the IT portal',
      'Critical issues receive priority response',
      'Standard response time is 24 hours'
    ],
    sections: [
      {
        title: 'Support Hours',
        content: 'IT support is available during business hours. After-hours support is available for critical issues only.'
      },
      {
        title: 'Ticket Priority',
        content: 'Issues are prioritized based on impact and urgency. Critical system outages receive immediate attention.'
      }
    ],
    relatedTasks: ['request-it-help', 'reset-password']
  },
  {
    id: '4',
    slug: 'room-booking-policy',
    title: 'Conference Room Booking Policy',
    category: 'Facilities',
    lastUpdated: '2024-01-10',
    keyBullets: [
      'Rooms can be booked up to 30 days in advance',
      'Cancellations must be made at least 2 hours before',
      'Maximum booking duration is 4 hours',
      'Rooms are released if not occupied within 15 minutes'
    ],
    sections: [
      {
        title: 'Booking Rules',
        content: 'Conference rooms are available on a first-come, first-served basis. Recurring meetings are limited to one per week.'
      }
    ],
    relatedTasks: ['book-conference-room']
  },
  {
    id: '5',
    slug: 'benefits-policy',
    title: 'Employee Benefits Policy',
    category: 'HR',
    lastUpdated: '2024-03-01',
    keyBullets: [
      'Open enrollment occurs annually in November',
      'Changes outside open enrollment require qualifying event',
      'Health insurance coverage begins first of month after hire',
      '401(k) matching available after 90 days'
    ],
    sections: [
      {
        title: 'Available Benefits',
        content: 'We offer comprehensive health, dental, vision, retirement, and wellness benefits to all eligible employees.'
      }
    ],
    relatedTasks: ['update-benefits']
  },
  {
    id: '6',
    slug: 'password-policy',
    title: 'Password Security Policy',
    category: 'IT',
    lastUpdated: '2024-01-05',
    keyBullets: [
      'Passwords must be at least 12 characters',
      'Must include uppercase, lowercase, number, and special character',
      'Passwords expire every 90 days',
      'Multi-factor authentication required'
    ],
    sections: [
      {
        title: 'Password Requirements',
        content: 'All passwords must meet complexity requirements and be changed regularly to maintain security.'
      }
    ],
    relatedTasks: ['reset-password']
  },
  {
    id: '7',
    slug: 'event-policy',
    title: 'Company Events Policy',
    category: 'Events',
    lastUpdated: '2024-02-15',
    keyBullets: [
      'All employees are encouraged to attend company events',
      'Registration required for planning purposes',
      'Events are typically held during business hours',
      'Accommodations available upon request'
    ],
    sections: [
      {
        title: 'Event Types',
        content: 'We host various events including all-hands meetings, training sessions, social gatherings, and team building activities.'
      }
    ],
    relatedTasks: ['register-for-event']
  },
  {
    id: '8',
    slug: 'onboarding-policy',
    title: 'New Employee Onboarding Policy',
    category: 'HR',
    lastUpdated: '2024-01-01',
    keyBullets: [
      'Onboarding must be completed within first week',
      'All required forms must be submitted before start date',
      'Orientation scheduled within first two weeks',
      'Buddy assigned to help with integration'
    ],
    sections: [
      {
        title: 'Onboarding Checklist',
        content: 'New employees must complete paperwork, training modules, and orientation sessions as part of the onboarding process.'
      }
    ],
    relatedTasks: ['complete-onboarding']
  }
];

// Teams
export const teams: Team[] = [
  {
    id: '1',
    slug: 'human-resources',
    name: 'Human Resources',
    mission: 'Supporting our employees through their entire journey, from recruitment to retirement.',
    contacts: [
      { name: 'Sarah Johnson', role: 'HR Director', email: 'sarah.johnson@company.com' },
      { name: 'Mike Chen', role: 'Benefits Manager', email: 'mike.chen@company.com' }
    ],
    relatedTasks: ['request-time-off', 'update-benefits', 'complete-onboarding'],
    relatedPolicies: ['time-off-policy', 'benefits-policy', 'onboarding-policy'],
    relatedTools: ['hr-portal', 'benefits-portal']
  },
  {
    id: '2',
    slug: 'finance',
    name: 'Finance',
    mission: 'Managing company finances, budgets, and ensuring fiscal responsibility.',
    contacts: [
      { name: 'Emily Rodriguez', role: 'CFO', email: 'emily.rodriguez@company.com' },
      { name: 'David Kim', role: 'Accounting Manager', email: 'david.kim@company.com' }
    ],
    relatedTasks: ['submit-expense-report'],
    relatedPolicies: ['expense-policy'],
    relatedTools: ['expense-system']
  },
  {
    id: '3',
    slug: 'information-technology',
    name: 'Information Technology',
    mission: 'Providing reliable technology infrastructure and support to enable productivity.',
    contacts: [
      { name: 'Alex Thompson', role: 'IT Director', email: 'alex.thompson@company.com' },
      { name: 'Jordan Lee', role: 'Support Manager', email: 'jordan.lee@company.com' }
    ],
    relatedTasks: ['request-it-help', 'reset-password'],
    relatedPolicies: ['it-support-policy', 'password-policy'],
    relatedTools: ['it-portal', 'password-reset']
  },
  {
    id: '4',
    slug: 'facilities',
    name: 'Facilities',
    mission: 'Maintaining safe, comfortable, and functional workspaces for all employees.',
    contacts: [
      { name: 'Pat Martinez', role: 'Facilities Manager', email: 'pat.martinez@company.com' }
    ],
    relatedTasks: ['request-facilities', 'book-conference-room'],
    relatedPolicies: ['room-booking-policy'],
    relatedTools: ['room-booking']
  },
  {
    id: '5',
    slug: 'events',
    name: 'Events & Culture',
    mission: 'Building community and engagement through company-wide events and initiatives.',
    contacts: [
      { name: 'Taylor Brown', role: 'Events Coordinator', email: 'taylor.brown@company.com' }
    ],
    relatedTasks: ['register-for-event'],
    relatedPolicies: ['event-policy'],
    relatedTools: ['event-registration']
  }
];

// Tools
export const tools: Tool[] = [
  {
    id: '1',
    slug: 'hr-portal',
    name: 'HR Portal',
    type: 'HR Systems',
    description: 'Access your employee information, time off requests, and HR resources.',
    url: '#'
  },
  {
    id: '2',
    slug: 'benefits-portal',
    name: 'Benefits Portal',
    type: 'HR Systems',
    description: 'Manage your health insurance, retirement, and other benefits.',
    url: '#'
  },
  {
    id: '3',
    slug: 'expense-system',
    name: 'Expense Management',
    type: 'Expense',
    description: 'Submit and track expense reports for reimbursement.',
    url: '#'
  },
  {
    id: '4',
    slug: 'it-portal',
    name: 'IT Support Portal',
    type: 'IT Ticketing',
    description: 'Submit IT support tickets and track their status.',
    url: '#'
  },
  {
    id: '5',
    slug: 'password-reset',
    name: 'Password Reset',
    type: 'IT Ticketing',
    description: 'Reset your account password securely.',
    url: '#'
  },
  {
    id: '6',
    slug: 'room-booking',
    name: 'Room Booking System',
    type: 'Calendar/Rooms',
    description: 'Reserve conference rooms and meeting spaces.',
    url: '#'
  },
  {
    id: '7',
    slug: 'company-calendar',
    name: 'Company Calendar',
    type: 'Calendar/Rooms',
    description: 'View company-wide events and important dates.',
    url: '#'
  },
  {
    id: '8',
    slug: 'event-registration',
    name: 'Event Registration',
    type: 'Events',
    description: 'Register for company events and training sessions.',
    url: '#'
  },
  {
    id: '9',
    slug: 'project-manager',
    name: 'Project Manager',
    type: 'Project Tools',
    description: 'Collaborate on projects and track progress.',
    url: '#'
  },
  {
    id: '10',
    slug: 'document-share',
    name: 'Document Sharing',
    type: 'Project Tools',
    description: 'Share and collaborate on documents with your team.',
    url: '#'
  }
];

// News
export const newsItems: NewsItem[] = [
  {
    id: '1',
    slug: 'q2-all-hands-meeting',
    title: 'Q2 All-Hands Meeting Scheduled',
    date: '2024-04-15',
    excerpt: 'Join us for our quarterly all-hands meeting on April 30th at 2pm.',
    content: 'We\'re excited to announce our Q2 All-Hands Meeting will be held on April 30th at 2pm in the main auditorium. This meeting will cover company updates, Q1 results, and upcoming initiatives. All employees are encouraged to attend. Refreshments will be provided.'
  },
  {
    id: '2',
    slug: 'new-benefits-enrollment',
    title: 'Open Enrollment for Benefits Begins May 1st',
    date: '2024-04-10',
    excerpt: 'Annual benefits open enrollment period starts next month.',
    content: 'The annual benefits open enrollment period will begin on May 1st and run through May 31st. During this time, you can make changes to your health insurance, retirement contributions, and other benefits. Please review your current selections and make any desired changes through the benefits portal.'
  },
  {
    id: '3',
    slug: 'office-renovation-update',
    title: 'Office Renovation Update',
    date: '2024-04-05',
    excerpt: 'Phase 2 of the office renovation is complete.',
    content: 'Phase 2 of our office renovation project has been completed successfully. The new collaboration spaces are now open for use. We\'re excited to see how teams utilize these new areas for enhanced productivity and teamwork.'
  },
  {
    id: '4',
    slug: 'wellness-program-launch',
    title: 'New Wellness Program Launch',
    date: '2024-03-28',
    excerpt: 'Introducing our comprehensive employee wellness program.',
    content: 'We\'re launching a new comprehensive wellness program that includes fitness classes, mental health resources, and wellness challenges. All employees are eligible to participate. Registration opens next week.'
  },
  {
    id: '5',
    slug: 'it-security-training',
    title: 'Mandatory IT Security Training',
    date: '2024-03-20',
    excerpt: 'Complete your annual IT security training by April 30th.',
    content: 'All employees must complete the annual IT security training by April 30th. This training covers best practices for password security, phishing prevention, and data protection. Access the training through the learning management system.'
  }
];

// People
export const people: Person[] = [
  { id: '1', name: 'Sarah Johnson', role: 'HR Director', department: 'Human Resources', email: 'sarah.johnson@company.com', phone: '555-0101' },
  { id: '2', name: 'Mike Chen', role: 'Benefits Manager', department: 'Human Resources', email: 'mike.chen@company.com', phone: '555-0102' },
  { id: '3', name: 'Emily Rodriguez', role: 'CFO', department: 'Finance', email: 'emily.rodriguez@company.com', phone: '555-0201' },
  { id: '4', name: 'David Kim', role: 'Accounting Manager', department: 'Finance', email: 'david.kim@company.com', phone: '555-0202' },
  { id: '5', name: 'Alex Thompson', role: 'IT Director', department: 'Information Technology', email: 'alex.thompson@company.com', phone: '555-0301' },
  { id: '6', name: 'Jordan Lee', role: 'Support Manager', department: 'Information Technology', email: 'jordan.lee@company.com', phone: '555-0302' },
  { id: '7', name: 'Pat Martinez', role: 'Facilities Manager', department: 'Facilities', email: 'pat.martinez@company.com', phone: '555-0401' },
  { id: '8', name: 'Taylor Brown', role: 'Events Coordinator', department: 'Events & Culture', email: 'taylor.brown@company.com', phone: '555-0501' },
  { id: '9', name: 'Chris Wilson', role: 'Marketing Manager', department: 'Marketing', email: 'chris.wilson@company.com', phone: '555-0601' },
  { id: '10', name: 'Morgan Davis', role: 'Sales Director', department: 'Sales', email: 'morgan.davis@company.com', phone: '555-0701' }
];

// Task categories
export const taskCategories = [
  'HR & Finance',
  'IT Help',
  'Facilities',
  'Events',
  'Onboarding',
  'Leadership'
];

// Policy categories
export const policyCategories = [
  'HR',
  'Finance',
  'IT',
  'Facilities',
  'Events',
  'Safety'
];

// Tool types
export const toolTypes = [
  'HR Systems',
  'Expense',
  'IT Ticketing',
  'Calendar/Rooms',
  'Project Tools',
  'Events'
];




