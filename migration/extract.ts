// PHASE 3: Extract main content from HTML and convert to Markdown (COPY-ONLY)
// Minimal frontmatter: title, slug, sourceUrl
// Skips error pages and preserves content as-is

import fs from 'fs';
import path from 'path';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const RAW_DIR = path.join(process.cwd(), 'migration', 'raw');
const HTML_DIR = path.join(RAW_DIR, 'html');
const META_DIR = path.join(RAW_DIR, 'meta');
const CONTENT_DIR = path.join(process.cwd(), 'content', 'pages');
const EXPORTS_DIR = path.join(process.cwd(), 'migration', 'exports');

interface PageMeta {
  url: string;
  slug: string;
  title: string;
  timestamp: string;
}

interface MigrationMap {
  [sourceUrl: string]: string; // sourceUrl -> slug
}

/**
 * Check if HTML contains error page content
 * Only checks main content area, not scripts/metadata
 */
function isErrorPage(html: string): boolean {
  // First extract main content to avoid false positives from scripts
  const mainContent = extractMainContent(html);
  
  // If we can't find main content, it might be an error page
  if (!mainContent || mainContent.trim().length < 100) {
    return true;
  }
  
  const errorIndicators = [
    "we couldn't find the page you were looking for",
    "page not found",
    "this page doesn't exist",
    "the page you're looking for doesn't exist",
  ];
  
  const lowerContent = mainContent.toLowerCase();
  
  // Check for error indicators in main content only
  // Also check if content is suspiciously short (likely error page)
  const hasErrorText = errorIndicators.some(indicator => 
    lowerContent.includes(indicator)
  );
  
  // Check for 404 in visible text (not in URLs or IDs)
  const has404 = /\b404\b/.test(lowerContent) && 
    !lowerContent.includes('http') && // Not in URLs
    lowerContent.length < 500; // Short content with 404 is likely error
  
  return hasErrorText || has404;
}


/**
 * Extract main content from HTML using regex (no DOM parsing)
 * Prefers <main>, else picks container with highest text density
 */
