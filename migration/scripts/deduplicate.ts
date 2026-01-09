// Deduplication and consolidation script

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getContentPages, ContentPage } from '../../lib/content/types';
import { groupDuplicates, findSimilarPages, detectTitlePatterns } from './detect-duplicates';

interface DeduplicationAction {
  type: 'merge' | 'redirect' | 'consolidate' | 'keep-separate';
  canonical: ContentPage;
  duplicates: ContentPage[];
  reason: string;
  similarity: number;
}

interface DeduplicationReport {
  totalPages: number;
  duplicateGroups: number;
  actions: DeduplicationAction[];
  summary: {
    merged: number;
    redirected: number;
    consolidated: number;
    keptSeparate: number;
  };
}

/**
 * Generate deduplication report
 */
export function generateDeduplicationReport(
  pagesDir: string,
  outputDir: string
): DeduplicationReport {
  console.log('🔍 Analyzing content for duplicates...\n');
  
  const categories = ['tasks', 'policies', 'teams', 'tools', 'news'];
  const allPages: ContentPage[] = [];
  
  // Load all pages
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
      
      allPages.push({
        frontmatter: data as any,
        content,
      });
    }
  }
  
  console.log(`   Found ${allPages.length} pages to analyze\n`);
  
  // Group by category for analysis
  const pagesByCategory = allPages.reduce((acc, page) => {
    const cat = page.frontmatter.category;
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(page);
    return acc;
  }, {} as Record<string, ContentPage[]>);
  
  const report: DeduplicationReport = {
    totalPages: allPages.length,
    duplicateGroups: 0,
    actions: [],
    summary: {
      merged: 0,
      redirected: 0,
      consolidated: 0,
      keptSeparate: 0,
    },
  };
  
  // Analyze each category
  for (const [category, pages] of Object.entries(pagesByCategory)) {
    console.log(`   Analyzing ${category} (${pages.length} pages)...`);
    
    // Find high-similarity duplicates (>= 0.8)
    const duplicateGroups = groupDuplicates(pages, 0.8);
    
    // Find medium-similarity matches (0.6-0.8)
    const similarMatches = findSimilarPages(pages, 0.6).filter(
      m => m.similarity < 0.8
    );
    
    // Detect title patterns
    const titlePatterns = detectTitlePatterns(pages);
    
    // Process duplicate groups (high similarity)
    for (const group of duplicateGroups) {
      report.duplicateGroups++;
      
      // Determine action
      let action: DeduplicationAction;
      
      if (group.similarity >= 0.9) {
        // Very high similarity - merge
        action = {
          type: 'merge',
          canonical: group.canonical,
          duplicates: group.duplicates,
          reason: `Very high similarity (${(group.similarity * 100).toFixed(1)}%) - recommend merging`,
          similarity: group.similarity,
        };
        report.summary.merged++;
      } else if (group.similarity >= 0.85) {
        // High similarity - redirect
        action = {
          type: 'redirect',
          canonical: group.canonical,
          duplicates: group.duplicates,
          reason: `High similarity (${(group.similarity * 100).toFixed(1)}%) - recommend redirecting duplicates to canonical`,
          similarity: group.similarity,
        };
        report.summary.redirected++;
      } else {
        // Medium-high similarity - consolidate
        action = {
          type: 'consolidate',
          canonical: group.canonical,
          duplicates: group.duplicates,
          reason: `Similar content (${(group.similarity * 100).toFixed(1)}%) - recommend consolidating into related links`,
          similarity: group.similarity,
        };
        report.summary.consolidated++;
      }
      
      report.actions.push(action);
      
      console.log(`     ⚠️  Found duplicate group:`);
      console.log(`        Canonical: ${group.canonical.frontmatter.title} (${group.canonical.frontmatter.slug})`);
      group.duplicates.forEach(dup => {
        console.log(`        Duplicate: ${dup.frontmatter.title} (${dup.frontmatter.slug})`);
      });
      console.log(`        Similarity: ${(group.similarity * 100).toFixed(1)}%`);
      console.log(`        Action: ${action.type}\n`);
    }
    
    // Process title patterns (potential duplicates)
    for (const match of titlePatterns) {
      // Skip if already in a duplicate group
      const alreadyProcessed = report.actions.some(a =>
        a.canonical.frontmatter.slug === match.page1.frontmatter.slug ||
        a.canonical.frontmatter.slug === match.page2.frontmatter.slug ||
        a.duplicates.some(d => d.frontmatter.slug === match.page1.frontmatter.slug) ||
        a.duplicates.some(d => d.frontmatter.slug === match.page2.frontmatter.slug)
      );
      
      if (!alreadyProcessed && match.similarity >= 0.7) {
        // Determine canonical (prefer shorter slug or more content)
        const canonical = match.page1.content.length >= match.page2.content.length
          ? match.page1
          : match.page2;
        const duplicate = canonical === match.page1 ? match.page2 : match.page1;
        
        action = {
          type: 'consolidate',
          canonical,
          duplicates: [duplicate],
          reason: `Similar titles (${(match.similarity * 100).toFixed(1)}%) - consider consolidating`,
          similarity: match.similarity,
        };
        
        report.actions.push(action);
        report.summary.consolidated++;
        
        console.log(`     ℹ️  Found similar titles:`);
        console.log(`        ${match.page1.frontmatter.title} vs ${match.page2.frontmatter.title}`);
        console.log(`        Similarity: ${(match.similarity * 100).toFixed(1)}%\n`);
      }
    }
  }
  
  // Write report
  const reportPath = path.join(outputDir, 'deduplication-report.json');
  fs.writeFileSync(
    reportPath,
    JSON.stringify(report, null, 2),
    'utf8'
  );
  
  // Print summary
  console.log('\n📊 Deduplication Summary:');
  console.log(`   Total pages analyzed: ${report.totalPages}`);
  console.log(`   Duplicate groups found: ${report.duplicateGroups}`);
  console.log(`   Actions recommended:`);
  console.log(`     Merge: ${report.summary.merged}`);
  console.log(`     Redirect: ${report.summary.redirected}`);
  console.log(`     Consolidate: ${report.summary.consolidated}`);
  console.log(`\n📄 Report saved to: ${reportPath}\n`);
  
  return report;
}

