// PHASE C: Convert HTML to Markdown

import fs from 'fs';
import path from 'path';
import TurndownService from 'turndown';
// @ts-ignore
import { gfm } from 'turndown-plugin-gfm';
import { ContentFrontmatter, Category } from '../lib/content/types';

const RAW_DIR = path.join(process.cwd(), 'migration', 'raw');
const CONTENT_DIR = path.join(process.cwd(), 'content', 'pages');
const EXPORTS_DIR = path.join(process.cwd(), 'migration', 'exports');

interface CrawledPage {
  url: string;
  title: string;
  slug: string;
}

/**
 * Initialize Turndown with custom rules
 */
function createTurndownService(): TurndownService {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '*',
    strongDelimiter: '**',
  });

  turndownService.use(gfm);

  // Custom rules
  turndownService.addRule('strikethrough', {
    filter: ['del', 's', 'strike' as any],
    replacement: (content) => `~~${content}~~`,
  });

  turndownService.addRule('lineBreak', {
    filter: 'br',
    replacement: () => '\n',
  });

  return turndownService;
}

/**
 * Clean HTML before conversion
 */
function cleanHtml(html: string): string {
  return html
    // Remove script and style tags
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // Remove empty divs and spans
    .replace(/<div[^>]*>\s*<\/div>/gi, '')
    .replace(/<span[^>]*>\s*<\/span>/gi, '')
    // Remove comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Clean up whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Clean markdown after conversion
 */
function cleanMarkdown(markdown: string): string {
  return markdown
    // Remove excessive blank lines
    .replace(/\n{3,}/g, '\n\n')
    // Remove leading/trailing whitespace from lines
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    // Remove empty lines at start/end
    .replace(/^\n+|\n+$/g, '')
    .trim();
}

/**
 * Extract summary from content (first 1-2 sentences)
 */
function extractSummary(content: string): string {
  // Remove markdown formatting for summary
  const text = content
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .trim();
  
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  if (sentences.length === 0) {
    return text.substring(0, 200).trim() + (text.length > 200 ? '...' : '');
  }
  
  const summary = sentences.slice(0, 2).join(' ').trim();
  return summary.length > 250 ? summary.substring(0, 250).trim() + '...' : summary;
}

/**
 * Determine category from URL and title
 */
function determineCategory(url: string, title: string): Category {
  const urlLower = url.toLowerCase();
  const titleLower = title.toLowerCase();
  
  // Check URL patterns
  if (urlLower.includes('/policy') || urlLower.includes('/policies')) return 'policies';
  if (urlLower.includes('/task') || urlLower.includes('/how-to') || urlLower.includes('/guide')) return 'tasks';
  if (urlLower.includes('/team') || urlLower.includes('/department')) return 'teams';
  if (urlLower.includes('/tool') || urlLower.includes('/app') || urlLower.includes('/system')) return 'tools';
  if (urlLower.includes('/news') || urlLower.includes('/announcement') || urlLower.includes('/update')) return 'news';
  if (urlLower.includes('/about') || urlLower.includes('/overview')) return 'about';
  
  // Check title patterns
  if (titleLower.includes('policy') || titleLower.includes('procedure')) return 'policies';
  if (titleLower.includes('how to') || titleLower.includes('request') || titleLower.includes('submit')) return 'tasks';
  if (titleLower.includes('team') || titleLower.includes('department')) return 'teams';
  if (titleLower.includes('tool') || titleLower.includes('application')) return 'tools';
  if (titleLower.includes('news') || titleLower.includes('announcement')) return 'news';
  
  // Default based on common sections
  if (titleLower.includes('institutional') || titleLower.includes('division overview')) return 'about';
  if (titleLower.includes('deia') || titleLower.includes('maturity')) return 'policies';
  if (titleLower.includes('budget') || titleLower.includes('purchasing')) return 'tasks';
  if (titleLower.includes('programming') || titleLower.includes('event')) return 'tasks';
  if (titleLower.includes('student leadership') || titleLower.includes('student employment')) return 'tasks';
  
  return 'policies'; // Default
}

/**
 * Extract tags from content and title
 */
function extractTags(url: string, title: string, content: string): string[] {
  const tags = new Set<string>();
  const allText = `${url} ${title} ${content}`.toLowerCase();
  
  // Common tags based on keywords
  const tagKeywords: Record<string, string[]> = {
    'hr': ['hr', 'human resources', 'employment', 'hiring'],
    'finance': ['budget', 'finance', 'purchasing', 'expense', 'purchase'],
    'it': ['it', 'technology', 'tech', 'computer', 'system'],
    'facilities': ['facilities', 'space', 'room', 'building'],
    'events': ['event', 'programming', 'program', 'meeting'],
    'policy': ['policy', 'procedure', 'guideline', 'rule'],
    'deia': ['deia', 'diversity', 'equity', 'inclusion', 'accessibility'],
    'student': ['student', 'leadership', 'employment'],
    'communication': ['communication', 'news', 'announcement', 'update'],
  };
  
  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some(keyword => allText.includes(keyword))) {
      tags.add(tag);
    }
  }
  
  // Add category-based tag
  const category = determineCategory(url, title);
  tags.add(category);
  
  return Array.from(tags);
}