function extractMainContent(html: string): string {
  // Try <main> first
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    return mainMatch[1];
  }
  
  // Try role="main"
  const roleMainMatch = html.match(/<[^>]+role=["']main["'][^>]*>([\s\S]*?)<\/[^>]+>/i);
  if (roleMainMatch) {
    return roleMainMatch[1];
  }
  
  // Try common content selectors (simple regex approach)
  const contentSelectors = [
    { pattern: /<article[^>]*>([\s\S]*?)<\/article>/i, name: 'article' },
    { pattern: /<div[^>]*class=["'][^"']*main-content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i, name: '.main-content' },
    { pattern: /<div[^>]*class=["'][^"']*content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i, name: '.content' },
    { pattern: /<div[^>]*class=["'][^"']*page-content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i, name: '.page-content' },
    { pattern: /<div[^>]*id=["']main-content["'][^>]*>([\s\S]*?)<\/div>/i, name: '#main-content' },
    { pattern: /<div[^>]*class=["'][^"']*sqs-block-content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i, name: '.sqs-block-content' },
  ];
  
  for (const { pattern } of contentSelectors) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // Fallback: remove header, nav, footer, script, style and return body content
  let cleaned = html
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<div[^>]*class=["'][^"']*header[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class=["'][^"']*nav[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class=["'][^"']*footer[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class=["'][^"']*sidebar[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class=["'][^"']*menu[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '');
  
  // Extract body content if present
  const bodyMatch = cleaned.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    return bodyMatch[1];
  }
  
  return cleaned;
}

/**
 * Minimal cleaning: remove excessive whitespace and empty lines
 */
function cleanMarkdown(markdown: string): string {
  // Remove multiple consecutive blank lines (max 2)
  let cleaned = markdown.replace(/\n{3,}/g, '\n\n');
  
  // Remove trailing whitespace from lines
  cleaned = cleaned.split('\n').map(line => line.trimEnd()).join('\n');
  
  // Remove leading/trailing blank lines
  cleaned = cleaned.trim();
  
  return cleaned;
}

/**
 * Convert HTML to Markdown
 */
function htmlToMarkdown(html: string): string {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
  });
  
  turndownService.use(gfm);
  
  // Preserve tables
  turndownService.addRule('table', {
    filter: 'table',
    replacement: (content, node) => {
      const table = node as HTMLTableElement;
      let markdown = '\n';
      
      // Header row
      const headerRow = table.querySelector('thead tr, tr:first-child');
      if (headerRow) {
        const headers = Array.from(headerRow.querySelectorAll('th, td')).map(cell => 
          (cell.textContent || '').trim()
        );
        markdown += '| ' + headers.join(' | ') + ' |\n';
        markdown += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
      }
      
      // Body rows
      const bodyRows = Array.from(table.querySelectorAll('tbody tr, tr:not(:first-child)'));
      for (const row of bodyRows) {
        const cells = Array.from(row.querySelectorAll('td')).map(cell => 
          (cell.textContent || '').trim()
        );
        if (cells.length > 0) {
          markdown += '| ' + cells.join(' | ') + ' |\n';
        }
      }
      
      return markdown;
    },
  });
  
  return turndownService.turndown(html);
}

/**
 * Process a single HTML file
 */
function processHtmlFile(slug: string): { success: boolean; error?: string } {
  const htmlPath = path.join(HTML_DIR, `${slug}.html`);
  const metaPath = path.join(META_DIR, `${slug}.json`);
  
  if (!fs.existsSync(htmlPath)) {
    return { success: false, error: 'HTML file not found' };
  }
  
  if (!fs.existsSync(metaPath)) {
    return { success: false, error: 'Meta file not found' };
  }
  
  const html = fs.readFileSync(htmlPath, 'utf8');
  const meta: PageMeta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  
  // Skip error pages
  if (isErrorPage(html)) {
    return { success: false, error: 'Error page detected' };
  }
  
  // Extract main content
  const mainContentHtml = extractMainContent(html);
  
  // Convert to markdown
  let markdown = htmlToMarkdown(mainContentHtml);
  
  // Minimal cleaning
  markdown = cleanMarkdown(markdown);
  
  // Create frontmatter (minimal: title, slug, sourceUrl)
  const frontmatter = `---
title: "${meta.title.replace(/"/g, '\\"')}"
slug: "${slug}"
sourceUrl: "${meta.url}"
---
`;
  
  const fullMarkdown = frontmatter + '\n' + markdown;
  
  // Write to content/pages/<slug>.md
  const outputPath = path.join(CONTENT_DIR, `${slug}.md`);
  fs.writeFileSync(outputPath, fullMarkdown, 'utf8');
  
  return { success: true };
}

/**
 * Main extraction function
 */
function extract(): void {
  console.log('📝 PHASE 3: Extracting main content and converting to Markdown...\n');
  
  // Ensure content directory exists
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
  
  // Get all HTML files
  if (!fs.existsSync(HTML_DIR)) {
    console.error('   ❌ HTML directory not found. Run PHASE 2 (crawl) first.');
    return;
  }
  
  const htmlFiles = fs.readdirSync(HTML_DIR)
    .filter(file => file.endsWith('.html'))
    .map(file => file.replace('.html', ''));
  
  if (htmlFiles.length === 0) {
    console.error('   ❌ No HTML files found. Run PHASE 2 (crawl) first.');
    return;
  }
  
  console.log(`   📋 Processing ${htmlFiles.length} HTML files...\n`);
  
  const migrationMap: MigrationMap = {};
  const badPages: Array<{ url: string; slug: string; reason: string }> = [];
  let successCount = 0;
  
  for (const slug of htmlFiles) {
    const result = processHtmlFile(slug);
    
    if (result.success) {
      // Load meta to get URL
      const metaPath = path.join(META_DIR, `${slug}.json`);
      if (fs.existsSync(metaPath)) {
        const meta: PageMeta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        migrationMap[meta.url] = slug;
        successCount++;
        console.log(`   ✅ ${slug}`);
      }
    } else {
      // Load meta to get URL
      const metaPath = path.join(META_DIR, `${slug}.json`);
      if (fs.existsSync(metaPath)) {
        const meta: PageMeta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        badPages.push({
          url: meta.url,
          slug,
          reason: result.error || 'Unknown error',
        });
        console.log(`   ⚠️  ${slug} - ${result.error}`);
      }
    }
  }
  
  // Save migration map
  const mapPath = path.join(EXPORTS_DIR, 'migration-map.json');
  fs.writeFileSync(mapPath, JSON.stringify(migrationMap, null, 2), 'utf8');
  
  // Save bad pages
  const badPagesPath = path.join(EXPORTS_DIR, 'bad-pages.json');
  fs.writeFileSync(badPagesPath, JSON.stringify(badPages, null, 2), 'utf8');
  
  console.log(`\n✅ PHASE 3 Complete: Extracted ${successCount}/${htmlFiles.length} pages`);
  console.log(`   📄 Markdown files saved to: ${CONTENT_DIR}`);
  console.log(`   📋 Migration map saved to: ${mapPath}`);
  console.log(`   ⚠️  Bad pages saved to: ${badPagesPath}`);
  console.log(`   📊 Skipped: ${badPages.length} pages\n`);
}

// Run if executed directly
if (require.main === module) {
  extract();
  console.log('🎉 Extraction complete');
  process.exit(0);
}

export { extract };

