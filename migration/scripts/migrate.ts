// Main migration script - orchestrates the migration process

import fs from 'fs';
import path from 'path';
import { parseSquarespaceExport, convertSquarespacePage } from './parse-squarespace';
import { ContentFrontmatter, Category } from '../../lib/content/types';

interface MigrationMapping {
  oldUrl: string;
  newSlug: string;
  category: Category;
  title: string;
  status: 'success' | 'skipped' | 'error';
  error?: string;
}

interface MigrationReport {
  totalPages: number;
  migrated: number;
  skipped: number;
  errors: number;
  mappings: MigrationMapping[];
  categories: Record<Category, number>;
}

/**
 * Main migration function
 */
export async function migrateContent(
  xmlFilePath: string,
  outputDir: string = path.join(process.cwd(), 'migration', 'output')
): Promise<MigrationReport> {
  console.log('🚀 Starting content migration...\n');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Parse Squarespace export
  console.log('📖 Parsing Squarespace export...');
  const squarespacePages = await parseSquarespaceExport(xmlFilePath);
  console.log(`   Found ${squarespacePages.length} pages\n`);
  
  const report: MigrationReport = {
    totalPages: squarespacePages.length,
    migrated: 0,
    skipped: 0,
    errors: 0,
    mappings: [],
    categories: {
      tasks: 0,
      policies: 0,
      teams: 0,
      tools: 0,
      news: 0,
      directory: 0,
      about: 0,
    },
  };
  
  // Process each page
  for (const page of squarespacePages) {
    try {
      // Determine category from URL or content
      const category = determineCategory(page.url, page.title, page.category);
      
      // Convert page
      const converted = convertSquarespacePage(page, category);
      
      // Validate required fields
      if (!converted.frontmatter.title || !converted.frontmatter.slug) {
        report.skipped++;
        report.mappings.push({
          oldUrl: page.url,
          newSlug: converted.frontmatter.slug || 'unknown',
          category,
          title: page.title,
          status: 'skipped',
          error: 'Missing required fields',
        });
        continue;
      }
      
      // Write markdown file
      const categoryDir = path.join(outputDir, 'pages', category);
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
      }
      
      const filePath = path.join(categoryDir, `${converted.frontmatter.slug}.md`);
      const markdownContent = generateMarkdownFile(converted.frontmatter, converted.content);
      
      fs.writeFileSync(filePath, markdownContent, 'utf8');
      
      report.migrated++;
      report.categories[category]++;
      report.mappings.push({
        oldUrl: page.url,
        newSlug: converted.frontmatter.slug!,
        category,
        title: converted.frontmatter.title!,
        status: 'success',
      });
      
      console.log(`✅ Migrated: ${converted.frontmatter.title} → ${category}/${converted.frontmatter.slug}.md`);
    } catch (error: any) {
      report.errors++;
      report.mappings.push({
        oldUrl: page.url,
        newSlug: 'error',
        category: 'tasks', // Default
        title: page.title,
        status: 'error',
        error: error.message || 'Unknown error',
      });
      console.error(`❌ Error migrating ${page.title}:`, error.message);
    }
  }
  
  // Write migration mapping file
  const mappingPath = path.join(outputDir, 'migration-map.json');
  fs.writeFileSync(
    mappingPath,
    JSON.stringify(report.mappings, null, 2),
    'utf8'
  );
  
  // Write summary report
  const reportPath = path.join(outputDir, 'migration-report.json');
  fs.writeFileSync(
    reportPath,
    JSON.stringify(report, null, 2),
    'utf8'
  );
  
  // Print summary
  console.log('\n📊 Migration Summary:');
  console.log(`   Total pages: ${report.totalPages}`);
  console.log(`   ✅ Migrated: ${report.migrated}`);
  console.log(`   ⏭️  Skipped: ${report.skipped}`);
  console.log(`   ❌ Errors: ${report.errors}`);
  console.log(`\n   By category:`);
  Object.entries(report.categories).forEach(([cat, count]) => {
    if (count > 0) {
      console.log(`     ${cat}: ${count}`);
    }
  });
  console.log(`\n📁 Output directory: ${outputDir}`);
  console.log(`📋 Mapping file: ${mappingPath}`);
  console.log(`📄 Report file: ${reportPath}\n`);
  
  return report;
}

/**
 * Determine content category from URL, title, or category
 */
