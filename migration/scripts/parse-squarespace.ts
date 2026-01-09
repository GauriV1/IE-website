// Squarespace XML export parser

import fs from 'fs';
import path from 'path';
import { parseString } from 'xml2js';
import { promisify } from 'util';
import { htmlToMarkdown, cleanMarkdown } from './html-to-markdown';
import { ContentFrontmatter, Category } from '../../lib/content/types';

const parseStringAsync = promisify(parseString);

interface SquarespacePage {
  title: string;
  url: string;
  content: string;
  excerpt?: string;
  date?: string;
  category?: string;
  tags?: string[];
}

interface ParsedPage {
  frontmatter: Partial<ContentFrontmatter>;
  content: string;
  originalUrl: string;
}

/**
 * Parse Squarespace XML export file
 */
export async function parseSquarespaceExport(
  xmlFilePath: string
): Promise<SquarespacePage[]> {
  if (!fs.existsSync(xmlFilePath)) {
    throw new Error(`XML file not found: ${xmlFilePath}`);
  }

  const xmlContent = fs.readFileSync(xmlFilePath, 'utf8');
  
  return parseStringAsync(xmlContent).then((result) => {
    const pages: SquarespacePage[] = [];
    
    // Squarespace exports typically have a structure like:
    // <rss><channel><item>...</item></channel></rss>
    // or <squarespace><page>...</page></squarespace>
    
    try {
      // Try RSS format first
      if (result.rss && result.rss.channel && result.rss.channel[0].item) {
        const items = result.rss.channel[0].item;
        for (const item of items) {
          pages.push({
            title: item.title?.[0] || 'Untitled',
            url: item.link?.[0] || '',
            content: item['content:encoded']?.[0] || item.description?.[0] || '',
            excerpt: item.description?.[0] || '',
            date: item.pubDate?.[0] || '',
            category: item.category?.[0] || '',
            tags: item.category?.map((c: any) => c._ || c) || [],
          });
        }
      }
      // Try custom Squarespace format
      else if (result.squarespace && result.squarespace.page) {
        for (const page of result.squarespace.page) {
          pages.push({
            title: page.title?.[0] || 'Untitled',
            url: page.url?.[0] || '',
            content: page.content?.[0] || '',
            excerpt: page.excerpt?.[0] || '',
            date: page.date?.[0] || '',
            category: page.category?.[0] || '',
            tags: page.tag?.map((t: any) => t._ || t) || [],
          });
        }
      }
      // Try WordPress format (some Squarespace exports use this)
      else if (result.rss && result.rss.channel) {
        const channel = result.rss.channel[0];
        if (channel.item) {
          for (const item of channel.item) {
            pages.push({
              title: item.title?.[0] || 'Untitled',
              url: item.link?.[0] || '',
              content: item['content:encoded']?.[0] || item.description?.[0] || '',
              excerpt: item.description?.[0] || '',
              date: item.pubDate?.[0] || '',
              category: item.category?.[0] || '',
              tags: item.category?.map((c: any) => c._ || c) || [],
            });
          }
        }
      }
      
      return pages;
    } catch (parseError: any) {
      throw new Error(`Failed to parse XML structure: ${parseError.message || parseError}`);
    }
  });
}

/**
 * Convert Squarespace page to our content format
 */
export function convertSquarespacePage(
  page: SquarespacePage,
  category: Category
): ParsedPage {
  // Convert HTML content to Markdown
  const markdownContent = cleanMarkdown(htmlToMarkdown(page.content));
  
  // Generate slug from URL or title
  const slug = generateSlug(page.url || page.title);
  
  // Determine audience (default to 'all' if not specified)
  const audience: string[] = ['all'];
  
  // Extract tags
  const tags = page.tags || [];
  if (page.category) {
    tags.push(page.category.toLowerCase());
  }
  
  // Build frontmatter
  const frontmatter: Partial<ContentFrontmatter> = {
    title: page.title,
    slug,
    category,
    audience: audience as any,
    tags: [...new Set(tags)], // Remove duplicates
    summary: extractSummary(page.excerpt || page.content),
    sourceUrl: page.url,
  };
  
  // Add category-specific fields
  if (page.date) {
    frontmatter.lastUpdated = formatDate(page.date);
  }
  
  if (category === 'news' && page.excerpt) {
    frontmatter.excerpt = page.excerpt;
    frontmatter.date = formatDate(page.date || new Date().toISOString());
  }
  
  return {
    frontmatter,
    content: markdownContent,
    originalUrl: page.url,
  };
}

/**
 * Generate URL-friendly slug from URL or title
 */
function generateSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/^https?:\/\/[^\/]+/, '') // Remove domain
    .replace(/^\//, '') // Remove leading slash
    .replace(/\/$/, '') // Remove trailing slash
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    || 'untitled';
}

/**
 * Extract summary from content (first 2-3 sentences)
 */
function extractSummary(content: string, maxLength: number = 200): string {
  // Remove HTML tags if present
  const text = content.replace(/<[^>]*>/g, ' ').trim();
  
  // Try to get first 2-3 sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  let summary = sentences.slice(0, 2).join(' ').trim();
  
  // If too long, truncate
  if (summary.length > maxLength) {
    summary = summary.substring(0, maxLength).trim();
    // Don't cut in the middle of a word
    const lastSpace = summary.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      summary = summary.substring(0, lastSpace);
    }
    summary += '...';
  }
  
  return summary || text.substring(0, maxLength) + '...';
}

/**
 * Format date string to YYYY-MM-DD
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

