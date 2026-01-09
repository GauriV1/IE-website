// Link checking utility

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ContentPage } from '../../lib/content/types';

interface LinkReference {
  url: string;
  type: 'internal' | 'external' | 'anchor' | 'asset';
  context: string;
  lineNumber?: number;
}

interface BrokenLink {
  page: string;
  link: string;
  type: string;
  context: string;
  error: string;
  lineNumber?: number;
}

/**
 * Extract all links from markdown content
 */
export function extractLinks(content: string, pageSlug: string): LinkReference[] {
  const links: LinkReference[] = [];
  const lines = content.split('\n');
  
  // Pattern for markdown links: [text](url)
  const markdownLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  // Pattern for HTML links: <a href="url">...</a>
  const htmlLinkPattern = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
  
  // Pattern for markdown images: ![alt](url)
  const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  
  // Pattern for HTML images: <img src="url" ...>
  const htmlImagePattern = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  
  lines.forEach((line, index) => {
    // Extract markdown links
    let match;
    while ((match = markdownLinkPattern.exec(line)) !== null) {
      const url = match[2];
      links.push({
        url,
        type: classifyLink(url),
        context: `markdown link: ${match[1]}`,
        lineNumber: index + 1,
      });
    }
    markdownLinkPattern.lastIndex = 0;
    
    // Extract HTML links
    while ((match = htmlLinkPattern.exec(line)) !== null) {
      const url = match[1];
      links.push({
        url,
        type: classifyLink(url),
        context: 'html link',
        lineNumber: index + 1,
      });
    }
    htmlLinkPattern.lastIndex = 0;
    
    // Extract markdown images
    while ((match = imagePattern.exec(line)) !== null) {
      const url = match[2];
      links.push({
        url,
        type: classifyLink(url),
        context: `markdown image: ${match[1]}`,
        lineNumber: index + 1,
      });
    }
    imagePattern.lastIndex = 0;
    
    // Extract HTML images
    while ((match = htmlImagePattern.exec(line)) !== null) {
      const url = match[1];
      links.push({
        url,
        type: classifyLink(url),
        context: 'html image',
        lineNumber: index + 1,
      });
    }
    htmlImagePattern.lastIndex = 0;
  });
  
  return links;
}

/**
 * Classify link type
 */
function classifyLink(url: string): 'internal' | 'external' | 'anchor' | 'asset' {
  if (url.startsWith('#')) {
    return 'anchor';
  }
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:')) {
    return 'external';
  }
  if (url.startsWith('/assets/') || url.startsWith('assets/')) {
    return 'asset';
  }
  if (url.startsWith('/') || !url.includes('://')) {
    return 'internal';
  }
  return 'external';
}

/**
 * Check if internal link is valid
 */
export function checkInternalLink(
  url: string,
  currentCategory: string,
  allPages: Map<string, ContentPage>,
  basePath: string = ''
): { valid: boolean; error?: string } {
  // Remove query params and hash
  const cleanUrl = url.split('?')[0].split('#')[0];
  
  // Handle relative paths
  if (cleanUrl.startsWith('./') || cleanUrl.startsWith('../')) {
    // Relative paths are tricky - skip for now or resolve relative to current page
    return { valid: true }; // Assume valid for relative paths
  }
  
  // Handle absolute paths
  if (cleanUrl.startsWith('/')) {
    // Remove leading slash
    const path = cleanUrl.substring(1);
    
    // Check if it's a known route
    const routePatterns = [
      /^tasks\/(.+)$/,
      /^policies\/(.+)$/,
      /^teams\/(.+)$/,
      /^tools\/(.+)$/,
      /^news\/(.+)$/,
      /^directory\/(.+)$/,
    ];
    
    for (const pattern of routePatterns) {
      const match = path.match(pattern);
      if (match) {
        const category = path.split('/')[0] as any;
        const slug = match[1];
        const pageKey = `${category}:${slug}`;
        
        if (allPages.has(pageKey)) {
          return { valid: true };
        } else {
          return { valid: false, error: `Page not found: ${category}/${slug}` };
        }
      }
    }
    
    // Check root routes
    if (path === '' || path === 'tasks' || path === 'policies' || path === 'teams' || path === 'tools' || path === 'news' || path === 'directory' || path === 'search') {
      return { valid: true };
    }
    
    return { valid: false, error: `Unknown route: ${path}` };
  }
  
  // Handle category:slug format (from frontmatter)
  if (cleanUrl.includes(':')) {
    const [category, slug] = cleanUrl.split(':');
    const pageKey = `${category}:${slug}`;
    if (allPages.has(pageKey)) {
      return { valid: true };
    }
    return { valid: false, error: `Page not found: ${category}/${slug}` };
  }
  
  // Try to find by slug in current category
  const pageKey = `${currentCategory}:${cleanUrl}`;
  if (allPages.has(pageKey)) {
    return { valid: true };
  }
  
  return { valid: false, error: `Page not found: ${currentCategory}/${cleanUrl}` };
}

/**
 * Check if asset exists
 */
export function checkAsset(url: string, assetsDir: string): { valid: boolean; error?: string } {
  // Remove query params
  const cleanUrl = url.split('?')[0];
  
  // Handle absolute paths
  if (cleanUrl.startsWith('/')) {
    const assetPath = path.join(assetsDir, cleanUrl.substring(1));
    if (fs.existsSync(assetPath)) {
      return { valid: true };
    }
    return { valid: false, error: `Asset not found: ${cleanUrl}` };
  }
  
  // Handle relative paths
  const assetPath = path.join(assetsDir, cleanUrl);
  if (fs.existsSync(assetPath)) {
    return { valid: true };
  }
  
  return { valid: false, error: `Asset not found: ${cleanUrl}` };
}

/**
 * Validate all links in a page
 */
export function validatePageLinks(
  page: ContentPage,
  pageSlug: string,
  allPages: Map<string, ContentPage>,
  assetsDir: string
): BrokenLink[] {
  const brokenLinks: BrokenLink[] = [];
  const links = extractLinks(page.content, pageSlug);
  
  for (const link of links) {
    if (link.type === 'internal') {
      const result = checkInternalLink(
        link.url,
        page.frontmatter.category,
        allPages
      );
      if (!result.valid) {
        brokenLinks.push({
          page: pageSlug,
          link: link.url,
          type: 'internal',
          context: link.context,
          error: result.error || 'Invalid link',
          lineNumber: link.lineNumber,
        });
      }
    } else if (link.type === 'asset') {
      const result = checkAsset(link.url, assetsDir);
      if (!result.valid) {
        brokenLinks.push({
          page: pageSlug,
          link: link.url,
          type: 'asset',
          context: link.context,
          error: result.error || 'Asset not found',
          lineNumber: link.lineNumber,
        });
      }
    }
    // External links and anchors are not checked (would require network requests)
  }
  
  // Check related links in frontmatter
  if (page.frontmatter.relatedLinks) {
    for (const relatedLink of page.frontmatter.relatedLinks) {
      if (relatedLink.slug) {
        const pageKey = `${relatedLink.type}:${relatedLink.slug}`;
        if (!allPages.has(pageKey)) {
          brokenLinks.push({
            page: pageSlug,
            link: `${relatedLink.type}/${relatedLink.slug}`,
            type: 'frontmatter',
            context: 'relatedLinks',
            error: `Related page not found: ${relatedLink.type}/${relatedLink.slug}`,
          });
        }
      }
    }
  }
  
  return brokenLinks;
}

