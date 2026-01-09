// Asset migration orchestrator

import fs from 'fs';
import path from 'path';
import { downloadAsset, isImageUrl, isFileUrl } from './download-asset';
import { extractAssets, getUniqueAssets } from './extract-assets';
import { rewriteAssetUrls } from './rewrite-assets';
import { ContentPage } from '../../lib/content/types';

interface AssetMigrationResult {
  originalUrl: string;
  localPath?: string;
  success: boolean;
  error?: string;
  size?: number;
  type: 'image' | 'file' | 'unknown';
}

interface AssetMigrationReport {
  totalAssets: number;
  downloaded: number;
  failed: number;
  skipped: number;
  results: AssetMigrationResult[];
  totalSize: number;
}

/**
 * Migrate assets for a single content page
 */
export async function migratePageAssets(
  page: ContentPage,
  contentDir: string,
  assetsDir: string,
  basePath: string = '/assets'
): Promise<{ updatedContent: string; assetResults: AssetMigrationResult[] }> {
  // Extract all asset URLs from the page
  const assetRefs = extractAssets(page);
  const uniqueUrls = getUniqueAssets(assetRefs);
  
  if (uniqueUrls.length === 0) {
    return {
      updatedContent: page.content,
      assetResults: [],
    };
  }
  
  // Download assets
  const assetResults: AssetMigrationResult[] = [];
  const assetMappings: Array<{ originalUrl: string; localPath: string }> = [];
  
  for (const url of uniqueUrls) {
    // Determine asset type and subdirectory
    const isImage = isImageUrl(url);
    const assetSubDir = isImage 
      ? path.join(assetsDir, 'images')
      : path.join(assetsDir, 'files');
    
    const assetBasePath = isImage ? '/assets/images' : '/assets/files';
    
    // Download asset
    const result = await downloadAsset(url, assetSubDir, assetBasePath);
    
    assetResults.push({
      originalUrl: url,
      localPath: result.localPath,
      success: result.success,
      error: result.error,
      size: result.size,
      type: isImage ? 'image' : (isFileUrl(url) ? 'file' : 'unknown'),
    });
    
    if (result.success && result.localPath) {
      assetMappings.push({
        originalUrl: url,
        localPath: result.localPath,
      });
    }
  }
  
  // Rewrite URLs in content
  const updatedContent = rewriteAssetUrls(page.content, assetMappings);
  
  return {
    updatedContent,
    assetResults,
  };
}

/**
 * Migrate assets for all pages in a directory
 */
export async function migrateDirectoryAssets(
  pagesDir: string,
  assetsDir: string,
  basePath: string = '/assets'
): Promise<AssetMigrationReport> {
  const report: AssetMigrationReport = {
    totalAssets: 0,
    downloaded: 0,
    failed: 0,
    skipped: 0,
    results: [],
    totalSize: 0,
  };
  
  // Get all markdown files
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
      
      // Parse frontmatter and content
      const { data, content } = matter(fileContents);
      
      const page: ContentPage = {
        frontmatter: data,
        content,
      };
      
      // Migrate assets for this page
      const { updatedContent, assetResults } = await migratePageAssets(
        page,
        categoryDir,
        assetsDir,
        basePath
      );
      
      // Update report
      report.results.push(...assetResults);
      report.totalAssets += assetResults.length;
      report.downloaded += assetResults.filter(r => r.success).length;
      report.failed += assetResults.filter(r => !r.success).length;
      report.totalSize += assetResults
        .filter(r => r.size)
        .reduce((sum, r) => sum + (r.size || 0), 0);
      
      // Write updated content back to file
      if (updatedContent !== content) {
        const updatedFile = matter.stringify(updatedContent, data);
        fs.writeFileSync(filePath, updatedFile, 'utf8');
      }
    }
  }
  
  return report;
}

/**
 * Generate asset migration report
 */
export function generateAssetReport(
  report: AssetMigrationReport,
  outputPath: string
): void {
  const reportData = {
    summary: {
      totalAssets: report.totalAssets,
      downloaded: report.downloaded,
      failed: report.failed,
      skipped: report.skipped,
      totalSize: report.totalSize,
      totalSizeMB: (report.totalSize / (1024 * 1024)).toFixed(2),
    },
    byType: {
      images: report.results.filter(r => r.type === 'image').length,
      files: report.results.filter(r => r.type === 'file').length,
      unknown: report.results.filter(r => r.type === 'unknown').length,
    },
    failures: report.results
      .filter(r => !r.success)
      .map(r => ({
        url: r.originalUrl,
        error: r.error,
      })),
    results: report.results,
  };
  
  fs.writeFileSync(
    outputPath,
    JSON.stringify(reportData, null, 2),
    'utf8'
  );
}

