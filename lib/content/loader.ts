// Content loader utilities

import 'server-only';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ContentPage, ContentFrontmatter, Category, Person, NavigationConfig, TagsConfig } from './types';

const contentDirectory = path.join(process.cwd(), 'content');

/**
 * Get all content pages for a specific category
 */
export function getContentPages(category: Category): ContentPage[] {
  const categoryDir = path.join(contentDirectory, 'pages', category);
  
  if (!fs.existsSync(categoryDir)) {
    return [];
  }

  const files = fs.readdirSync(categoryDir);
  const pages: ContentPage[] = [];

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const filePath = path.join(categoryDir, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    pages.push({
      frontmatter: data as ContentFrontmatter,
      content,
    });
  }

  return pages.sort((a, b) => {
    // Sort by title alphabetically
    return a.frontmatter.title.localeCompare(b.frontmatter.title);
  });
}

/**
 * Get a single content page by slug
 */
export function getContentPage(category: Category, slug: string): ContentPage | null {
  const categoryDir = path.join(contentDirectory, 'pages', category);
  const filePath = path.join(categoryDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    frontmatter: data as ContentFrontmatter,
    content,
  };
}

/**
 * Get all slugs for a category (for static generation)
 */
export function getContentSlugs(category: Category): string[] {
  const pages = getContentPages(category);
  return pages.map(page => page.frontmatter.slug);
}

/**
 * Get all people from directory
 */
export function getPeople(): Person[] {
  const filePath = path.join(contentDirectory, 'directory', 'people.json');
  
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents) as Person[];
}

/**
 * Get a single person by ID
 */
export function getPerson(id: string): Person | null {
  const people = getPeople();
  return people.find(p => p.id === id) || null;
}

/**
 * Get navigation configuration
 */
export function getNavigation(): NavigationConfig {
  const filePath = path.join(contentDirectory, 'navigation.json');
  
  if (!fs.existsSync(filePath)) {
    // Return default navigation
    return {
      main: [
        { label: 'Home', href: '/' },
        { label: 'Tasks & Services', href: '/tasks' },
        { label: 'Policies', href: '/policies' },
        { label: 'Teams', href: '/teams' },
        { label: 'Tools', href: '/tools' },
        { label: 'News', href: '/news' },
        { label: 'Directory', href: '/directory' },
      ],
    };
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents) as NavigationConfig;
}

/**
 * Get tags configuration
 */
export function getTags(): TagsConfig {
  const filePath = path.join(contentDirectory, 'tags.json');
  
  if (!fs.existsSync(filePath)) {
    return { tags: [] };
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents) as TagsConfig;
}

/**
 * Search content across all categories
 */
export function searchContent(query: string, categories?: Category[]): ContentPage[] {
  const allCategories: Category[] = categories || ['tasks', 'policies', 'teams', 'tools', 'news'];
  const results: ContentPage[] = [];
  const lowerQuery = query.toLowerCase();

  for (const category of allCategories) {
    const pages = getContentPages(category);
    
    for (const page of pages) {
      const searchableText = [
        page.frontmatter.title,
        page.frontmatter.summary,
        page.content,
        ...(page.frontmatter.tags || []),
      ].join(' ').toLowerCase();

      if (searchableText.includes(lowerQuery)) {
        results.push(page);
      }
    }
  }

  return results;
}