/**
 * Apply deduplication actions (merge, redirect, consolidate)
 */
export function applyDeduplication(
  pagesDir: string,
  report: DeduplicationReport,
  dryRun: boolean = true
): void {
  console.log(dryRun ? '🔍 DRY RUN - No files will be modified\n' : '✏️  Applying deduplication actions...\n');
  
  for (const action of report.actions) {
    const category = action.canonical.frontmatter.category;
    const categoryDir = path.join(pagesDir, category);
    
    if (action.type === 'merge') {
      console.log(`   Merging ${action.duplicates.length} duplicate(s) into ${action.canonical.frontmatter.title}...`);
      
      // Read canonical page
      const canonicalPath = path.join(categoryDir, `${action.canonical.frontmatter.slug}.md`);
      const canonicalContent = fs.readFileSync(canonicalPath, 'utf8');
      const canonicalParsed = matter(canonicalContent);
      
      // Merge content from duplicates
      let mergedContent = canonicalParsed.content;
      const mergedRelatedLinks = [...(canonicalParsed.data.relatedLinks || [])];
      
      for (const duplicate of action.duplicates) {
        const duplicatePath = path.join(categoryDir, `${duplicate.frontmatter.slug}.md`);
        const duplicateContent = fs.readFileSync(duplicatePath, 'utf8');
        const duplicateParsed = matter(duplicateContent);
        
        // Add duplicate content as a section
        mergedContent += `\n\n## Related: ${duplicate.frontmatter.title}\n\n${duplicateParsed.content}`;
        
        // Add to related links
        mergedRelatedLinks.push({
          type: action.canonical.frontmatter.category as any,
          slug: duplicate.frontmatter.slug,
          name: duplicate.frontmatter.title,
        });
        
        // Delete duplicate file
        if (!dryRun) {
          fs.unlinkSync(duplicatePath);
          console.log(`     Deleted: ${duplicate.frontmatter.slug}.md`);
        }
      }
      
      // Update canonical page
      canonicalParsed.data.relatedLinks = mergedRelatedLinks;
      const updatedContent = matter.stringify(mergedContent, canonicalParsed.data);
      
      if (!dryRun) {
        fs.writeFileSync(canonicalPath, updatedContent, 'utf8');
        console.log(`     Updated: ${action.canonical.frontmatter.slug}.md`);
      }
    } else if (action.type === 'redirect' || action.type === 'consolidate') {
      console.log(`   ${action.type === 'redirect' ? 'Redirecting' : 'Consolidating'} ${action.duplicates.length} page(s) to ${action.canonical.frontmatter.title}...`);
      
      // Update canonical page with related links
      const canonicalPath = path.join(categoryDir, `${action.canonical.frontmatter.slug}.md`);
      const canonicalContent = fs.readFileSync(canonicalPath, 'utf8');
      const canonicalParsed = matter(canonicalContent);
      
      const relatedLinks = [...(canonicalParsed.data.relatedLinks || [])];
      
      for (const duplicate of action.duplicates) {
        relatedLinks.push({
          type: action.canonical.frontmatter.category as any,
          slug: duplicate.frontmatter.slug,
          name: duplicate.frontmatter.title,
        });
        
        // For redirect, create a redirect page
        if (action.type === 'redirect' && !dryRun) {
          const duplicatePath = path.join(categoryDir, `${duplicate.frontmatter.slug}.md`);
          const redirectContent = `---
title: "${duplicate.frontmatter.title}"
slug: "${duplicate.frontmatter.slug}"
category: "${category}"
audience: ["all"]
tags: []
summary: "This page has been consolidated. Please see the related page below."
relatedLinks:
  - type: "${category}"
    slug: "${action.canonical.frontmatter.slug}"
    name: "${action.canonical.frontmatter.title}"
sourceUrl: "${duplicate.frontmatter.sourceUrl || ''}"
---

# ${duplicate.frontmatter.title}

This content has been consolidated. Please see: [${action.canonical.frontmatter.title}](/{{category}}/${action.canonical.frontmatter.slug})
`;
          fs.writeFileSync(duplicatePath, redirectContent, 'utf8');
          console.log(`     Created redirect: ${duplicate.frontmatter.slug}.md`);
        }
      }
      
      canonicalParsed.data.relatedLinks = relatedLinks;
      const updatedContent = matter.stringify(canonicalParsed.content, canonicalParsed.data);
      
      if (!dryRun) {
        fs.writeFileSync(canonicalPath, updatedContent, 'utf8');
        console.log(`     Updated: ${action.canonical.frontmatter.slug}.md`);
      }
    }
  }
  
  if (dryRun) {
    console.log('\n✅ Dry run complete. Use --apply flag to actually modify files.\n');
  } else {
    console.log('\n✅ Deduplication complete!\n');
  }
}

