// HTML to Markdown converter utility

import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

/**
 * Convert HTML content to Markdown
 */
export function htmlToMarkdown(html: string): string {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '*',
    strongDelimiter: '**',
  });

  // Add GitHub Flavored Markdown plugin
  turndownService.use(gfm);

  // Configure custom rules
  turndownService.addRule('strikethrough', {
    filter: ['del', 's', 'strike'],
    replacement: (content) => `~~${content}~~`,
  });

  // Preserve line breaks
  turndownService.addRule('lineBreak', {
    filter: 'br',
    replacement: () => '\n',
  });

  // Convert images
  turndownService.addRule('image', {
    filter: 'img',
    replacement: (content, node: any) => {
      const alt = node.alt || '';
      const src = node.src || '';
      const title = node.title ? ` "${node.title}"` : '';
      return `![${alt}](${src}${title})`;
    },
  });

  // Convert links
  turndownService.addRule('link', {
    filter: 'a',
    replacement: (content, node: any) => {
      const href = node.href || '';
      const title = node.title ? ` "${node.title}"` : '';
      return `[${content}](${href}${title})`;
    },
  });

  try {
    return turndownService.turndown(html);
  } catch (error) {
    console.error('Error converting HTML to Markdown:', error);
    return html; // Fallback to original HTML if conversion fails
  }
}

/**
 * Clean up markdown content
 */
export function cleanMarkdown(markdown: string): string {
  return markdown
    // Remove excessive blank lines
    .replace(/\n{3,}/g, '\n\n')
    // Trim whitespace
    .trim();
}

