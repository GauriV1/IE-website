// Content model types for the handbook

export type Audience = 'staff' | 'new-hire' | 'leadership' | 'external' | 'all';
export type Category = 'tasks' | 'policies' | 'teams' | 'tools' | 'news' | 'directory' | 'about';

export interface RelatedLink {
  type: 'policy' | 'task' | 'tool' | 'team' | 'form' | 'external';
  slug?: string;
  name?: string;
  url?: string;
}

export interface Attachment {
  name: string;
  url: string;
  type?: string;
}

export interface ContentFrontmatter {
  title: string;
  slug: string;
  category: Category;
  audience: Audience[];
  tags: string[];
  lastUpdated?: string;
  summary: string;
  relatedLinks?: RelatedLink[];
  attachments?: Attachment[];
  sourceUrl?: string; // Original Squarespace URL for migration tracking
  // Category-specific fields
  steps?: string[]; // For tasks
  keyBullets?: string[]; // For policies
  sections?: { title: string; content: string }[]; // For policies
  relatedForms?: string[]; // For tasks
  relatedPolicies?: string[]; // For tasks
  relatedTasks?: string[]; // For policies/teams
  relatedTools?: string[]; // For teams
  contacts?: (string | { name: string; role: string; email: string })[]; // For tasks/teams
  date?: string; // For news
  excerpt?: string; // For news
  mission?: string; // For teams
  type?: string; // For tools
  url?: string; // For tools
}

export interface ContentPage {
  frontmatter: ContentFrontmatter;
  content: string; // Markdown content
  html?: string; // Rendered HTML (optional, can be generated on-demand)
}

export interface Person {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  office?: string;
  tags?: string[];
  team?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface NavigationConfig {
  main: NavigationItem[];
  footer?: NavigationItem[];
}

export interface TagDefinition {
  id: string;
  name: string;
  description?: string;
  category?: Category;
  color?: string;
}

export interface TagsConfig {
  tags: TagDefinition[];
}