function determineCategory(
  url: string,
  title: string,
  category?: string
): Category {
  const urlLower = url.toLowerCase();
  const titleLower = title.toLowerCase();
  const categoryLower = category?.toLowerCase() || '';
  
  // Check URL patterns
  if (urlLower.includes('/task') || urlLower.includes('/how-to') || urlLower.includes('/guide')) {
    return 'tasks';
  }
  if (urlLower.includes('/policy') || urlLower.includes('/procedure')) {
    return 'policies';
  }
  if (urlLower.includes('/team') || urlLower.includes('/department')) {
    return 'teams';
  }
  if (urlLower.includes('/tool') || urlLower.includes('/app') || urlLower.includes('/system')) {
    return 'tools';
  }
  if (urlLower.includes('/news') || urlLower.includes('/announcement') || urlLower.includes('/update')) {
    return 'news';
  }
  
  // Check category field
  if (categoryLower.includes('task') || categoryLower.includes('how-to')) {
    return 'tasks';
  }
  if (categoryLower.includes('policy')) {
    return 'policies';
  }
  if (categoryLower.includes('team')) {
    return 'teams';
  }
  if (categoryLower.includes('tool')) {
    return 'tools';
  }
  if (categoryLower.includes('news')) {
    return 'news';
  }
  
  // Check title patterns
  if (titleLower.includes('how to') || titleLower.includes('request') || titleLower.includes('submit')) {
    return 'tasks';
  }
  if (titleLower.includes('policy')) {
    return 'policies';
  }
  
  // Default to tasks
  return 'tasks';
}

/**
 * Generate markdown file with frontmatter
 */
function generateMarkdownFile(
  frontmatter: Partial<ContentFrontmatter>,
  content: string
): string {
  const yaml = generateYamlFrontmatter(frontmatter);
  return `---\n${yaml}---\n\n${content}\n`;
}

/**
 * Generate YAML frontmatter from frontmatter object
 */
function generateYamlFrontmatter(frontmatter: Partial<ContentFrontmatter>): string {
  const lines: string[] = [];
  
  // Required fields
  if (frontmatter.title) lines.push(`title: "${escapeYamlString(frontmatter.title)}"`);
  if (frontmatter.slug) lines.push(`slug: "${frontmatter.slug}"`);
  if (frontmatter.category) lines.push(`category: "${frontmatter.category}"`);
  if (frontmatter.audience) {
    lines.push(`audience: [${frontmatter.audience.map(a => `"${a}"`).join(', ')}]`);
  }
  if (frontmatter.tags && frontmatter.tags.length > 0) {
    lines.push(`tags: [${frontmatter.tags.map(t => `"${t}"`).join(', ')}]`);
  }
  if (frontmatter.summary) {
    lines.push(`summary: "${escapeYamlString(frontmatter.summary)}"`);
  }
  
  // Optional fields
  if (frontmatter.lastUpdated) lines.push(`lastUpdated: "${frontmatter.lastUpdated}"`);
  if (frontmatter.sourceUrl) lines.push(`sourceUrl: "${frontmatter.sourceUrl}"`);
  
  // Category-specific fields
  if (frontmatter.steps && frontmatter.steps.length > 0) {
    lines.push(`steps:`);
    frontmatter.steps.forEach(step => {
      lines.push(`  - "${escapeYamlString(step)}"`);
    });
  }
  
  if (frontmatter.keyBullets && frontmatter.keyBullets.length > 0) {
    lines.push(`keyBullets:`);
    frontmatter.keyBullets.forEach(bullet => {
      lines.push(`  - "${escapeYamlString(bullet)}"`);
    });
  }
  
  if (frontmatter.relatedLinks && frontmatter.relatedLinks.length > 0) {
    lines.push(`relatedLinks:`);
    frontmatter.relatedLinks.forEach(link => {
      lines.push(`  - type: "${link.type}"`);
      if (link.slug) lines.push(`    slug: "${link.slug}"`);
      if (link.name) lines.push(`    name: "${escapeYamlString(link.name)}"`);
      if (link.url) lines.push(`    url: "${link.url}"`);
    });
  }
  
  if (frontmatter.relatedPolicies && frontmatter.relatedPolicies.length > 0) {
    lines.push(`relatedPolicies:`);
    frontmatter.relatedPolicies.forEach(policy => {
      lines.push(`  - "${policy}"`);
    });
  }
  
  if (frontmatter.relatedTasks && frontmatter.relatedTasks.length > 0) {
    lines.push(`relatedTasks:`);
    frontmatter.relatedTasks.forEach(task => {
      lines.push(`  - "${task}"`);
    });
  }
  
  if (frontmatter.contacts && frontmatter.contacts.length > 0) {
    lines.push(`contacts:`);
    frontmatter.contacts.forEach(contact => {
      if (typeof contact === 'string') {
        lines.push(`  - "${contact}"`);
      } else {
        lines.push(`  - name: "${escapeYamlString(contact.name)}"`);
        lines.push(`    role: "${escapeYamlString(contact.role)}"`);
        lines.push(`    email: "${contact.email}"`);
      }
    });
  }
  
  if (frontmatter.excerpt) {
    lines.push(`excerpt: "${escapeYamlString(frontmatter.excerpt)}"`);
  }
  
  if (frontmatter.date) {
    lines.push(`date: "${frontmatter.date}"`);
  }
  
  if (frontmatter.mission) {
    lines.push(`mission: "${escapeYamlString(frontmatter.mission)}"`);
  }
  
  if (frontmatter.type) {
    lines.push(`type: "${frontmatter.type}"`);
  }
  
  if (frontmatter.url) {
    lines.push(`url: "${frontmatter.url}"`);
  }
  
  return lines.join('\n') + '\n';
}

/**
 * Escape special characters in YAML strings
 */
function escapeYamlString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
}

