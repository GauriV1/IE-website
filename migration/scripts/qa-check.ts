// Comprehensive QA checking script

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ContentPage } from '../../lib/content/types';
import { validatePageLinks } from './check-links';
import { getNavigation } from '../../lib/content/loader.server';

interface QAIssue {
  type: 'broken-link' | 'missing-asset' | 'empty-page' | 'orphan-page' | 'missing-field' | 'invalid-frontmatter';
  severity: 'error' | 'warning' | 'info';
  page: string;
  category: string;
  message: string;
  details?: any;
}

interface QAReport {
  totalPages: number;
  issues: QAIssue[];
  summary: {
    errors: number;
    warnings: number;
    info: number;
    byType: Record<string, number>;
  };
  brokenLinks: number;
  missingAssets: number;
  emptyPages: number;
  orphanPages: number;
}

/**
 * Load all pages from directory
 */
function loadAllPages(pagesDir: string): Map<string, ContentPage> {
  const pages = new Map<string, ContentPage>();
  const categories = ['tasks', 'policies', 'teams', 'tools', 'news'];
  
  for (const category of categories) {
    const categoryDir = path.join(pagesDir, category);
    if (!fs.existsSync(categoryDir)) {
      continue;
    }
    
    const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      const filePath = path.join(categoryDir, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      
      const slug = data.slug || path.basename(file, '.md');
      const pageKey = `${category}:${slug}`;
      
      pages.set(pageKey, {
        frontmatter: data as any,
        content,
      });
    }
  }
  
  return pages;
}

/**
 * Check for empty pages
 */
function checkEmptyPages(pages: Map<string, ContentPage>): QAIssue[] {
  const issues: QAIssue[] = [];
  
  for (const [pageKey, page] of pages.entries()) {
    const [category, slug] = pageKey.split(':');
    
    // Check if content is empty or very short
    const contentLength = page.content.trim().length;
    if (contentLength === 0) {
      issues.push({
        type: 'empty-page',
        severity: 'error',
        page: slug,
        category,
        message: 'Page has no content',
        details: { contentLength: 0 },
      });
    } else if (contentLength < 50) {
      issues.push({
        type: 'empty-page',
        severity: 'warning',
        page: slug,
        category,
        message: `Page has very little content (${contentLength} characters)`,
        details: { contentLength },
      });
    }
    
    // Check if summary is missing or too short
    if (!page.frontmatter.summary || page.frontmatter.summary.trim().length < 10) {
      issues.push({
        type: 'missing-field',
        severity: 'warning',
        page: slug,
        category,
        message: 'Summary is missing or too short',
        details: { summary: page.frontmatter.summary },
      });
    }
  }
  
  return issues;
}

/**
 * Check for orphan pages (not in navigation)
 */
function checkOrphanPages(
  pages: Map<string, ContentPage>,
  navigation: any
): QAIssue[] {
  const issues: QAIssue[] = [];
  
  // Extract all slugs from navigation
  const navSlugs = new Set<string>();
  
  function extractSlugs(items: any[]) {
    for (const item of items) {
      if (item.href && item.href.startsWith('/')) {
        const path = item.href.substring(1);
        const parts = path.split('/');
        if (parts.length === 2) {
          navSlugs.add(`${parts[0]}:${parts[1]}`);
        }
      }
      if (item.children) {
        extractSlugs(item.children);
      }
    }
  }
  
  if (navigation.main) {
    extractSlugs(navigation.main);
  }
  
  // Check each page
  for (const [pageKey, page] of pages.entries()) {
    const [category, slug] = pageKey.split(':');
    
    // Skip if it's a listing page (slug matches category)
    if (slug === category) {
      continue;
    }
    
    if (!navSlugs.has(pageKey)) {
      issues.push({
        type: 'orphan-page',
        severity: 'info',
        page: slug,
        category,
        message: 'Page is not referenced in navigation',
        details: { pageKey },
      });
    }
  }
  
  return issues;
}

/**
 * Check for missing required fields
 */
