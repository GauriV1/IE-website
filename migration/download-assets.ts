// PHASE D: Download assets from migrated markdown content

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'pages');
const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets', 'migrated');
const EXPORTS_DIR = path.join(process.cwd(), 'migration', 'exports');

interface AssetResult {
  originalUrl: string;
  localPath?: string;
  success: boolean;
  error?: string;
  size?: number;
}

interface AssetReport {
  totalAssets: number;
  downloaded: number;
  failed: number;
  results: AssetResult[];
}

/**
 * Extract image URLs from markdown
 */
function extractImageUrls(markdown: string): string[] {
  const urls = new Set<string>();
  
  // Markdown images: ![alt](url)
  const markdownImagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = markdownImagePattern.exec(markdown)) !== null) {
    const url = match[2];
    if (url.startsWith('http')) {
      urls.add(url);
    }
  }
  
  // HTML images: <img src="url">
  const htmlImagePattern = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  while ((match = htmlImagePattern.exec(markdown)) !== null) {
    const url = match[1];
    if (url.startsWith('http')) {
      urls.add(url);
    }
  }
  
  return Array.from(urls);
}

/**
 * Download an image
 */
async function downloadImage(url: string): Promise<AssetResult> {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ContentMigration/1.0)',
      },
    });
    
    // Determine extension
    const contentType = response.headers['content-type'] || '';
    let extension = '.jpg';
    if (contentType.includes('png')) extension = '.png';
    else if (contentType.includes('gif')) extension = '.gif';
    else if (contentType.includes('webp')) extension = '.webp';
    else if (contentType.includes('svg')) extension = '.svg';
    
    // Generate filename
    const urlPath = new URL(url).pathname;
    const baseName = path.basename(urlPath, path.extname(urlPath)) || 'image';
    const fileName = `${baseName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}${extension}`;
    const localPath = path.join(ASSETS_DIR, fileName);
    
    // Ensure directory exists
    if (!fs.existsSync(ASSETS_DIR)) {
      fs.mkdirSync(ASSETS_DIR, { recursive: true });
    }
    
    // Skip if already exists
    if (fs.existsSync(localPath)) {
      return {
        originalUrl: url,
        localPath: `/assets/migrated/${fileName}`,
        success: true,
        size: fs.statSync(localPath).size,
      };
    }
    
    // Write file
    fs.writeFileSync(localPath, Buffer.from(response.data));
    
    return {
      originalUrl: url,
      localPath: `/assets/migrated/${fileName}`,
      success: true,
      size: response.data.length,
    };
  } catch (error: any) {
    return {
      originalUrl: url,
      success: false,
      error: error.message,
    };
  }
}

/**
 * Rewrite image URLs in markdown
 */
function rewriteImageUrls(markdown: string, urlMap: Map<string, string>): string {
  let rewritten = markdown;
  
  // Rewrite markdown images
  rewritten = rewritten.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, url) => {
      if (url.startsWith('http') && urlMap.has(url)) {
        return `![${alt}](${urlMap.get(url)})`;
      }
      return match;
    }
  );
  
  // Rewrite HTML images
  rewritten = rewritten.replace(
    /<img([^>]+)src=["']([^"']+)["']([^>]*)>/gi,
    (match, before, url, after) => {
      if (url.startsWith('http') && urlMap.has(url)) {
        return `<img${before}src="${urlMap.get(url)}"${after}>`;
      }
      return match;
    }
  );
  
  return rewritten;
}

/**
 * Main asset download function
 */
async function main() {
  console.log('🖼️  PHASE D: Downloading assets...\n');
  
  // Ensure assets directory exists
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }
  
  // Get all markdown files
  const categories = ['tasks', 'policies', 'teams', 'tools', 'news', 'about'];
  const allImageUrls = new Set<string>();
  const pageImageMap = new Map<string, string[]>();
  
  for (const category of categories) {
    const categoryDir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(categoryDir)) continue;
    
    const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      const filePath = path.join(categoryDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const { data, content: markdown } = matter(content);
      
      const imageUrls = extractImageUrls(markdown);
      if (imageUrls.length > 0) {
        pageImageMap.set(filePath, imageUrls);
        imageUrls.forEach(url => allImageUrls.add(url));
      }
    }
  }
  
  console.log(`   Found ${allImageUrls.size} unique images to download\n`);
  
  // Download all images
  const results: AssetResult[] = [];
  const urlMap = new Map<string, string>();
  
  let index = 0;
  for (const url of allImageUrls) {
    index++;
    console.log(`   [${index}/${allImageUrls.size}] Downloading: ${url.substring(0, 60)}...`);
    
    const result = await downloadImage(url);
    results.push(result);
    
    if (result.success && result.localPath) {
      urlMap.set(url, result.localPath);
    }
    
    // Politeness delay
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  // Rewrite URLs in markdown files
  console.log('\n   Rewriting image URLs in markdown files...');
  let rewrittenCount = 0;
  
  for (const [filePath, imageUrls] of pageImageMap.entries()) {
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: markdown } = matter(content);
    
    const rewritten = rewriteImageUrls(markdown, urlMap);
    
    if (rewritten !== markdown) {
      const newContent = matter.stringify(rewritten, data);
      fs.writeFileSync(filePath, newContent, 'utf8');
      rewrittenCount++;
    }
  }
  
  // Generate report
  const report: AssetReport = {
    totalAssets: allImageUrls.size,
    downloaded: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results,
  };
  
  fs.writeFileSync(
    path.join(EXPORTS_DIR, 'assets-report.json'),
    JSON.stringify(report, null, 2),
    'utf8'
  );
  
  console.log(`\n✅ Asset download complete!`);
  console.log(`   Total images: ${report.totalAssets}`);
  console.log(`   ✅ Downloaded: ${report.downloaded}`);
  console.log(`   ❌ Failed: ${report.failed}`);
  console.log(`   Files updated: ${rewrittenCount}`);
  console.log(`   Assets saved to: public/assets/migrated/`);
  console.log(`   Report saved to: migration/exports/assets-report.json\n`);
}

main();

