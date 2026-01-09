// Duplicate and similarity detection utility

import { ContentPage } from '../../lib/content/types';
import { compareTwoStrings } from 'string-similarity';

interface SimilarityMatch {
  page1: ContentPage;
  page2: ContentPage;
  similarity: number;
  type: 'title' | 'content' | 'both';
}

interface DuplicateGroup {
  pages: ContentPage[];
  canonical: ContentPage;
  duplicates: ContentPage[];
  similarity: number;
}

/**
 * Calculate similarity between two strings
 */
function calculateSimilarity(str1: string, str2: string): number {
  return compareTwoStrings(
    str1.toLowerCase().trim(),
    str2.toLowerCase().trim()
  );
}

/**
 * Extract key terms from text (for better matching)
 */
function extractKeyTerms(text: string): string[] {
  // Remove common words and extract meaningful terms
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this',
    'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
  ]);
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
}

/**
 * Find similar pages based on title and content
 */
export function findSimilarPages(
  pages: ContentPage[],
  threshold: number = 0.7
): SimilarityMatch[] {
  const matches: SimilarityMatch[] = [];
  
  for (let i = 0; i < pages.length; i++) {
    for (let j = i + 1; j < pages.length; j++) {
      const page1 = pages[i];
      const page2 = pages[j];
      
      // Skip if different categories (unless explicitly checking cross-category)
      if (page1.frontmatter.category !== page2.frontmatter.category) {
        continue;
      }
      
      // Calculate title similarity
      const titleSimilarity = calculateSimilarity(
        page1.frontmatter.title,
        page2.frontmatter.title
      );
      
      // Calculate content similarity (using summary and first part of content)
      const content1 = `${page1.frontmatter.summary} ${page1.content.substring(0, 500)}`;
      const content2 = `${page2.frontmatter.summary} ${page2.content.substring(0, 500)}`;
      const contentSimilarity = calculateSimilarity(content1, content2);
      
      // Calculate combined similarity
      const combinedSimilarity = (titleSimilarity * 0.6) + (contentSimilarity * 0.4);
      
      if (combinedSimilarity >= threshold) {
        let type: 'title' | 'content' | 'both';
        if (titleSimilarity >= threshold && contentSimilarity >= threshold) {
          type = 'both';
        } else if (titleSimilarity >= threshold) {
          type = 'title';
        } else {
          type = 'content';
        }
        
        matches.push({
          page1,
          page2,
          similarity: combinedSimilarity,
          type,
        });
      }
    }
  }
  
  // Sort by similarity (highest first)
  return matches.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Group similar pages into duplicate groups
 */
export function groupDuplicates(
  pages: ContentPage[],
  threshold: number = 0.8
): DuplicateGroup[] {
  const matches = findSimilarPages(pages, threshold);
  const groups: DuplicateGroup[] = [];
  const processed = new Set<string>();
  
  for (const match of matches) {
    const slug1 = match.page1.frontmatter.slug;
    const slug2 = match.page2.frontmatter.slug;
    
    // Skip if already processed
    if (processed.has(slug1) || processed.has(slug2)) {
      continue;
    }
    
    // Determine canonical page (prefer the one with more content or better slug)
    let canonical: ContentPage;
    let duplicate: ContentPage;
    
    if (
      match.page1.content.length > match.page2.content.length ||
      (match.page1.content.length === match.page2.content.length &&
       match.page1.frontmatter.slug.length < match.page2.frontmatter.slug.length)
    ) {
      canonical = match.page1;
      duplicate = match.page2;
    } else {
      canonical = match.page2;
      duplicate = match.page1;
    }
    
    // Check if there are more pages in this group
    const groupPages = [canonical, duplicate];
    for (const otherMatch of matches) {
      if (
        (otherMatch.page1.frontmatter.slug === slug1 || otherMatch.page1.frontmatter.slug === slug2 ||
         otherMatch.page2.frontmatter.slug === slug1 || otherMatch.page2.frontmatter.slug === slug2) &&
        !groupPages.some(p => 
          p.frontmatter.slug === otherMatch.page1.frontmatter.slug ||
          p.frontmatter.slug === otherMatch.page2.frontmatter.slug
        )
      ) {
        const otherPage = otherMatch.page1.frontmatter.slug === slug1 || otherMatch.page1.frontmatter.slug === slug2
          ? otherMatch.page2
          : otherMatch.page1;
        groupPages.push(otherPage);
      }
    }
    
    groups.push({
      pages: groupPages,
      canonical,
      duplicates: groupPages.filter(p => p.frontmatter.slug !== canonical.frontmatter.slug),
      similarity: match.similarity,
    });
    
    // Mark as processed
    groupPages.forEach(p => processed.add(p.frontmatter.slug));
  }
  
  return groups;
}

/**
 * Detect potential duplicates based on title patterns
 */
export function detectTitlePatterns(pages: ContentPage[]): SimilarityMatch[] {
  const matches: SimilarityMatch[] = [];
  
  for (let i = 0; i < pages.length; i++) {
    for (let j = i + 1; j < pages.length; j++) {
      const page1 = pages[i];
      const page2 = pages[j];
      
      // Skip if different categories
      if (page1.frontmatter.category !== page2.frontmatter.category) {
        continue;
      }
      
      const title1 = page1.frontmatter.title.toLowerCase();
      const title2 = page2.frontmatter.title.toLowerCase();
      
      // Check for common patterns
      const patterns = [
        // "Policy" vs "Policy Name"
        /^(.*?)\s+(policy|procedure|guideline)$/i,
        // "How to X" vs "X"
        /^how\s+to\s+(.+)$/i,
        // Plural vs singular
        /^(.+?)(s|ies|es)?$/i,
      ];
      
      // Extract base terms
      const terms1 = extractKeyTerms(title1);
      const terms2 = extractKeyTerms(title2);
      
      // Check if one title contains the other
      if (title1.includes(title2) || title2.includes(title1)) {
        const similarity = calculateSimilarity(title1, title2);
        if (similarity >= 0.6) {
          matches.push({
            page1,
            page2,
            similarity,
            type: 'title',
          });
        }
      }
      
      // Check for significant term overlap
      const commonTerms = terms1.filter(t => terms2.includes(t));
      if (commonTerms.length >= 2 && commonTerms.length / Math.max(terms1.length, terms2.length) >= 0.5) {
        const similarity = calculateSimilarity(title1, title2);
        if (similarity >= 0.6 && !matches.some(m => 
          (m.page1.frontmatter.slug === page1.frontmatter.slug && m.page2.frontmatter.slug === page2.frontmatter.slug) ||
          (m.page1.frontmatter.slug === page2.frontmatter.slug && m.page2.frontmatter.slug === page1.frontmatter.slug)
        )) {
          matches.push({
            page1,
            page2,
            similarity,
            type: 'title',
          });
        }
      }
    }
  }
  
  return matches.sort((a, b) => b.similarity - a.similarity);
}