/**
 * Convert HTML file to Markdown
 */
function convertHtmlToMarkdown(
  htmlPath: string,
  page: CrawledPage
): { frontmatter: Partial<ContentFrontmatter>; content: string } {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const cleanedHtml = cleanHtml(html);
  
  const turndownService = createTurndownService();
  let markdown = turndownService.turndown(cleanedHtml);
  markdown = cleanMarkdown(markdown);
  
  // Extract metadata
  const category = determineCategory(page.url, page.title);
  const tags = extractTags(page.url, page.title, markdown);
  const summary = extractSummary(markdown);
  
  const frontmatter: Partial<ContentFrontmatter> = {
    title: page.title,
    slug: page.slug,
    category,
    audience: ['all'],
    tags,
    summary,
    sourceUrl: page.url,
  };
  
  return { frontmatter, content: markdown };
}

/**
 * Generate YAML frontmatter
 */
function generateFrontmatter(frontmatter: Partial<ContentFrontmatter>): string {
  const lines: string[] = [];
  
  if (frontmatter.title) lines.push(`title: "${escapeYaml(frontmatter.title)}"`);
  if (frontmatter.slug) lines.push(`slug: "${frontmatter.slug}"`);
  if (frontmatter.category) lines.push(`category: "${frontmatter.category}"`);
  if (frontmatter.audience) {
    lines.push(`audience: [${frontmatter.audience.map(a => `"${a}"`).join(', ')}]`);
  }
  if (frontmatter.tags && frontmatter.tags.length > 0) {
    lines.push(`tags: [${frontmatter.tags.map(t => `"${t}"`).join(', ')}]`);
  }
  if (frontmatter.summary) {
    lines.push(`summary: "${escapeYaml(frontmatter.summary)}"`);
  }
  if (frontmatter.sourceUrl) {
    lines.push(`sourceUrl: "${frontmatter.sourceUrl}"`);
  }
  
  return lines.join('\n');
}

function escapeYaml(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
}

/**
 * Main conversion function
 */
async function main() {
  console.log('📝 PHASE C: Converting HTML to Markdown...\n');
  
  // Load crawled pages
  const crawledPagesPath = path.join(EXPORTS_DIR, 'crawled-pages.json');
  if (!fs.existsSync(crawledPagesPath)) {
    console.error('❌ crawled-pages.json not found. Run crawl first.');
    process.exit(1);
  }
  
  const crawledPages: CrawledPage[] = JSON.parse(
    fs.readFileSync(crawledPagesPath, 'utf8')
  );
  
  console.log(`   Converting ${crawledPages.length} pages...\n`);
  
  const migrationMap: Array<{ oldUrl: string; newSlug: string; category: string }> = [];
  
  for (let i = 0; i < crawledPages.length; i++) {
    const page = crawledPages[i];
    const htmlPath = path.join(RAW_DIR, `${page.slug}.html`);
    
    if (!fs.existsSync(htmlPath)) {
      console.log(`   ⚠️  [${i + 1}/${crawledPages.length}] HTML not found: ${page.slug}.html`);
      continue;
    }
    
    console.log(`   [${i + 1}/${crawledPages.length}] Converting: ${page.title}`);
    
    try {
      const { frontmatter, content } = convertHtmlToMarkdown(htmlPath, page);
      
      // Ensure category directory exists
      const categoryDir = path.join(CONTENT_DIR, frontmatter.category!);
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
      }
      
      // Write markdown file
      const markdownPath = path.join(categoryDir, `${frontmatter.slug}.md`);
      const frontmatterYaml = generateFrontmatter(frontmatter);
      const markdownContent = `---\n${frontmatterYaml}\n---\n\n${content}\n`;
      
      fs.writeFileSync(markdownPath, markdownContent, 'utf8');
      
      migrationMap.push({
        oldUrl: page.url,
        newSlug: frontmatter.slug!,
        category: frontmatter.category!,
      });
      
    } catch (error: any) {
      console.log(`   ❌ Error converting ${page.slug}: ${error.message}`);
    }
  }
  
  // Save migration map
  fs.writeFileSync(
    path.join(EXPORTS_DIR, 'migration-map.json'),
    JSON.stringify(migrationMap, null, 2),
    'utf8'
  );
  
  console.log(`\n✅ Conversion complete!`);
  console.log(`   Pages converted: ${migrationMap.length}`);
  console.log(`   Markdown files saved to: content/pages/`);
  console.log(`   Migration map saved to: migration/exports/migration-map.json\n`);
}

main();

