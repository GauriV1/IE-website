// PHASE 4: Download images and rewrite markdown links
// Parses markdown files for image URLs, downloads them, and rewrites references

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { URL } from 'url';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'pages');
const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets', 'migrated');
const EXPORTS_DIR = path.join(process.cwd(), 'migration', 'exports');
const BASE_URL = 'https://cyan-tangerine-w282.squarespace.com';

interface AssetReport {
  total: number;
  downloaded: number;
  failed: number;
  skipped: number;
  assets: Array<{
    originalUrl: string;
    localPath: string;
    filename: string;
    status: 'downloaded' | 'failed' | 'skipped';
    error?: string;
  }>;
  timestamp: string;
}

/**
 * Extract image URLs from markdown content
 */
function extractImageUrls(markdown: string): string[] {
  const urls: string[] = [];
  
  // Match markdown image syntax: ![alt](url)
  const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = markdownImageRegex.exec(markdown)) !== null) {
    urls.push(match[2]);
  }
  
  // Match HTML img tags: <img src="url">
  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  while ((match = htmlImageRegex.exec(markdown)) !== null) {
    urls.push(match[1]);
  }
  
  return urls;
}

/**
 * Resolve relative URL to absolute
 */
function resolveUrl(url: string, baseUrl: string = BASE_URL): string {
  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return url;
  }
}

/**
 * Get filename from URL
 */
function getFilename(url: string): string {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    const filename = path.basename(pathname) || 'image';
    
    // Ensure we have an extension
    if (!path.extname(filename)) {
      // Try to get extension from content-type or default to .jpg
      return `${filename}.jpg`;
    }
    
    // Sanitize filename
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .toLowerCase();
  } catch {
    // Fallback: generate filename from URL hash
    const hash = url.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0) | 0;
    }, 0).toString(36);
    return `image_${hash}.jpg`;
  }
}

/**
 * Download an image
 */
async function downloadImage(url: string, outputPath: string): Promise<{ success: boolean; size?: number; error?: string }> {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000,
      maxRedirects: 5,
      validateStatus: (status) => status < 400,
    });
    
    if (response.status >= 200 && response.status < 300) {
      fs.writeFileSync(outputPath, response.data);
      return { success: true, size: response.data.length };
    } else {
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Unknown error' };
  }
}

/**
 * Process a single markdown file
 */
async function processMarkdownFile(filePath: string): Promise<{ urls: string[]; updated: boolean }> {
  const content = fs.readFileSync(filePath, 'utf8');
  const imageUrls = extractImageUrls(content);
  
  if (imageUrls.length === 0) {
    return { urls: [], updated: false };
  }
  
  let updatedContent = content;
  const processedUrls = new Set<string>();
  
  for (const originalUrl of imageUrls) {
    if (processedUrls.has(originalUrl)) continue;
    processedUrls.add(originalUrl);
    
    // Skip data URLs and already local paths
    if (originalUrl.startsWith('data:') || originalUrl.startsWith('/assets/')) {
      continue;
    }
    
    // Resolve relative URLs
    const absoluteUrl = resolveUrl(originalUrl);
    
    // Download image
    const filename = getFilename(absoluteUrl);
    const localPath = path.join(ASSETS_DIR, filename);
    const publicPath = `/assets/migrated/${filename}`;
    
    // Check if already downloaded
    if (!fs.existsSync(localPath)) {
      const result = await downloadImage(absoluteUrl, localPath);
      if (!result.success) {
        console.log(`      ⚠️  Failed to download: ${absoluteUrl}`);
        continue;
      }
    }
    
    // Rewrite markdown image references
    // Replace both markdown and HTML img tags
    updatedContent = updatedContent.replace(
      new RegExp(`!\\[([^\\]]*)\\]\\(${originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g'),
      `![$1](${publicPath})`
    );
    
    updatedContent = updatedContent.replace(
      new RegExp(`<img([^>]+)src=["']${originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']([^>]*)>`, 'gi'),
      `<img$1src="${publicPath}"$2>`
    );
  }
  
  // Write updated content if changed
  if (updatedContent !== content) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    return { urls: Array.from(processedUrls), updated: true };
  }
  
  return { urls: Array.from(processedUrls), updated: false };
}

/**
 * Main assets function
 */
async function downloadAssets(): Promise<void> {
  console.log('🖼️  PHASE 4: Downloading images and rewriting links...\n');
  
  // Ensure assets directory exists
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }
  
  // Get all markdown files
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error('   ❌ Content directory not found. Run PHASE 3 (extract) first.');
    return;
  }
  
  const markdownFiles = fs.readdirSync(CONTENT_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(CONTENT_DIR, file));
  
  if (markdownFiles.length === 0) {
    console.error('   ❌ No markdown files found. Run PHASE 3 (extract) first.');
    return;
  }
  
  console.log(`   📋 Processing ${markdownFiles.length} markdown files...\n`);
  
  const report: AssetReport = {
    total: 0,
    downloaded: 0,
    failed: 0,
    skipped: 0,
    assets: [],
    timestamp: new Date().toISOString(),
  };
  
  const allImageUrls = new Set<string>();
  
  // First pass: collect all image URLs
  for (const filePath of markdownFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const urls = extractImageUrls(content);
    urls.forEach(url => {
      if (!url.startsWith('data:') && !url.startsWith('/assets/')) {
        allImageUrls.add(resolveUrl(url));
      }
    });
  }
  
  report.total = allImageUrls.size;
  console.log(`   🖼️  Found ${report.total} unique image URLs\n`);
  
  // Download images
  for (const url of allImageUrls) {
    const filename = getFilename(url);
    const localPath = path.join(ASSETS_DIR, filename);
    
    // Skip if already exists
    if (fs.existsSync(localPath)) {
      report.skipped++;
      report.assets.push({
        originalUrl: url,
        localPath: `/assets/migrated/${filename}`,
        filename,
        status: 'skipped',
      });
      continue;
    }
    
    console.log(`   📥 Downloading: ${filename}`);
    const result = await downloadImage(url, localPath);
    
    if (result.success) {
      report.downloaded++;
      report.assets.push({
        originalUrl: url,
        localPath: `/assets/migrated/${filename}`,
        filename,
        status: 'downloaded',
      });
    } else {
      report.failed++;
      report.assets.push({
        originalUrl: url,
        localPath: `/assets/migrated/${filename}`,
        filename,
        status: 'failed',
        error: result.error,
      });
    }
    
    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  // Second pass: rewrite markdown references
  console.log(`\n   🔄 Rewriting markdown image references...\n`);
  let updatedFiles = 0;
  
  for (const filePath of markdownFiles) {
    const result = await processMarkdownFile(filePath);
    if (result.updated) {
      updatedFiles++;
      console.log(`   ✅ Updated: ${path.basename(filePath)}`);
    }
  }
  
  // Save report
  const reportPath = path.join(EXPORTS_DIR, 'assets-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  
  console.log(`\n✅ PHASE 4 Complete:`);
  console.log(`   📥 Downloaded: ${report.downloaded} images`);
  console.log(`   ⏭️  Skipped: ${report.skipped} (already exists)`);
  console.log(`   ❌ Failed: ${report.failed} images`);
  console.log(`   🔄 Updated: ${updatedFiles} markdown files`);
  console.log(`   📄 Assets saved to: ${ASSETS_DIR}`);
  console.log(`   📋 Report saved to: ${reportPath}\n`);
}

// Run if executed directly
if (require.main === module) {
  downloadAssets()
    .then(() => {
      console.log('🎉 Asset download complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Asset download failed:', error);
      process.exit(1);
    });
}

export { downloadAssets };