function checkRequiredFields(pages: Map<string, ContentPage>): QAIssue[] {
  const issues: QAIssue[] = [];
  const requiredFields = ['title', 'slug', 'category', 'audience', 'tags', 'summary'];
  
  for (const [pageKey, page] of pages.entries()) {
    const [category, slug] = pageKey.split(':');
    
    for (const field of requiredFields) {
      if (!page.frontmatter[field]) {
        issues.push({
          type: 'missing-field',
          severity: 'error',
          page: slug,
          category,
          message: `Required field missing: ${field}`,
          details: { field },
        });
      }
    }
    
    // Validate category
    const validCategories = ['tasks', 'policies', 'teams', 'tools', 'news', 'directory', 'about'];
    if (page.frontmatter.category && !validCategories.includes(page.frontmatter.category)) {
      issues.push({
        type: 'invalid-frontmatter',
        severity: 'error',
        page: slug,
        category,
        message: `Invalid category: ${page.frontmatter.category}`,
        details: { field: 'category', value: page.frontmatter.category, validCategories },
      });
    }
  }
  
  return issues;
}

/**
 * Generate comprehensive QA report
 */
export function generateQAReport(
  pagesDir: string,
  assetsDir: string,
  outputDir: string
): QAReport {
  console.log('🔍 Running QA checks...\n');
  
  // Load all pages
  const pages = loadAllPages(pagesDir);
  console.log(`   Loaded ${pages.size} pages\n`);
  
  const issues: QAIssue[] = [];
  
  // Check empty pages
  console.log('   Checking for empty pages...');
  const emptyPageIssues = checkEmptyPages(pages);
  issues.push(...emptyPageIssues);
  console.log(`     Found ${emptyPageIssues.length} issues\n`);
  
  // Check required fields
  console.log('   Checking required fields...');
  const fieldIssues = checkRequiredFields(pages);
  issues.push(...fieldIssues);
  console.log(`     Found ${fieldIssues.length} issues\n`);
  
  // Check orphan pages
  console.log('   Checking for orphan pages...');
  let navigation;
  try {
    navigation = getNavigation();
  } catch {
    navigation = { main: [] };
  }
  const orphanIssues = checkOrphanPages(pages, navigation);
  issues.push(...orphanIssues);
  console.log(`     Found ${orphanIssues.length} issues\n`);
  
  // Check links
  console.log('   Checking links...');
  let brokenLinkCount = 0;
  let missingAssetCount = 0;
  
  for (const [pageKey, page] of pages.entries()) {
    const [category, slug] = pageKey.split(':');
    const brokenLinks = validatePageLinks(page, slug, pages, assetsDir);
    
    for (const brokenLink of brokenLinks) {
      if (brokenLink.type === 'asset') {
        missingAssetCount++;
        issues.push({
          type: 'missing-asset',
          severity: 'error',
          page: slug,
          category,
          message: brokenLink.error,
          details: {
            link: brokenLink.link,
            context: brokenLink.context,
            lineNumber: brokenLink.lineNumber,
          },
        });
      } else {
        brokenLinkCount++;
        issues.push({
          type: 'broken-link',
          severity: 'error',
          page: slug,
          category,
          message: brokenLink.error,
          details: {
            link: brokenLink.link,
            context: brokenLink.context,
            lineNumber: brokenLink.lineNumber,
          },
        });
      }
    }
  }
  console.log(`     Found ${brokenLinkCount} broken links and ${missingAssetCount} missing assets\n`);
  
  // Generate summary
  const summary = {
    errors: issues.filter(i => i.severity === 'error').length,
    warnings: issues.filter(i => i.severity === 'warning').length,
    info: issues.filter(i => i.severity === 'info').length,
    byType: issues.reduce((acc, issue) => {
      acc[issue.type] = (acc[issue.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
  
  const report: QAReport = {
    totalPages: pages.size,
    issues,
    summary,
    brokenLinks: brokenLinkCount,
    missingAssets: missingAssetCount,
    emptyPages: emptyPageIssues.filter(i => i.severity === 'error').length,
    orphanPages: orphanIssues.length,
  };
  
  // Write report
  const reportPath = path.join(outputDir, 'qa-report.json');
  fs.writeFileSync(
    reportPath,
    JSON.stringify(report, null, 2),
    'utf8'
  );
  
  // Print summary
  console.log('📊 QA Summary:');
  console.log(`   Total pages: ${report.totalPages}`);
  console.log(`   ❌ Errors: ${summary.errors}`);
  console.log(`   ⚠️  Warnings: ${summary.warnings}`);
  console.log(`   ℹ️  Info: ${summary.info}`);
  console.log(`\n   Issues by type:`);
  Object.entries(summary.byType).forEach(([type, count]) => {
    console.log(`     ${type}: ${count}`);
  });
  console.log(`\n📄 Report saved to: ${reportPath}\n`);
  
  return report;
}

