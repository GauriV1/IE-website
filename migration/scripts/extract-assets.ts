// Extract asset URLs from markdown content

import { ContentPage } from '../../lib/content/types';

interface AssetReference {
  url: string;
  type: 'image' | 'file' | 'unknown';
  context: string; // Where it was found (markdown, frontmatter, etc.)
  lineNumber?: number;
}

/**
 * Extract all asset URLs from a content page
 */
export function extractAssets(page: ContentPage): AssetReference[] {
  const assets: AssetReference[] = [];
  
  // Extract from markdown content
  const markdownAssets = extractFromMarkdown(page.content);
  assets.push(...markdownAssets);
  
  // Extract from frontmatter attachments
  if (page.frontmatter.attachments) {
    for (const attachment of page.frontmatter.attachments) {
      if (attachment.url) {
        assets.push({
          url: attachment.url,
          type: determineAssetType(attachment.url),
          context: 'frontmatter.attachments',
        });
      }
    }
  }
  
  // Extract from related links (if they're external URLs)
  if (page.frontmatter.relatedLinks) {
    for (const link of page.frontmatter.relatedLinks) {
      if (link.type === 'external' && link.url) {
        // Only include if it looks like an asset
        if (isAssetUrl(link.url)) {
          assets.push({
            url: link.url,
            type: determineAssetType(link.url),
            context: 'frontmatter.relatedLinks',
          });
        }
      }
    }
  }
  
  return assets;
}

/**
 * Extract image and file URLs from markdown content
 */
function extractFromMarkdown(markdown: string): AssetReference[] {
  const assets: AssetReference[] = [];
  const lines = markdown.split('\n');
  
  // Pattern for markdown images: ![alt](url)
  const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  
  // Pattern for markdown links that might be files: [text](url)
  const linkPattern = /\[([^\]]*)\]\(([^)]+)\)/g;
  
  // Pattern for HTML img tags: <img src="url" ...>
  const htmlImagePattern = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  
  // Pattern for HTML a tags with file links: <a href="url">...</a>
  const htmlLinkPattern = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
  
  lines.forEach((line, index) => {
    // Extract markdown images
    let match;
    while ((match = imagePattern.exec(line)) !== null) {
      const url = match[2];
      if (isAssetUrl(url)) {
        assets.push({
          url,
          type: determineAssetType(url),
          context: 'markdown.image',
          lineNumber: index + 1,
        });
      }
    }
    
    // Reset regex
    imagePattern.lastIndex = 0;
    
    // Extract markdown links (check if they're assets)
    while ((match = linkPattern.exec(line)) !== null) {
      const url = match[2];
      if (isAssetUrl(url) && !url.startsWith('#')) {
        assets.push({
          url,
          type: determineAssetType(url),
          context: 'markdown.link',
          lineNumber: index + 1,
        });
      }
    }
    
    linkPattern.lastIndex = 0;
    
    // Extract HTML images
    while ((match = htmlImagePattern.exec(line)) !== null) {
      const url = match[1];
      if (isAssetUrl(url)) {
        assets.push({
          url,
          type: determineAssetType(url),
          context: 'html.image',
          lineNumber: index + 1,
        });
      }
    }
    
    htmlImagePattern.lastIndex = 0;
    
    // Extract HTML links (check if they're assets)
    while ((match = htmlLinkPattern.exec(line)) !== null) {
      const url = match[1];
      if (isAssetUrl(url) && !url.startsWith('#')) {
        assets.push({
          url,
          type: determineAssetType(url),
          context: 'html.link',
          lineNumber: index + 1,
        });
      }
    }
    
    htmlLinkPattern.lastIndex = 0;
  });
  
  return assets;
}

/**
 * Determine if a URL is likely an asset (image or file)
 */
function isAssetUrl(url: string): boolean {
  // Skip relative URLs, anchors, and data URIs
  if (url.startsWith('#') || url.startsWith('data:') || url.startsWith('mailto:')) {
    return false;
  }
  
  // Check for common asset extensions
  const urlLower = url.toLowerCase();
  const assetExtensions = [
    // Images
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico',
    // Documents
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    // Archives
    '.zip', '.rar', '.tar', '.gz',
    // Other
    '.csv', '.txt',
  ];
  
  if (assetExtensions.some(ext => urlLower.includes(ext))) {
    return true;
  }
  
  // Check for image-related keywords in URL
  if (urlLower.includes('image') || urlLower.includes('img') || urlLower.includes('photo') || urlLower.includes('picture')) {
    return true;
  }
  
  // Check if it's an external URL (likely an asset if it has an extension)
  if (url.startsWith('http') && /\.\w{2,4}(\?|$|#)/.test(url)) {
    return true;
  }
  
  return false;
}

/**
 * Determine asset type from URL
 */
function determineAssetType(url: string): 'image' | 'file' | 'unknown' {
  const urlLower = url.toLowerCase();
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
  if (imageExtensions.some(ext => urlLower.includes(ext))) {
    return 'image';
  }
  
  if (urlLower.includes('image') || urlLower.includes('img') || urlLower.includes('photo') || urlLower.includes('picture')) {
    return 'image';
  }
  
  return 'file';
}

/**
 * Get unique asset URLs from an array of assets
 */
export function getUniqueAssets(assets: AssetReference[]): string[] {
  const uniqueUrls = new Set<string>();
  for (const asset of assets) {
    // Normalize URL (remove query params and fragments for comparison)
    try {
      const url = new URL(asset.url);
      url.search = '';
      url.hash = '';
      uniqueUrls.add(url.toString());
    } catch {
      // If URL parsing fails, use as-is
      uniqueUrls.add(asset.url);
    }
  }
  return Array.from(uniqueUrls);
}

